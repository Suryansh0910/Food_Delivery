import mongoose, { Schema, Document } from 'mongoose';

export interface IMenuItem extends Document {
  restaurant: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema: Schema = new Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);
