import mongoose, { Schema, Document } from 'mongoose';
import { IOrderItem } from './Order';

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  restaurant: mongoose.Types.ObjectId; // A cart is typically tied to one restaurant at a time for checkout
  items: IOrderItem[];
  totalAmount: number;
}

const CartItemSchema = new Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true }
});

const CartSchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  items: [CartItemSchema],
  totalAmount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model<ICart>('Cart', CartSchema);
