import { Request, Response } from 'express';
import Restaurant from '../models/Restaurant';

// @desc    Get owner's personal restaurant
// @route   GET /api/restaurants/my-restaurant
// @access  Private (Owner)
export const getMyRestaurant = async (req: Request, res: Response) => {
  try {
    // req.user comes from auth middleware
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const restaurant = await Restaurant.findOne({ owner: req.user._id });

    if (restaurant) {
      res.json(restaurant);
    } else {
      res.status(404).json({ message: 'Restaurant profile not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all pending restaurants
// @route   GET /api/restaurants/pending
// @access  Private (Admin)
export const getPendingRestaurants = async (req: Request, res: Response) => {
  try {
    const restaurants = await Restaurant.find({ isApproved: false }).populate('owner', 'name email');
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Approve a restaurant
// @route   PUT /api/restaurants/:id/approve
// @access  Private (Admin)
export const approveRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (restaurant) {
      restaurant.isApproved = true;
      const updatedRestaurant = await restaurant.save();
      res.json(updatedRestaurant);
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
