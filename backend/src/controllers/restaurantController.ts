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

    // Base filter: Only approved, open restaurants that actually have menu items
    const filter: any = { 
        isApproved: true, 
        isOpen: true,
        $and: [
            { menu: { $exists: true } },
            { $expr: { $gt: [{ $size: "$menu" }, 0] } }
        ]
    };

    if (city && city !== 'null' && city !== 'undefined') {
      filter['address.city'] = { $regex: new RegExp(`^${city}$`, 'i') };
    }

    const { search } = req.query;
    if (search) {
      const searchRegex = { $regex: new RegExp(search as string, 'i') };
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { 'menu.name': searchRegex },
        { 'menu.category': searchRegex }
      ];
    }

    // Find all matching in city
    let restaurants = await Restaurant.find(filter).populate('owner', 'name');

    console.log(`Found ${restaurants.length} restaurants matching filter.`);

    // Sorting: If area is provided, sort restaurants in that area FIRST
    if (area && area !== 'null' && area !== 'undefined') {
      const targetArea = (area as string).toLowerCase();
      restaurants = restaurants.sort((a, b) => {
        const aIsArea = a.address.area.toLowerCase() === targetArea;
        const bIsArea = b.address.area.toLowerCase() === targetArea;
        if (aIsArea && !bIsArea) return -1;
        if (!aIsArea && bIsArea) return 1;
        return 0;
      });
    }

    res.json(restaurants);
  } catch (error) {
    console.error('getRestaurants Error:', error);
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
// @desc    Get stats for owner's restaurant
// @route   GET /api/restaurants/my-restaurant/stats
// @access  Private (Owner)
export const getOwnerStats = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });

    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    // Since we don't have an Order model yet in this snippet, 
    // we'll return some mock-but-consistent stats based on the restaurant's metadata
    // In a real app, you would aggregate from the Orders collection

    // Using a simple hash of the restaurant name to generate consistent "fake" stats
    const hash = restaurant.name.length * 7;

    res.json({
      totalOrders: hash * 12,
      todayOrders: Math.floor(hash / 3),
      revenue: hash * 1200,
      todayRevenue: Math.floor(hash / 3) * 450,
      avgWaitTime: 15 + (hash % 10),
      rating: 4.2 + (hash % 8) / 10
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
export const getRestaurantById = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const addMenuItem = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    const { name, description, price, category, isVeg, image } = req.body;
    restaurant.menu.push({ name, description, price, category, isVeg, image } as any);
    await restaurant.save();

    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

