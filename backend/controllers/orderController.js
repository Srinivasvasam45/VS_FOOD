const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Food = require('../models/Food');
const FoodPartner = require('../models/FoodPartner');
const ApiResponse = require('../utils/apiResponse');

// Allowed sequential status transitions
const validStatusTransitions = {
  pending: ['accepted', 'cancelled'],
  accepted: ['preparing', 'cancelled'],
  preparing: ['outForDelivery', 'cancelled'],
  outForDelivery: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
};

/**
 * @desc    Create a new order from current cart
 * @route   POST /api/orders
 * @access  Private
 */
const createOrder = async (req, res, next) => {
  try {
    const { deliveryAddress, paymentMethod = 'Cash on Delivery' } = req.body;

    if (
      !deliveryAddress ||
      !deliveryAddress.name ||
      !deliveryAddress.phone ||
      !deliveryAddress.address ||
      !deliveryAddress.city ||
      !deliveryAddress.pincode
    ) {
      return ApiResponse.error(
        res,
        'Please provide a complete delivery address (name, phone, address, city, pincode)',
        400
      );
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart || !cart.items || cart.items.length === 0) {
      return ApiResponse.error(
        res,
        'Your cart is empty. Please add food items before placing an order.',
        400
      );
    }

    // Single restaurant check & server-side price calculation
    const restaurantId = cart.items[0].foodPartner;
    const foodPartner = await FoodPartner.findById(restaurantId);

    if (!foodPartner) {
      return ApiResponse.error(res, 'Restaurant for this order was not found', 404);
    }

    let subtotal = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const foodDoc = await Food.findById(item.food);

      if (!foodDoc) {
        return ApiResponse.error(
          res,
          'One or more items in your cart are no longer available. Please update your cart.',
          400
        );
      }

      if (!foodDoc.isAvailable) {
        return ApiResponse.error(
          res,
          `'${foodDoc.name}' is currently marked unavailable by the restaurant.`,
          400
        );
      }

      const itemSubtotal = foodDoc.price * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        food: foodDoc._id,
        name: foodDoc.name,
        price: foodDoc.price,
        quantity: item.quantity,
        subtotal: itemSubtotal,
        thumbnailUrl: foodDoc.thumbnailUrl || foodDoc.imageUrl || '',
      });
    }

    const deliveryFee = 40;
    const totalAmount = subtotal + deliveryFee;

    // Unique readable order ID
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(
      100 + Math.random() * 900
    )}`;

    const order = await Order.create({
      orderNumber,
      user: req.user._id,
      foodPartner: foodPartner._id,
      items: orderItems,
      deliveryAddress,
      subtotal,
      deliveryFee,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'pending' : 'paid',
      orderStatus: 'pending',
    });

    // Clear user cart upon successful order creation
    cart.items = [];
    await cart.save();

    const populatedOrder = await Order.findById(order._id).populate(
      'foodPartner',
      'restaurantName username profileImage phone address city latitude longitude'
    );

    return ApiResponse.success(
      res,
      populatedOrder,
      'Order placed successfully!',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all orders for the current user
 * @route   GET /api/orders
 * @access  Private
 */
const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate(
        'foodPartner',
        'restaurantName username profileImage phone address city latitude longitude'
      )
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, orders, 'Orders fetched successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate('user', 'name email phone')
      .populate(
        'foodPartner',
        'restaurantName username profileImage phone address city latitude longitude'
      );

    if (!order) {
      return ApiResponse.error(res, 'Order not found', 404);
    }

    // Security check: Either ordering user or the restaurant partner can view order details
    const isOwner = order.user._id.toString() === req.user._id.toString();
    const partner = await FoodPartner.findOne({ user: req.user._id });
    const isPartner =
      partner && order.foodPartner._id.toString() === partner._id.toString();

    if (!isOwner && !isPartner) {
      return ApiResponse.error(
        res,
        'Forbidden. You are not authorized to view this order.',
        403
      );
    }

    return ApiResponse.success(res, order, 'Order details fetched successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get partner's restaurant orders
 * @route   GET /api/orders/partner/all
 * @access  Private (FoodPartner)
 */
const getPartnerOrders = async (req, res, next) => {
  try {
    const partner = await FoodPartner.findOne({ user: req.user._id });

    if (!partner) {
      return ApiResponse.error(res, 'Food partner profile not found', 403);
    }

    const { status } = req.query;
    const query = { foodPartner: partner._id };

    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email phone profileImage')
      .sort({ createdAt: -1 });

    return ApiResponse.success(
      res,
      orders,
      'Restaurant orders fetched successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id/status
 * @access  Private (FoodPartner)
 */
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const partner = await FoodPartner.findOne({ user: req.user._id });
    if (!partner) {
      return ApiResponse.error(res, 'Food partner profile not found', 403);
    }

    const order = await Order.findById(id);
    if (!order) {
      return ApiResponse.error(res, 'Order not found', 404);
    }

    // Verify order belongs to this restaurant
    if (order.foodPartner.toString() !== partner._id.toString()) {
      return ApiResponse.error(
        res,
        'Forbidden. This order belongs to another restaurant.',
        403
      );
    }

    const currentStatus = order.orderStatus;
    const allowedNextStatuses = validStatusTransitions[currentStatus] || [];

    if (!allowedNextStatuses.includes(status)) {
      return ApiResponse.error(
        res,
        `Invalid status transition from '${currentStatus}' to '${status}'. Allowed next statuses: ${allowedNextStatuses.join(
          ', '
        ) || 'None (order terminal)'}`,
        400
      );
    }

    order.orderStatus = status;

    if (status === 'delivered' && order.paymentMethod === 'Cash on Delivery') {
      order.paymentStatus = 'paid';
    }

    const updatedOrder = await order.save();

    return ApiResponse.success(
      res,
      updatedOrder,
      `Order status updated to '${status}' successfully`
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  getPartnerOrders,
  updateOrderStatus,
};
