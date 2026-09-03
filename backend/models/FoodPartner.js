const mongoose = require('mongoose');

const foodPartnerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    restaurantName: {
      type: String,
      required: [true, 'Please provide restaurant name'],
      trim: true,
      index: true,
    },
    username: {
      type: String,
      required: [true, 'Please provide restaurant handle/username'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      default: 'Authentic flavors and delightful dining experience.',
    },
    profileImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80',
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      required: [true, 'Please provide restaurant address'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'Please provide city'],
      trim: true,
    },
    state: {
      type: String,
      default: '',
      trim: true,
    },
    pincode: {
      type: String,
      default: '',
      trim: true,
    },
    latitude: {
      type: Number,
      required: [true, 'Please provide restaurant latitude for distance calculation'],
      default: 17.3850,
    },
    longitude: {
      type: Number,
      required: [true, 'Please provide restaurant longitude for distance calculation'],
      default: 78.4867,
    },
    cuisine: {
      type: [String],
      default: ['Multi-Cuisine'],
    },
    openingHours: {
      type: String,
      default: '10:00 AM - 11:00 PM',
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
  },
  {
    timestamps: true,
  }
);

// Compound text index for search
foodPartnerSchema.index({ restaurantName: 'text', description: 'text', city: 'text' });

const FoodPartner = mongoose.model('FoodPartner', foodPartnerSchema);

module.exports = FoodPartner;
