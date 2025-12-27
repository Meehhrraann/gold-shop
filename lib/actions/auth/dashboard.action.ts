"use server";

import mongoose from "mongoose";
import { Order } from "@/models/order.model";
import { Product } from "@/models/product.model";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";

// Helper to ensure DB connection (Update this path to your actual db connect file)
// If you don't have one, simplistic version:

export async function getDashboardData() {
  await connectMongoDB();

  // 1. Fetch Totals
  const totalRevenueResult = await Order.aggregate([
    { $group: { _id: null, total: { $sum: "$totalAmount" } } },
  ]);
  const totalRevenue = totalRevenueResult[0]?.total || 0;

  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalUsers = await User.countDocuments({ role: "USER" });

  // 2. Fetch Recent Orders
  const recentOrdersRaw = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("customer", "name email")
    .lean();

  const recentOrders = recentOrdersRaw.map((order: any) => ({
    id: order.orderID,
    customer: order.customer?.name || order.customer?.email || "کاربر مهمان",
    total: order.totalAmount,
    status: order.status,
  }));

  // 3. Fetch Chart Data (Last 7 Days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const chartDataRaw = await Order.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        sales: { $sum: "$totalAmount" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const chartData = chartDataRaw.map((item) => ({
    date: item._id, // Keep ISO date for safe parsing
    sales: item.sales,
    orders: item.orders,
  }));

  return {
    totals: {
      revenue: totalRevenue,
      orders: totalOrders,
      users: totalUsers,
      products: totalProducts,
    },
    recentOrders,
    chartData,
  };
}
