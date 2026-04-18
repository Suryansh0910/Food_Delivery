import mongoose, { Schema, Document } from 'mongoose';

export interface IRestaurant extends Document {
  owner: mongoose.Types.ObjectId;
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    area: string;
    pincode: string;
  };
  timings: {
    openingTime: string;
    closingTime: string;
  };
  isVegOnly: boolean;
  isOpen: boolean;
  image?: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RestaurantSchema: Schema = new Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    area: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  timings: {
    openingTime: { type: String, required: true },
    closingTime: { type: String, required: true }
  },
  isVegOnly: { type: Boolean, default: false },
  isOpen: { type: Boolean, default: true },
  image: { type: String },
  isApproved: { type: Boolean, default: false } // Admin approval
}, { timestamps: true });

export default mongoose.model<IRestaurant>('Restaurant', RestaurantSchema);
