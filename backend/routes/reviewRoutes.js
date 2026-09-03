const express = require('express');
const router = express.Router();
const {
  addReview,
  getFoodReviews,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:foodId', getFoodReviews);
router.post('/', protect, addReview);

module.exports = router;
