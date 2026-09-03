const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');

/**
 * @desc    Get current user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return ApiResponse.error(res, 'User not found', 404);
    }
    return ApiResponse.success(res, user, 'User profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return ApiResponse.error(res, 'User not found', 404);
    }

    const { name, phone, profileImage } = req.body;

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (profileImage) user.profileImage = profileImage;

    const updatedUser = await user.save();

    return ApiResponse.success(
      res,
      updatedUser,
      'Profile updated successfully'
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};
