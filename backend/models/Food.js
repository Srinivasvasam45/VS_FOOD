const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema(
  {
    foodPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodPartner',
      required: [true, 'Food must belong to a food partner'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide food name'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Please provide food price'],
      min: [0, 'Price must be a positive number'],
    },
    category: {
      type: String,
      required: [true, 'Please provide food category'],
      trim: true,
      index: true,
    },
    foodType: {
      type: String,
      enum: ['veg', 'nonVeg', 'egg'],
      default: 'veg',
      index: true,
    },
    videoUrl: {
      type: String,
      required: [true, 'Please provide a food reel video URL'],
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound text index for search
foodSchema.index({ name: 'text', description: 'text', category: 'text' });

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;
