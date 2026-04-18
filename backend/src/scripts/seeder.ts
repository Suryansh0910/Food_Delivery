import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User';

dotenv.config();

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/food_delivery');
        console.log('MongoDB Connected for Seeding');

        // Clear existing users
        await User.deleteMany();
        console.log('Cleared existing users');

        // Create Admin
        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash('admin123', salt);
        
        const adminUser = new User({
            name: 'Super Admin',
            email: 'admin@fooddash.com',
            password: adminPassword,
            role: 'admin'
        });

        await adminUser.save();
        console.log('Admin user seeded correctly: admin@fooddash.com / admin123');

        // Create a fake Customer
        const customerPassword = await bcrypt.hash('customer123', salt);
        const customer = new User({
            name: 'Jane Doe',
            email: 'jane@example.com',
            password: customerPassword,
            role: 'customer'
        });
        
        await customer.save();
        console.log('Customer seeded correctly: jane@example.com / customer123');

        // Create a fake Restaurant Owner
        const ownerPassword = await bcrypt.hash('owner123', salt);
        const owner = new User({
            name: 'Burger Palace',
            email: 'owner@burgerpalace.com',
            password: ownerPassword,
            role: 'owner'
        });
        
        await owner.save();
        console.log('Owner seeded correctly: owner@burgerpalace.com / owner123');


        console.log('Seeding Success!');
        process.exit();

    } catch (error) {
        console.error('Seeding Failed', error);
        process.exit(1);
    }
};

seedDB();
