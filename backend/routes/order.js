const express = require('express');
const {
  placeOrder,
  getUserOrders,
  getDeliveryOrders,
  assignDeliveryPartner,
  progressDeliveryOrder,
  getOrderById,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/orderController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', placeOrder);
router.get('/user/:id', auth, getUserOrders);
router.get('/delivery/board', getDeliveryOrders);
router.put('/delivery/:id/accept', assignDeliveryPartner);
router.put('/delivery/:id/progress', progressDeliveryOrder);
router.get('/:id', auth, getOrderById);
router.put('/:id/status', auth, updateOrderStatus);
router.put('/:id/cancel', auth, cancelOrder);

module.exports = router;