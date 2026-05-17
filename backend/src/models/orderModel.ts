import mongoose, { Schema, Document, Types } from "mongoose";

export interface IOrderItem {
  menuItem: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

export enum OrderStatus {
  ORDER_RECEIVED = "Order Received",
  PREPARING = "Preparing",
  OUT_FOR_DELIVERY = "Out for Delivery",
  DELIVERED = "Delivered",
}

export interface IOrder extends Document {
  customerName: string;
  address: string;
  phone: string;
  status: OrderStatus;
  items: IOrderItem[];
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema: Schema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const orderSchema: Schema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: OrderStatus,
      default: "Order Received",
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

orderSchema.index({ status: 1 });
orderSchema.index({ customerName: 1 });
orderSchema.index({ phone: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ totalAmount: 1 });

export default mongoose.model<IOrder>("Order", orderSchema);
