import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User';
import Restaurant from './models/Restaurant';
import MenuItem from './models/MenuItem';

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/food_delivery')
  .then(() => console.log('MongoDB Connected for Seeding'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

const seedDatabase = async () => {
  try {
    // 1. Clear existing data
    await User.deleteMany();
    await Restaurant.deleteMany();
    await MenuItem.deleteMany();

    console.log('Cleared existing database data...');

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    // 2. Create sample users
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@fooddash.com',
      password, // Still password123 for simplicity in the test env
      role: 'admin',
      city: 'Delhi',
      area: 'Connaught Place'
    });

    const owner = await User.create({
      name: 'Gordon Owner',
      email: 'owner@test.com',
      password,
      role: 'owner',
      city: 'Mumbai',
      area: 'Bandra'
    });

    const customer = await User.create({
      name: 'Hungry Harry',
      email: 'customer@test.com',
      password,
      role: 'customer',
      city: 'Mumbai',
      area: 'Bandra'
    });

    // 3. Create an approved restaurant for the first owner
    const restaurant = await Restaurant.create({
      owner: owner._id,
      name: 'Burger Brutalism',
      description: 'The most hardcore and honest burgers in town. No fluff.',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      address: {
        street: '123 Pixel Street',
        city: 'Mumbai',
        area: 'Bandra',
        pincode: '400050'
      },
      timings: {
        openingTime: '11:00 AM',
        closingTime: '11:00 PM'
      },
      isVegOnly: false,
      isOpen: true,
      isApproved: true
    });

    const pendingOwner = await User.create({
      name: 'Pending Pete',
      email: 'pete@test.com',
      password,
      role: 'owner',
      city: 'Pune',
      area: 'Koregaon Park'
    });

    const pendingRestaurant = await Restaurant.create({
      owner: pendingOwner._id,
      name: 'Sushi Shadows',
      description: 'Dark kitchen sushi rolls.',
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
      address: {
        street: '404 Hidden Alley',
        city: 'Pune',
        area: 'Koregaon Park',
        pincode: '411001'
      },
      timings: {
        openingTime: '06:00 PM',
        closingTime: '02:00 AM'
      },
      isVegOnly: false,
      isOpen: false,
      isApproved: false // Admin needs to approve this!
    });

    // 4. Create menu items for the restaurant
    await MenuItem.create([
      {
        restaurant: restaurant._id,
        name: 'The Mega Smash',
        description: 'Double patty, smashed into oblivion with sharp cheddar.',
        price: 18.99,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
        category: 'Burgers',
        isAvailable: true
      },
      {
        restaurant: restaurant._id,
        name: 'Toxic Waste Fries',
        description: 'Fries drenched in our signature bright green jalapeno cheese sauce.',
        price: 7.99,
        image: 'https://images.unsplash.com/photo-1565299507177-b08bc88b7596?auto=format&fit=crop&w=400&q=80',
        category: 'Sides',
        isAvailable: true
      }
    ]);

    console.log('Database seeded successfully! 🌱');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
