import mongoose, { Schema, models, Document, Types } from "mongoose";

export interface IOrderItem {
  product: Types.ObjectId;
  count: number;
  priceAtPurchase: number;
  subtotal: number;
}

export interface IOrder extends Document {
  orderID: string;
  customer: Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  deliveryDate: Date;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
}

const orderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    count: { type: Number, required: true, min: 1 },
    priceAtPurchase: { type: Number, required: true }, // Snapshots price at time of order
    subtotal: { type: Number, required: true },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    orderID: {
      type: String,
      unique: true,
      // Generates a 5-character alphanumeric ID
      default: () => Math.random().toString(36).substring(2, 7).toUpperCase(),
    },
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    deliveryDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

export const Order =
  models?.Order || mongoose.model<IOrder>("Order", orderSchema);
export default Order;
