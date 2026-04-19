import { Request, Response } from 'express';
import Order from '../models/Order';
import Restaurant from '../models/Restaurant';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { restaurantId, items, totalAmount, deliveryAddress } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
      customer: req.user._id,
      restaurant: restaurantId,
      items,
      totalAmount,
      deliveryAddress,
      status: 'pending',
      paymentStatus: 'pending' // Simplified for MVP COD
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get logged in user orders (Customer)
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'User not authorized' });
    const orders = await Order.find({ customer: req.user._id })
      .populate('restaurant', 'name image address')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get owner's incoming orders (Restaurant Owner)
// @route   GET /api/orders/restaurant
// @access  Private
export const getRestaurantOrders = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'User not authorized' });
    
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found for this owner' });
    }

    const orders = await Order.find({ restaurant: restaurant._id })
      .populate('customer', 'name email city area')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Owner/Admin)
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status;
      // If it's delivered, we realistically would charge payment, but since it's COD:
      if (status === 'delivered') order.paymentStatus = 'completed';
      
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
