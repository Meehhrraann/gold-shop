"use server";

import Message from "@/models/message.model";
import { connectMongoDB } from "../mongodb";
import mongoose, { FilterQuery, Types } from "mongoose"; // Keep this import, but use 'mongoose.' prefix
import { z } from "zod";
import Category from "@/models/category.model"; // Adjust path
import Product from "@/models/product.model"; // Adjust path
import { ProductSchema } from "@/validation"; // Ensure this path is correctimport { z } from "zod";
import { revalidatePath } from "next/cache";
import { persianSlugify } from "../utils";
import Comment from "@/models/comment.model";
import User from "@/models/user";
import Order from "@/models/order.model";

interface orderSchema {
  userId: string;
}

export async function getOrders(params: orderSchema) {
  try {
    await connectMongoDB();
    const { userId } = params;

    const orders = await Order.find({ customer: userId })
      .populate("items.product", "media")
      .sort({
        createdAt: -1,
      });

    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    console.error("Create Product Error:", error);
    return { error: "مشکلی پیش آمده" };
  }
}
export async function getAllOrders() {
  try {
    await connectMongoDB();

    const orders = await Order.find({})
      .populate("items.product", "media")
      .sort({
        createdAt: -1,
      });

    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    console.error("Create Product Error:", error);
    return { error: "مشکلی پیش آمده" };
  }
}

const ITEMS_PER_PAGE = 10;

interface GetOrdersParams {
  userId: string; // Keep passing userId if you use it for filtering
  status: string;
  page: number;
  search?: string;
}

export async function fetchOrdersByColumn({
  status,
  page,
  search,
}: GetOrdersParams) {
  try {
    await connectMongoDB();

    // 1. Build Query
    const query: FilterQuery<typeof Order> = {
      status: status,
    };

    // 2. Add Search
    if (search) {
      query.$or = [{ orderID: { $regex: search, $options: "i" } }];
    }

    // 3. Get Total Count (NEW)
    const totalCount = await Order.countDocuments(query);

    // 4. Execute Query
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .lean();

    // 5. Serialize
    const safeOrders = JSON.parse(JSON.stringify(orders));

    return {
      orders: safeOrders,
      hasMore: orders.length === ITEMS_PER_PAGE,
      total: totalCount, // <--- RETURN TOTAL HERE
    };
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    return { orders: [], hasMore: false, total: 0 };
  }
}

export async function updateOrderStatus(orderId: string, newStatus: string) {
  try {
    await connectMongoDB();
    await Order.findByIdAndUpdate(orderId, { status: newStatus });
    revalidatePath("/kanban");
    return { success: true };
  } catch (error) {
    console.error("Update Order Error:", error);
    return { error: "Failed to update status" };
  }
}
