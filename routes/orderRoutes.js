import express from 'express';
import { createOrder, getOrderById, updateOrderStatus, getMyOrders } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createOrder);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

export default router;