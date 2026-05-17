import mongoose, { Schema, Document } from "mongoose";

export interface IMenuItem extends Document {
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const menuItemSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    imageUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

menuItemSchema.index({ name: 1 });
menuItemSchema.index({ price: 1 });
menuItemSchema.index({ createdAt: -1 });

export default mongoose.model<IMenuItem>("MenuItem", menuItemSchema);
