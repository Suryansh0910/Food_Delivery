import express from 'express';
import { getMyRestaurant, getPendingRestaurants, approveRestaurant, toggleRestaurantStatus, getRestaurants, getAdminStats, getOwnerStats, getRestaurantById, addMenuItem } from '../controllers/restaurantController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, getRestaurants);
router.get('/my-restaurant', protect, getMyRestaurant);
router.get('/my-restaurant/stats', protect, getOwnerStats);
router.put('/my-restaurant/toggle', protect, toggleRestaurantStatus);
router.post('/my-restaurant/menu', protect, addMenuItem);
router.get('/admin/stats', protect, admin, getAdminStats);
router.get('/pending', protect, admin, getPendingRestaurants);
router.get('/:id', protect, getRestaurantById);
router.put('/:id/approve', protect, admin, approveRestaurant);

export default router;
