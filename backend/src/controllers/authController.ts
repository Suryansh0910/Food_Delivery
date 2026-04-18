import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Restaurant from '../models/Restaurant';

const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { 
      name, email, password, role, 
      restaurantName, street, city, pincode, 
      openingTime, closingTime, restaurantDescription 
    } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // If owner, require restaurant data
    if (role === 'owner' && (!restaurantName || !street || !city || !pincode || !openingTime || !closingTime)) {
      return res.status(400).json({ message: 'Restaurant Name, both Timings, and full Address are required for owners' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Prevent manually registering as admin unless you are already an admin
    const assignedRole = role === 'owner' ? 'owner' : 'customer';

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: assignedRole,
    });

    if (user && assignedRole === 'owner') {
      await Restaurant.create({
        owner: user._id,
        name: restaurantName,
        address: {
          street,
          city,
          pincode
        },
        timings: {
          openingTime,
          closingTime
        },
        description: restaurantDescription || 'A new restaurant on FoodDash!',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', // Default image
        isApproved: false // Requires admin approval to go live
      });
    }

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id, user.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && user.password && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid check credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
        return res.status(401).json({ message: 'User not found in request' });
    }
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
