const Cart = require('../models/Cart');
const Food = require('../models/Food');
const FoodPartner = require('../models/FoodPartner');
const ApiResponse = require('../utils/apiResponse');

// Helper to format and calculate cart subtotal
const formatCartResponse = async (cart) => {
  if (!cart || !cart.items || cart.items.length === 0) {
    return {
      _id: cart ? cart._id : null,
      user: cart ? cart.user : null,
      items: [],
      restaurant: null,
      subtotal: 0,
      deliveryFee: 0,
      totalAmount: 0,
    };
  }

  await cart.populate([
    {
      path: 'items.food',
      select: 'name price description imageUrl thumbnailUrl videoUrl foodType isAvailable category rating',
    },
    {
      path: 'items.foodPartner',
      select: 'restaurantName username profileImage address city latitude longitude',
    },
  ]);

  let subtotal = 0;
  const validItems = [];

  for (const item of cart.items) {
    if (item.food) {
      const itemSubtotal = item.food.price * item.quantity;
      subtotal += itemSubtotal;
      validItems.push({
        _id: item._id,
        food: item.food,
        foodPartner: item.foodPartner,
        quantity: item.quantity,
        subtotal: itemSubtotal,
      });
    }
  }

  const deliveryFee = validItems.length > 0 ? 40 : 0;
  const totalAmount = subtotal + deliveryFee;
  const activeRestaurant = validItems.length > 0 ? validItems[0].foodPartner : null;

  return {
    _id: cart._id,
    user: cart.user,
    items: validItems,
    restaurant: activeRestaurant,
    subtotal,
    deliveryFee,
    totalAmount,
  };
};

/**
 * @desc    Get current user's cart
 * @route   GET /api/cart
 * @access  Private
 */
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const formattedCart = await formatCartResponse(cart);

    return ApiResponse.success(res, formattedCart, 'Cart fetched successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add item to cart (with single-restaurant validation)
 * @route   POST /api/cart
 * @access  Private
 */
const addToCart = async (req, res, next) => {
  try {
    const { foodId, quantity = 1, forceReset = false } = req.body;

    if (!foodId) {
      return ApiResponse.error(res, 'foodId is required', 400);
    }

    const food = await Food.findById(foodId);
    if (!food) {
      return ApiResponse.error(res, 'Food item not found', 404);
    }

    if (!food.isAvailable) {
      return ApiResponse.error(res, 'This food item is currently unavailable.', 400);
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check for multi-restaurant conflict
    if (cart.items.length > 0) {
      const currentRestaurantId = cart.items[0].foodPartner.toString();
      const newRestaurantId = food.foodPartner.toString();

      if (currentRestaurantId !== newRestaurantId) {
        if (!forceReset) {
          const currentPartner = await FoodPartner.findById(currentRestaurantId);
          const newPartner = await FoodPartner.findById(newRestaurantId);

          return res.status(409).json({
            success: false,
            conflict: true,
            message:
              'Your cart contains items from another restaurant. Would you like to clear the cart and add this item?',
            currentRestaurant: currentPartner ? currentPartner.restaurantName : 'Another restaurant',
            newRestaurant: newPartner ? newPartner.restaurantName : 'New restaurant',
          });
        } else {
          // Reset cart items to start fresh from new restaurant
          cart.items = [];
        }
      }
    }

    // Find if item already exists in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.food.toString() === foodId.toString()
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += Number(quantity);
    } else {
      cart.items.push({
        food: food._id,
        foodPartner: food.foodPartner,
        quantity: Number(quantity),
      });
    }

    await cart.save();

    const formattedCart = await formatCartResponse(cart);

    return ApiResponse.success(res, formattedCart, 'Item added to cart successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update cart item quantity
 * @route   PUT /api/cart/:foodId
 * @access  Private
 */
const updateCartItem = async (req, res, next) => {
  try {
    const { foodId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return ApiResponse.error(res, 'Cart not found', 404);
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.food.toString() === foodId.toString()
    );

    if (itemIndex === -1) {
      return ApiResponse.error(res, 'Item not found in cart', 404);
    }

    const numQty = Number(quantity);
    if (numQty <= 0) {
      // Remove item if quantity is zero or less
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = numQty;
    }

    await cart.save();

    const formattedCart = await formatCartResponse(cart);

    return ApiResponse.success(res, formattedCart, 'Cart updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove an item from cart
 * @route   DELETE /api/cart/:foodId
 * @access  Private
 */
const removeCartItem = async (req, res, next) => {
  try {
    const { foodId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return ApiResponse.error(res, 'Cart not found', 404);
    }

    cart.items = cart.items.filter(
      (item) => item.food.toString() !== foodId.toString()
    );

    await cart.save();

    const formattedCart = await formatCartResponse(cart);

    return ApiResponse.success(res, formattedCart, 'Item removed from cart');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Clear entire cart
 * @route   DELETE /api/cart
 * @access  Private
 */
const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    return ApiResponse.success(
      res,
      { items: [], subtotal: 0, deliveryFee: 0, totalAmount: 0 },
      'Cart cleared successfully'
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
