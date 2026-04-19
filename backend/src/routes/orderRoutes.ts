import express from 'express';
import { createOrder, getMyOrders, getRestaurantOrders, updateOrderStatus } from '../controllers/orderController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, authorize('customer'), createOrder);
router.get('/myorders', protect, authorize('customer'), getMyOrders);
router.get('/restaurant', protect, authorize('owner'), getRestaurantOrders);
router.put('/:id/status', protect, authorize('owner', 'admin'), updateOrderStatus);

export default router;
