import express from 'express';
import { getMyRestaurant, getPendingRestaurants, approveRestaurant } from '../controllers/restaurantController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/my-restaurant', protect, getMyRestaurant);
router.get('/pending', protect, admin, getPendingRestaurants);
router.put('/:id/approve', protect, admin, approveRestaurant);

export default router;
