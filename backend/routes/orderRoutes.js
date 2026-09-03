const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  getPartnerOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/partner/all', authorize('foodPartner'), getPartnerOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', authorize('foodPartner'), updateOrderStatus);

module.exports = router;
