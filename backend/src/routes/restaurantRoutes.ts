import express from 'express';
import { getMyRestaurant, getPendingRestaurants, approveRestaurant, toggleRestaurantStatus, getRestaurants, getAdminStats } from '../controllers/restaurantController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, getRestaurants);
router.get('/my-restaurant', protect, getMyRestaurant);
router.put('/my-restaurant/toggle', protect, toggleRestaurantStatus);
router.get('/admin/stats', protect, admin, getAdminStats);
router.get('/pending', protect, admin, getPendingRestaurants);
router.put('/:id/approve', protect, admin, approveRestaurant);

export default router;
