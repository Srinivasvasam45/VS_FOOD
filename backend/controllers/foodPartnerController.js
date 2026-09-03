const FoodPartner = require('../models/FoodPartner');
const Food = require('../models/Food');
const Order = require('../models/Order');
const ApiResponse = require('../utils/apiResponse');
const calculateDistance = require('../utils/haversine');

/**
 * @desc    Get all food partners (restaurants) with search & distance calculation
 * @route   GET /api/partners
 * @access  Public
 */
const getAllPartners = async (req, res, next) => {
  try {
    const { search, cuisine, lat, lng, city } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { restaurantName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { cuisine: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
      ];
    }

    if (cuisine) {
      query.cuisine = { $in: [new RegExp(cuisine, 'i')] };
    }

    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    const partners = await FoodPartner.find(query).populate('user', 'name email phone');

    // Attach computed distance if user latitude and longitude are supplied
    const userLat = lat ? parseFloat(lat) : null;
    const userLng = lng ? parseFloat(lng) : null;

    const formattedPartners = partners.map((partner) => {
      const partnerObj = partner.toObject();
      if (userLat !== null && userLng !== null) {
        partnerObj.distanceKm = calculateDistance(
          userLat,
          userLng,
          partner.latitude,
          partner.longitude
        );
      } else {
        partnerObj.distanceKm = null;
      }
      return partnerObj;
    });

    // If coordinates were passed, optionally sort by nearest
    if (userLat !== null && userLng !== null) {
      formattedPartners.sort((a, b) => {
        if (a.distanceKm === null) return 1;
        if (b.distanceKm === null) return -1;
        return a.distanceKm - b.distanceKm;
      });
    }

    return ApiResponse.success(
      res,
      formattedPartners,
      'Restaurants fetched successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single partner by ID or username, with their food items
 * @route   GET /api/partners/:id
 * @access  Public
 */
const getPartnerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { lat, lng } = req.query;

    let partner;
    // Check if valid ObjectId or handle/username
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      partner = await FoodPartner.findById(id).populate('user', 'name email phone');
    } else {
      partner = await FoodPartner.findOne({ username: id.toLowerCase() }).populate(
        'user',
        'name email phone'
      );
    }

    if (!partner) {
      return ApiResponse.error(res, 'Restaurant partner not found', 404);
    }

    const foods = await Food.find({ foodPartner: partner._id, isAvailable: true }).sort({
      createdAt: -1,
    });

    const partnerObj = partner.toObject();

    if (lat && lng) {
      partnerObj.distanceKm = calculateDistance(
        parseFloat(lat),
        parseFloat(lng),
        partner.latitude,
        partner.longitude
      );
    }

    return ApiResponse.success(
      res,
      {
        partner: partnerObj,
        foods,
      },
      'Restaurant details fetched successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently logged in food partner profile & dashboard metrics
 * @route   GET /api/partners/profile/me
 * @access  Private (FoodPartner)
 */
const getCurrentPartnerProfile = async (req, res, next) => {
  try {
    const partner = await FoodPartner.findOne({ user: req.user._id }).populate(
      'user',
      'name email phone'
    );

    if (!partner) {
      return ApiResponse.error(
        res,
        'Food partner profile not found for this user account',
        404
      );
    }

    // Dashboard overview metrics
    const totalFoods = await Food.countDocuments({ foodPartner: partner._id });
    const totalOrders = await Order.countDocuments({ foodPartner: partner._id });
    const pendingOrders = await Order.countDocuments({
      foodPartner: partner._id,
      orderStatus: { $in: ['pending', 'accepted', 'preparing', 'outForDelivery'] },
    });
    const completedOrders = await Order.countDocuments({
      foodPartner: partner._id,
      orderStatus: 'delivered',
    });

    return ApiResponse.success(
      res,
      {
        partner,
        stats: {
          totalFoods,
          totalOrders,
          pendingOrders,
          completedOrders,
          rating: partner.rating,
          totalReviews: partner.totalReviews,
        },
      },
      'Partner profile and dashboard stats fetched successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update food partner profile
 * @route   PUT /api/partners/profile
 * @access  Private (FoodPartner)
 */
const updatePartnerProfile = async (req, res, next) => {
  try {
    let partner = await FoodPartner.findOne({ user: req.user._id });

    if (!partner) {
      return ApiResponse.error(res, 'Food partner profile not found', 404);
    }

    const {
      restaurantName,
      description,
      profileImage,
      coverImage,
      phone,
      address,
      city,
      state,
      pincode,
      latitude,
      longitude,
      cuisine,
      openingHours,
    } = req.body;

    if (restaurantName) partner.restaurantName = restaurantName;
    if (description !== undefined) partner.description = description;
    if (profileImage) partner.profileImage = profileImage;
    if (coverImage) partner.coverImage = coverImage;
    if (phone !== undefined) partner.phone = phone;
    if (address) partner.address = address;
    if (city) partner.city = city;
    if (state !== undefined) partner.state = state;
    if (pincode !== undefined) partner.pincode = pincode;
    if (latitude !== undefined) partner.latitude = Number(latitude);
    if (longitude !== undefined) partner.longitude = Number(longitude);
    if (openingHours) partner.openingHours = openingHours;

    if (cuisine) {
      partner.cuisine = Array.isArray(cuisine)
        ? cuisine
        : cuisine.split(',').map((c) => c.trim());
    }

    const updatedPartner = await partner.save();

    return ApiResponse.success(
      res,
      updatedPartner,
      'Restaurant profile updated successfully'
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPartners,
  getPartnerById,
  getCurrentPartnerProfile,
  updatePartnerProfile,
};
