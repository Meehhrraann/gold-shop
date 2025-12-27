import mongoose from "mongoose";

// Ensure you have a Product model defined somewhere
const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: mongoose.Schema.Types.Number, required: true, min: 1 },
  price: Number, // Snapshot of price at add time, optional
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true },
);

export const CartModel =
  mongoose.models.Cart || mongoose.model("Cart", cartSchema);
