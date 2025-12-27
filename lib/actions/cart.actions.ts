"use server";

import Product from "@/models/product.model";
import User from "@/models/user";
import { revalidatePath } from "next/cache";
import { connectMongoDB } from "../mongodb";
import mongoose from "mongoose";
import Order from "@/models/order.model";

// --- TYPES FOR SERVER ACTIONS ---
type SyncItem = {
  productId: string;
  quantity: number;
};

// 1. Get Cart
export async function getCart(userId: string) {
  try {
    await connectMongoDB();
    const user = await User.findById(userId).populate({
      path: "cart.product",
      model: Product,
    });

    if (!user) return [];

    // Filter out items where the product might have been deleted from DB
    // Use .toObject() or JSON parse/stringify to sanitize Mongoose objects
    const activeCart = user.cart.filter((item: any) => item.product);
    return JSON.parse(JSON.stringify(activeCart));
  } catch (error) {
    console.error("Error fetching cart:", error);
    return [];
  }
}

// 2. Add or Increment Item
export async function addToCart({
  userId,
  productId,
  quantity = 1,
}: {
  userId: string;
  productId: string;
  quantity?: number;
}) {
  try {
    await connectMongoDB();
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const cartItemIndex = user.cart.findIndex(
      (item: any) => item.product.toString() === productId,
    );

    if (cartItemIndex > -1) {
      user.cart[cartItemIndex].quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    revalidatePath("/cart");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

// 3. Decrease Quantity
export async function decreaseFromCart({
  userId,
  productId,
}: {
  userId: string;
  productId: string;
}) {
  try {
    await connectMongoDB();
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const cartItemIndex = user.cart.findIndex(
      (item: any) => item.product.toString() === productId,
    );

    if (cartItemIndex > -1) {
      if (user.cart[cartItemIndex].quantity > 1) {
        user.cart[cartItemIndex].quantity -= 1;
      } else {
        user.cart.splice(cartItemIndex, 1);
      }
    }

    await user.save();
    revalidatePath("/cart");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

// 4. Remove Item Completely
export async function removeFromCart({
  userId,
  productId,
}: {
  userId: string;
  productId: string;
}) {
  try {
    await connectMongoDB();
    await User.findByIdAndUpdate(userId, {
      $pull: { cart: { product: productId } },
    });
    revalidatePath("/cart");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

// 5. Sync Local Cart (Optimized Payload)
export async function syncLocalCart(userId: string, itemsToSync: SyncItem[]) {
  try {
    await connectMongoDB();
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    // Loop through optimized list (IDs only)
    for (const item of itemsToSync) {
      const { productId, quantity } = item;

      const existingItemIndex = user.cart.findIndex(
        (dbItem: any) => dbItem.product.toString() === productId,
      );

      if (existingItemIndex > -1) {
        // If item exists, add the guest quantity to the existing DB quantity
        user.cart[existingItemIndex].quantity += quantity;
      } else {
        // If item doesn't exist, push it
        user.cart.push({ product: productId, quantity });
      }
    }

    await user.save();
    revalidatePath("/cart");
    return { success: true };
  } catch (error: any) {
    console.error("Sync Error:", error);
    return { error: error.message };
  }
}

export async function createOrderAction(params: {
  userId: string;
  cartItems: any[];
  totalAmount: number;
}) {
  try {
    const { userId, cartItems, totalAmount } = params;

    // 1. Validation to prevent the .map error
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return { error: "سبد خرید شما خالی است" };
    }

    await connectMongoDB();

    // 2. Map items to match your IOrderItem schema
    // Since your CartProvider stores items as { product: {...}, quantity: number }
    const formattedItems = cartItems.map((item) => {
      const price = item.product.price;
      const quantity = item.quantity;

      return {
        product: new mongoose.Types.ObjectId(item.product._id),
        count: quantity,
        priceAtPurchase: price,
        subtotal: price * quantity,
      };
    });

    // 3. Set a default delivery date (e.g., 5 days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);

    // 4. Create the document
    const newOrder = await Order.create({
      customer: new mongoose.Types.ObjectId(userId),
      items: formattedItems,
      totalAmount: totalAmount,
      deliveryDate: deliveryDate,
      status: "Pending",
    });

    await User.findByIdAndUpdate(userId, {
      $set: { cart: [] },
    });

    return {
      success: "سفارش شما با موفقیت ثبت شد",
      orderID: newOrder.orderID, // Using your custom random string ID
    };
  } catch (error: any) {
    console.error("Order Creation Error:", error);
    return { error: "خطایی در ثبت سفارش رخ داد. لطفا دوباره تلاش کنید." };
  }
}
