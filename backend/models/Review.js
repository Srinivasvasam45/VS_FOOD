const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food',
      required: true,
      index: true,
    },
    foodPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodPartner',
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      trim: true,
      required: [true, 'Please provide a review comment'],
    },
  },
  {
    timestamps: true,
  }
);

// One review per user per food item
reviewSchema.index({ user: 1, food: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
