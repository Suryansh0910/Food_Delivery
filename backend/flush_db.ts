import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

const flushDatabase = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/food_delivery');
        console.log('Connected to Database. Commencing Flush...');

        // Drop the entire database
        await mongoose.connection.db.dropDatabase();
        
        console.log('✅ DATABASE SUCCESSFULLY DROPPED!');
        console.log('All fake users, restaurants, menu items, and orders have been eradicated.');
        process.exit(0);
    } catch (error) {
        console.error('Failed to wipe database:', error);
        process.exit(1);
    }
};

flushDatabase();
