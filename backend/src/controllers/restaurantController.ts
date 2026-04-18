import { Request, Response } from 'express';
import Restaurant from '../models/Restaurant';
import User from '../models/User';

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

// @desc    Get restaurants by city and optional area
// @route   GET /api/restaurants
// @access  Private (Customer)
export const getRestaurants = async (req: Request, res: Response) => {
  try {
    const { city, area } = req.query;
    
    // Base filter: Only approved and open restaurants in that specific city
    const filter: any = { isApproved: true, isOpen: true };
    if (city) filter['address.city'] = city;
    
    // Find all matching in city
    let restaurants = await Restaurant.find(filter).populate('owner', 'name');
    
    // Sorting: If area is provided, sort restaurants in that area FIRST
    if (area) {
      restaurants = restaurants.sort((a, b) => {
        const aIsArea = a.address.area === area;
        const bIsArea = b.address.area === area;
        if (aIsArea && !bIsArea) return -1;
        if (!aIsArea && bIsArea) return 1;
        return 0;
      });
    }

    res.json(restaurants);
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

// @desc    Toggle Open/Close Status
// @route   PUT /api/restaurants/my-restaurant/toggle
// @access  Private (Owner)
export const toggleRestaurantStatus = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });

    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    restaurant.isOpen = !restaurant.isOpen;
    const updated = await restaurant.save();

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get global statistics for Admin
// @route   GET /api/restaurants/admin/stats
// @access  Private (Admin)
export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const liveRestaurants = await Restaurant.countDocuments({ isApproved: true });
    const pendingRestaurantsCount = await Restaurant.countDocuments({ isApproved: false });
    const currentlyOpen = await Restaurant.countDocuments({ isApproved: true, isOpen: true });
    
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalOwners = await User.countDocuments({ role: 'owner' });

    res.json({
      liveRestaurants,
      pendingRestaurantsCount,
      currentlyOpen,
      totalCustomers,
      totalOwners
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
