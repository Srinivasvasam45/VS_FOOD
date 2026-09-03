const Review = require('../models/Review');
const Food = require('../models/Food');
const FoodPartner = require('../models/FoodPartner');
const ApiResponse = require('../utils/apiResponse');

/**
 * @desc    Add a review for a food item
 * @route   POST /api/reviews
 * @access  Private
 */
const addReview = async (req, res, next) => {
  try {
    const { foodId, rating, comment } = req.body;

    if (!foodId || !rating || !comment) {
      return ApiResponse.error(res, 'Food ID, rating (1-5), and comment are required', 400);
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return ApiResponse.error(res, 'Rating must be a number between 1 and 5', 400);
    }

    const food = await Food.findById(foodId);
    if (!food) {
      return ApiResponse.error(res, 'Food item not found', 404);
    }

    // Check if user already reviewed this food
    const existingReview = await Review.findOne({
      user: req.user._id,
      food: foodId,
    });

    let review;
    if (existingReview) {
      existingReview.rating = numRating;
      existingReview.comment = comment;
      review = await existingReview.save();
    } else {
      review = await Review.create({
        user: req.user._id,
        food: foodId,
        foodPartner: food.foodPartner,
        rating: numRating,
        comment,
      });
    }

    // Recalculate average rating for Food
    const allFoodReviews = await Review.find({ food: foodId });
    const avgFoodRating =
      allFoodReviews.reduce((acc, r) => acc + r.rating, 0) / allFoodReviews.length;

    food.rating = Math.round(avgFoodRating * 10) / 10;
    food.totalReviews = allFoodReviews.length;
    await food.save();

    // Recalculate average rating for FoodPartner
    const allPartnerReviews = await Review.find({ foodPartner: food.foodPartner });
    const avgPartnerRating =
      allPartnerReviews.reduce((acc, r) => acc + r.rating, 0) /
      allPartnerReviews.length;

    await FoodPartner.findByIdAndUpdate(food.foodPartner, {
      rating: Math.round(avgPartnerRating * 10) / 10,
      totalReviews: allPartnerReviews.length,
    });

    const populatedReview = await Review.findById(review._id).populate(
      'user',
      'name profileImage'
    );

    return ApiResponse.success(
      res,
      populatedReview,
      'Review submitted successfully',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get reviews for a food item
 * @route   GET /api/reviews/:foodId
 * @access  Public
 */
const getFoodReviews = async (req, res, next) => {
  try {
    const { foodId } = req.params;

    const reviews = await Review.find({ food: foodId })
      .populate('user', 'name profileImage')
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, reviews, 'Reviews fetched successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addReview,
  getFoodReviews,
};
