const Food = require('../models/Food');
const FoodPartner = require('../models/FoodPartner');
const ApiResponse = require('../utils/apiResponse');
const calculateDistance = require('../utils/haversine');
const { uploadToCloudinary } = require('../middleware/uploadMiddleware');

/**
 * @desc    Get foods / reel feed with search, filtering, and distance
 * @route   GET /api/foods
 * @access  Public
 */
const getFoods = async (req, res, next) => {
  try {
    const {
      search,
      category,
      foodType,
      minRating,
      maxPrice,
      foodPartner,
      isAvailable,
      lat,
      lng,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (foodType && foodType !== 'all') {
      query.foodType = foodType;
    }

    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    if (maxPrice) {
      query.price = { $lte: Number(maxPrice) };
    }

    if (foodPartner) {
      query.foodPartner = foodPartner;
    }

    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === 'true' || isAvailable === true;
    } else {
      // By default show available foods
      query.isAvailable = true;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Food.countDocuments(query);
    const foods = await Food.find(query)
      .populate('foodPartner', 'restaurantName username profileImage coverImage phone address city latitude longitude rating totalReviews')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const userLat = lat ? parseFloat(lat) : null;
    const userLng = lng ? parseFloat(lng) : null;

    const formattedFoods = foods.map((food) => {
      const foodObj = food.toObject();
      if (
        userLat !== null &&
        userLng !== null &&
        foodObj.foodPartner &&
        foodObj.foodPartner.latitude &&
        foodObj.foodPartner.longitude
      ) {
        foodObj.distanceKm = calculateDistance(
          userLat,
          userLng,
          foodObj.foodPartner.latitude,
          foodObj.foodPartner.longitude
        );
      } else {
        foodObj.distanceKm = null;
      }
      return foodObj;
    });

    return ApiResponse.success(
      res,
      {
        foods: formattedFoods,
        pagination: {
          total,
          page: pageNum,
          pages: Math.ceil(total / limitNum) || 1,
          limit: limitNum,
        },
      },
      'Food reels fetched successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single food item by ID
 * @route   GET /api/foods/:id
 * @access  Public
 */
const getFoodById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { lat, lng } = req.query;

    const food = await Food.findById(id).populate(
      'foodPartner',
      'restaurantName username profileImage coverImage phone address city latitude longitude rating totalReviews cuisine openingHours'
    );

    if (!food) {
      return ApiResponse.error(res, 'Food item not found', 404);
    }

    const foodObj = food.toObject();

    if (
      lat &&
      lng &&
      foodObj.foodPartner &&
      foodObj.foodPartner.latitude &&
      foodObj.foodPartner.longitude
    ) {
      foodObj.distanceKm = calculateDistance(
        parseFloat(lat),
        parseFloat(lng),
        foodObj.foodPartner.latitude,
        foodObj.foodPartner.longitude
      );
    }

    return ApiResponse.success(res, foodObj, 'Food details fetched successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new food item / reel
 * @route   POST /api/foods
 * @access  Private (FoodPartner)
 */
const createFood = async (req, res, next) => {
  try {
    const partner = await FoodPartner.findOne({ user: req.user._id });

    if (!partner) {
      return ApiResponse.error(
        res,
        'Food partner profile not found. Please create your restaurant profile first.',
        403
      );
    }

    const {
      name,
      description,
      price,
      category,
      foodType = 'veg',
      isAvailable = true,
    } = req.body;

    let videoUrl = req.body.videoUrl;
    let thumbnailUrl = req.body.thumbnailUrl || '';
    let imageUrl = req.body.imageUrl || '';

    // Handle file uploads if files provided via multipart/form-data
    if (req.files) {
      if (req.files.video && req.files.video[0]) {
        const videoResult = await uploadToCloudinary(
          req.files.video[0].buffer,
          'vs_food/videos',
          'video'
        );
        videoUrl = videoResult.secure_url;
      }

      if (req.files.thumbnail && req.files.thumbnail[0]) {
        const thumbResult = await uploadToCloudinary(
          req.files.thumbnail[0].buffer,
          'vs_food/thumbnails',
          'image'
        );
        thumbnailUrl = thumbResult.secure_url;
      }

      if (req.files.image && req.files.image[0]) {
        const imgResult = await uploadToCloudinary(
          req.files.image[0].buffer,
          'vs_food/images',
          'image'
        );
        imageUrl = imgResult.secure_url;
      }
    }

    if (!name || !price || !category) {
      return ApiResponse.error(
        res,
        'Name, price, and category are required fields.',
        400
      );
    }

    if (!videoUrl) {
      return ApiResponse.error(
        res,
        'Food reel video URL or video file upload is required.',
        400
      );
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      return ApiResponse.error(res, 'Price must be a valid positive number.', 400);
    }

    const newFood = await Food.create({
      foodPartner: partner._id,
      name,
      description: description || '',
      price: numericPrice,
      category,
      foodType,
      videoUrl,
      thumbnailUrl: thumbnailUrl || imageUrl || '',
      imageUrl: imageUrl || thumbnailUrl || '',
      isAvailable: isAvailable === 'true' || isAvailable === true,
    });

    const populatedFood = await Food.findById(newFood._id).populate(
      'foodPartner',
      'restaurantName username profileImage address city rating'
    );

    return ApiResponse.success(
      res,
      populatedFood,
      'Food reel created successfully',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a food item / reel
 * @route   PUT /api/foods/:id
 * @access  Private (FoodPartner)
 */
const updateFood = async (req, res, next) => {
  try {
    const { id } = req.params;
    const partner = await FoodPartner.findOne({ user: req.user._id });

    if (!partner) {
      return ApiResponse.error(res, 'Food partner profile not found.', 403);
    }

    const food = await Food.findById(id);

    if (!food) {
      return ApiResponse.error(res, 'Food item not found.', 404);
    }

    // Backend security check: strictly ensure the food belongs to this food partner
    if (food.foodPartner.toString() !== partner._id.toString()) {
      return ApiResponse.error(
        res,
        'Forbidden. You are not authorized to update food items belonging to another restaurant.',
        403
      );
    }

    const {
      name,
      description,
      price,
      category,
      foodType,
      videoUrl,
      thumbnailUrl,
      imageUrl,
      isAvailable,
    } = req.body;

    if (name) food.name = name;
    if (description !== undefined) food.description = description;
    if (price !== undefined) {
      const numericPrice = Number(price);
      if (isNaN(numericPrice) || numericPrice < 0) {
        return ApiResponse.error(res, 'Price must be a valid positive number.', 400);
      }
      food.price = numericPrice;
    }
    if (category) food.category = category;
    if (foodType) food.foodType = foodType;
    if (videoUrl) food.videoUrl = videoUrl;
    if (thumbnailUrl !== undefined) food.thumbnailUrl = thumbnailUrl;
    if (imageUrl !== undefined) food.imageUrl = imageUrl;
    if (isAvailable !== undefined) {
      food.isAvailable = isAvailable === 'true' || isAvailable === true;
    }

    // Handle uploaded files if any
    if (req.files) {
      if (req.files.video && req.files.video[0]) {
        const videoResult = await uploadToCloudinary(
          req.files.video[0].buffer,
          'vs_food/videos',
          'video'
        );
        food.videoUrl = videoResult.secure_url;
      }
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        const thumbResult = await uploadToCloudinary(
          req.files.thumbnail[0].buffer,
          'vs_food/thumbnails',
          'image'
        );
        food.thumbnailUrl = thumbResult.secure_url;
      }
    }

    const updatedFood = await food.save();

    return ApiResponse.success(res, updatedFood, 'Food item updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a food item
 * @route   DELETE /api/foods/:id
 * @access  Private (FoodPartner)
 */
const deleteFood = async (req, res, next) => {
  try {
    const { id } = req.params;
    const partner = await FoodPartner.findOne({ user: req.user._id });

    if (!partner) {
      return ApiResponse.error(res, 'Food partner profile not found.', 403);
    }

    const food = await Food.findById(id);

    if (!food) {
      return ApiResponse.error(res, 'Food item not found.', 404);
    }

    // Backend security check: strictly ensure the food belongs to this food partner
    if (food.foodPartner.toString() !== partner._id.toString()) {
      return ApiResponse.error(
        res,
        'Forbidden. You cannot delete food belonging to another restaurant.',
        403
      );
    }

    await Food.findByIdAndDelete(id);

    return ApiResponse.success(res, {}, 'Food item deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
};
