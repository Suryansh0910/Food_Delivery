import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User';
import Restaurant from './models/Restaurant';

dotenv.config();

const CITIES = {
  Delhi: ['Connaught Place', 'Saket', 'Hauz Khas', 'Dwarka', 'Rohini', 'Vasant Kunj', 'Karol Bagh', 'Lajpat Nagar', 'Pitampura', 'Janakpuri'],
  Mumbai: ['Andheri', 'Bandra', 'Juhu', 'Colaba', 'Powai', 'Borivali', 'Goregaon', 'Malad', 'Dadar', 'Worli'],
  Pune: ['Koregaon Park', 'Viman Nagar', 'Hinjewadi', 'Kothrud', 'Baner', 'Magarpatta', 'Wakad', 'Kharadi', 'Shivaji Nagar', 'Kalyani Nagar']
};

const REST_ADJS = ['Spicy', 'Brutal', 'Golden', 'Sizzling', 'The Hungry', 'Rustic', 'Cyber', 'Neon', 'Urban', 'Authentic', 'Green', 'Red', 'Crispy', 'Salty', 'Sweet', 'Bitter', 'Royal', 'Grand', 'Little', 'Hidden', 'Midnight', 'Street', 'Cloud', 'Iron', 'Smoky', 'Fresh'];
const REST_NOUNS = ['Wok', 'Spoon', 'Grill', 'Oven', 'Bite', 'Kitchen', 'Diner', 'Eats', 'Cafe', 'Bistro', 'Table', 'House', 'Bowl', 'Plate', 'Leaf', 'Box', 'Dragon', 'Tiger', 'Noodle', 'Slice', 'Crust', 'Burger', 'Taco', 'Melt', 'Roast'];
const DESC_PARTS = ['Serving the best', 'Famous for our', 'Authentic', 'Hearty and warm', 'Freshly prepared'];
const FOODS = ['Pizzas', 'Burgers', 'Sushi rolls', 'street food', 'dumplings', 'curries', 'desserts', 'tacos', 'noodles', 'pastas'];

const FIRST_NAMES = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Ayaan', 'Krishna', 'Ishaan', 'Shaurya', 'Diya', 'Ananya', 'Kiara', 'Aadhya', 'Pari', 'Saanvi', 'Kriti', 'Aditi', 'Riya', 'Nysa'];
const LAST_NAMES = ['Sharma', 'Varma', 'Gupta', 'Patil', 'Deshmukh', 'Singh', 'Kumar', 'Das', 'Roy', 'Chowdhury', 'Nair', 'Menon', 'Jain', 'Mehta', 'Shah'];

const IMAGES = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=400&q=80'
];

const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const generateName = () => `${getRandom(REST_ADJS)} ${getRandom(REST_NOUNS)}`;
const generateDesc = () => `${getRandom(DESC_PARTS)} ${getRandom(FOODS)} exactly the way you like it.`;

const CATEGORIES = ['Starters', 'Mains', 'Desserts', 'Beverages', 'Sides'];
const MENU_ITEMS = {
  'Starters': ['Paneer Tikka', 'Chicken Wings', 'Spring Rolls', 'Brutal Nachos', 'Soup of the Day', 'Garlic Bread', 'Crispy Corn'],
  'Mains': ['Butter Chicken', 'Margherita Pizza', 'Hardcore Burger', 'Truffle Pasta', 'Sushi Platter', 'Veg Biryani', 'Hakka Noodles'],
  'Desserts': ['Death by Chocolate', 'Classic Tiramisu', 'Gulab Jamun', 'New York Cheesecake', 'Ice Cream Sundae'],
  'Beverages': ['Cold Coffee', 'Virgin Mojito', 'Fresh Lime Soda', 'Masala Chai', 'Coke Zero'],
  'Sides': ['French Fries', 'Peri Peri Chips', 'Onion Rings', 'Mashed Potatoes']
};

const generateMenu = (isVegOnly: boolean) => {
  const menu = [];
  for (const cat of CATEGORIES) {
    const itemsCount = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < itemsCount; i++) {
        const itemName = getRandom(MENU_ITEMS[cat as keyof typeof MENU_ITEMS]);
        const isItemVeg = isVegOnly || Math.random() > 0.4;
        menu.push({
            name: itemName,
            description: `${itemName} prepared with premium ingredients and our secret spices.`,
            price: 150 + Math.floor(Math.random() * 800),
            category: cat,
            isVeg: isItemVeg,
            image: getRandom(IMAGES)
        });
    }
  }
  return menu;
};

const seedMassiveData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/food_delivery');
    console.log('MongoDB Connected for Massive Seeding');

    // Clean DB
    await User.deleteMany();
    await Restaurant.deleteMany();
    console.log('Cleared existing database data...');

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    // 1. Create Admins & default accounts
    await User.create({ name: 'System Admin', email: 'admin@fooddash.com', password, role: 'admin', city: 'Delhi', area: 'Connaught Place' });
    const defaultOwner = await User.create({ name: 'Gordon Owner', email: 'owner@test.com', password, role: 'owner', city: 'Mumbai', area: 'Bandra' });
    await User.create({ name: 'Hungry Customer', email: 'customer@test.com', password, role: 'customer', city: 'Mumbai', area: 'Bandra' });

    await Restaurant.create({
      owner: defaultOwner._id,
      name: 'Burger Brutalism',
      description: 'The most hardcore and honest burgers in town. No fluff.',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      address: { street: '123 Pixel Street', city: 'Mumbai', area: 'Bandra', pincode: '400050' },
      timings: { openingTime: '11:00 AM', closingTime: '11:00 PM' },
      isVegOnly: false,
      isOpen: true,
      isApproved: true,
      menu: generateMenu(false)
    });

    // 2. Generate 20 Restaurants per Area
    const usersToInsert = [];
    let ownerIdx = 1;

    console.log('Generating 600+ restaurants and 200+ customers... Please wait.');

    // Pre-generate Users
    const ownersData = [];
    const customersData = [];

    // Create 600 Owners (20 per area * 10 areas * 3 cities)
    for(let i=0; i<600; i++) {
       const userCity = getRandom(Object.keys(CITIES));
       ownersData.push({
         name: `${getRandom(FIRST_NAMES)} ${getRandom(LAST_NAMES)}`,
         email: `owner${i}@mock.com`,
         password,
         role: 'owner',
         city: userCity,
         area: getRandom((CITIES as any)[userCity])
       });
    }

    // Create 200 Customers
    for(let i=0; i<200; i++) {
        const userCity = getRandom(Object.keys(CITIES));
        customersData.push({
          name: `${getRandom(FIRST_NAMES)} ${getRandom(LAST_NAMES)}`,
          email: `cust${i}@mock.com`,
          password,
          role: 'customer',
          city: userCity,
          area: getRandom((CITIES as any)[userCity])
        });
    }

    // Insert Users in Bulk
    const insertedOwners = await User.insertMany(ownersData);
    await User.insertMany(customersData);

    const restaurantsData = [];
    let currentOwnerIndex = 0;

    for (const city of Object.keys(CITIES)) {
      const areas = (CITIES as any)[city];
      for (const area of areas) {
        
        // 20 restaurants per area
        for (let r = 0; r < 20; r++) {
          const ownerId = insertedOwners[currentOwnerIndex]._id;
          currentOwnerIndex++;

          // 10% chance of pending, 90% approved. This gives Admin lots of action
          const isPending = Math.random() > 0.90;

          // Fake random creation dates spanning the last 2 years
          const randomPastDate = new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 730));

          const isVegOnly = Math.random() > 0.7;

          restaurantsData.push({
            owner: ownerId,
            name: generateName(),
            description: generateDesc(),
            image: getRandom(IMAGES),
            address: {
              street: `Shop ${Math.floor(Math.random() * 100)}, ${getRandom(FIRST_NAMES)} Block`,
              city: city,
              area: area,
              pincode: '4000' + Math.floor(Math.random() * 99)
            },
            timings: {
              openingTime: '10:00 AM',
              closingTime: '11:00 PM'
            },
            isVegOnly,
            isOpen: !isPending && Math.random() > 0.2, // Some are closed for the day
            isApproved: !isPending,
            menu: generateMenu(isVegOnly),
            createdAt: randomPastDate,
            updatedAt: randomPastDate
          });
        }
      }
    }

    // Insert Restaurants in Bulk
    await Restaurant.insertMany(restaurantsData);
    
    console.log(`Massive Database Seeded Successfully! 🔥`);
    console.log(`Generated ~600 Live/Pending Restaurants across 3 Cities.`);
    console.log(`Generated ~200 Customers and ~600 Owners with full Menus.`);
    process.exit();
  } catch (error) {
    console.error(`Error:`, error);
    process.exit(1);
  }
};

seedMassiveData();
