const User = require('../models/User');
const FoodPartner = require('../models/FoodPartner');
const generateToken = require('../utils/generateToken');
const ApiResponse = require('../utils/apiResponse');

/**
 * @desc    Register a new user or food partner
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      role = 'user',
      profileImage,
      // Food Partner specific fields
      restaurantName,
      username,
      address,
      city,
      state,
      pincode,
      cuisine,
      latitude,
      longitude,
    } = req.body;

    if (!name || !email || !password) {
      return ApiResponse.error(res, 'Name, email, and password are required', 400);
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return ApiResponse.error(
        res,
        'A user with this email address already exists. Please log in.',
        400
      );
    }

    // If registering as a food partner, validate restaurant info
    if (role === 'foodPartner') {
      if (!restaurantName || !address || !city) {
        return ApiResponse.error(
          res,
          'Restaurant name, address, and city are required for food partners.',
          400
        );
      }

      const generatedUsername = (
        username ||
        restaurantName.toLowerCase().replace(/[^a-z0-9]/g, '') +
          Math.floor(100 + Math.random() * 900)
      ).toLowerCase();

      const existingPartnerUsername = await FoodPartner.findOne({
        username: generatedUsername,
      });

      if (existingPartnerUsername) {
        return ApiResponse.error(
          res,
          'Restaurant username already taken. Please choose a different handle.',
          400
        );
      }

      // Create User
      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        phone: phone || '',
        role: 'foodPartner',
        profileImage: profileImage || undefined,
      });

      // Create FoodPartner Profile
      const foodPartner = await FoodPartner.create({
        user: user._id,
        restaurantName,
        username: generatedUsername,
        phone: phone || '',
        address,
        city,
        state: state || '',
        pincode: pincode || '',
        cuisine: Array.isArray(cuisine)
          ? cuisine
          : cuisine
          ? cuisine.split(',').map((c) => c.trim())
          : ['Multi-Cuisine'],
        latitude: latitude ? Number(latitude) : 17.3850,
        longitude: longitude ? Number(longitude) : 78.4867,
      });

      const token = generateToken(user._id, user.role);

      return ApiResponse.success(
        res,
        {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            profileImage: user.profileImage,
          },
          partner: foodPartner,
          token,
        },
        'Food partner registered successfully',
        201
      );
    }

    // Normal user registration
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || '',
      role: 'user',
      profileImage: profileImage || undefined,
    });

    const token = generateToken(user._id, user.role);

    return ApiResponse.success(
      res,
      {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          profileImage: user.profileImage,
        },
        token,
      },
      'User registered successfully',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user or food partner
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return ApiResponse.error(res, 'Please provide email and password', 400);
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return ApiResponse.error(res, 'Invalid email or password', 401);
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return ApiResponse.error(res, 'Invalid email or password', 401);
    }

    let partnerProfile = null;
    if (user.role === 'foodPartner') {
      partnerProfile = await FoodPartner.findOne({ user: user._id });
    }

    const token = generateToken(user._id, user.role);

    return ApiResponse.success(
      res,
      {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          profileImage: user.profileImage,
        },
        partner: partnerProfile,
        token,
      },
      'Logged in successfully',
      200
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return ApiResponse.error(res, 'User not found', 404);
    }

    let partnerProfile = null;
    if (user.role === 'foodPartner') {
      partnerProfile = await FoodPartner.findOne({ user: user._id });
    }

    return ApiResponse.success(
      res,
      {
        user,
        partner: partnerProfile,
      },
      'User profile fetched successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user (client-side token removal)
 * @route   POST /api/auth/logout
 * @access  Public
 */
const logout = async (req, res) => {
  return ApiResponse.success(res, {}, 'Logged out successfully');
};

module.exports = {
  register,
  login,
  getMe,
  logout,
};
