const express = require('express');
const router = express.Router();
const {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
} = require('../controllers/foodController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

const foodUploadFields = upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
  { name: 'image', maxCount: 1 },
]);

router.get('/', getFoods);
router.get('/:id', getFoodById);

router.post(
  '/',
  protect,
  authorize('foodPartner'),
  foodUploadFields,
  createFood
);

router.put(
  '/:id',
  protect,
  authorize('foodPartner'),
  foodUploadFields,
  updateFood
);

router.delete('/:id', protect, authorize('foodPartner'), deleteFood);

module.exports = router;
