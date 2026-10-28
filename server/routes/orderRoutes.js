const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrdersAdmin,
  updateOrderStatusAdmin
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);

router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/admin/all', adminOnly, getAllOrdersAdmin);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);
router.put('/:id/status', adminOnly, updateOrderStatusAdmin);

module.exports = router;
