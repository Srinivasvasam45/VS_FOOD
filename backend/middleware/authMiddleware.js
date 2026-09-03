const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');

/**
 * Middleware to protect routes and verify JWT token
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return ApiResponse.error(
      res,
      'Not authorized to access this route. No token provided.',
      401
    );
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret_key'
    );

    const user = await User.findById(decoded.id);

    if (!user) {
      return ApiResponse.error(
        res,
        'User belonging to this token no longer exists.',
        401
      );
    }

    req.user = user;
    next();
  } catch (error) {
    return ApiResponse.error(
      res,
      'Not authorized to access this route. Invalid or expired token.',
      401
    );
  }
};

/**
 * Middleware to authorize specific user roles
 * @param  {...string} roles 
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return ApiResponse.error(
        res,
        `Role '${req.user ? req.user.role : 'unauthenticated'}' is not authorized to perform this action.`,
        403
      );
    }
    next();
  };
};

module.exports = { protect, authorize };
