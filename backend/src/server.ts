import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173', // Vite dev
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1 && process.env.NODE_ENV === 'production') {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  optionsSuccessStatus: 200 
}));
app.use(express.json());

// Main entry route
app.get('/', (req, res) => {
  res.send('Food Delivery API is running...');
});

// Routes
app.use('/api/auth', authRoutes);
import restaurantRoutes from './routes/restaurantRoutes';
app.use('/api/restaurants', restaurantRoutes);

import orderRoutes from './routes/orderRoutes';
app.use('/api/orders', orderRoutes);

// Connect to MongoDB using Mongoose
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/food_delivery');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
    } else {
        console.error(`Unknown Error: ${error}`);
    }
    process.exit(1);
  }
};

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running in mode on port ${PORT}`);
    });
});
