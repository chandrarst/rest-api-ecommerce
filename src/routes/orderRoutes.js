const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, cancelOrder } = require('../controllers/orderController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/checkout', authenticateToken, createOrder);
router.get('/my-orders', authenticateToken, getMyOrders);
router.delete('/:id/cancel', authenticateToken, cancelOrder);

module.exports = router;