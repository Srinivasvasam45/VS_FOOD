const express = require('express');
const router = express.Router();
const {
  getAllPartners,
  getPartnerById,
  getCurrentPartnerProfile,
  updatePartnerProfile,
} = require('../controllers/foodPartnerController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getAllPartners);
router.get(
  '/profile/me',
  protect,
  authorize('foodPartner'),
  getCurrentPartnerProfile
);
router.put(
  '/profile',
  protect,
  authorize('foodPartner'),
  updatePartnerProfile
);
router.get('/:id', getPartnerById);

module.exports = router;
