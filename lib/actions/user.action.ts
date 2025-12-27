"use server";

import { SettingsSchema } from "@/validation";
import { connectMongoDB } from "../mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import Account from "@/models/account";
import Media from "@/models/media.model";
import mongoose from "mongoose";
import Order from "@/models/order.model";
import Product from "@/models/product.model";
import Comment from "@/models/comment.model";

export async function updateProfileAction(params: {
  formDatas: FormData;
  userId: string;
}) {
  try {
    await connectMongoDB();
    const { formDatas, userId } = params;
    const formData = Object.fromEntries(formDatas);

    // 1. Parse simple fields
    const values = {
      name: formData.name as string,
      email: formData.email as string,
      role: formData.role as "ADMIN" | "USER",
      isTwoFactorEnabled: formData.isTwoFactorEnabled === "true",
      image: formData.image as string,
    };

    // 2. Handle Media Record if a new file was uploaded
    let finalImageUrl = values.image;

    if (formData.medias) {
      const mediaArray = JSON.parse(formData.medias as string);

      if (mediaArray.length > 0) {
        const mediaData = mediaArray[0]; // Profile is usually 1 image

        // Create Media Document in DB
        const newMedia = await Media.create({
          originalName: mediaData.filename,
          filename: mediaData.filename,
          url: mediaData.url,
          type: mediaData.type,
          size: mediaData.size,
          mimeType: mediaData.mimeType,
          uploader: new mongoose.Types.ObjectId(userId),
          storage: { provider: "cloudinary" }, // Adjust based on your liara/s3 config
          isPublic: true,
          usedIn: [{ model: "User", id: new mongoose.Types.ObjectId(userId) }],
        });

        finalImageUrl = newMedia.url;
      }
    }

    // 3. Update User
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { ...values, image: finalImageUrl } },
      { new: true },
    );

    return {
      success: "Profile updated!",
      user: JSON.parse(JSON.stringify(updatedUser)),
    };
  } catch (error: any) {
    return { error: error.message || "Failed to update profile" };
  }
}
export async function getUser(params) {
  try {
    await connectMongoDB();
    const { userId } = params;
    const user = await User.findById(userId);
    if (!user) return { error: "User not found!" };
    return { user };
  } catch (error) {
    return { error: error.message };
  }
}

export async function getUserProfile(params) {
  try {
    await connectMongoDB();
    const { userId } = params;

    // 1. Fetch the actual user data
    const user = await User.findById(userId).lean();
    if (!user) return { error: "User not found!" };

    // 2. Fetch orders belonging to this user
    const likesCount = await Product.find({ likes: userId }).countDocuments();
    const savedCount = await Product.find({ saved: userId }).countDocuments();
    const commentsCount = await Comment.find({
      author: userId,
    }).countDocuments();

    const stats = await Order.aggregate([
      { $match: { customer: user._id } },
      {
        $group: {
          _id: null, // Group everything into one result
          Pending: { $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] } },
          Processing: {
            $sum: { $cond: [{ $eq: ["$status", "Processing"] }, 1, 0] },
          },
          Shipped: { $sum: { $cond: [{ $eq: ["$status", "Shipped"] }, 1, 0] } },
          Delivered: {
            $sum: { $cond: [{ $eq: ["$status", "Delivered"] }, 1, 0] },
          },
          Cancelled: {
            $sum: { $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0] },
          },
        },
      },
    ]);

    const ordersSummary = stats[0] || {
      Pending: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };

    // Return a combined object
    return {
      success: true,
      user: JSON.parse(JSON.stringify(user)), // Ensures plain object for Next.js
      counts: {
        likes: likesCount,
        saved: savedCount,
        comments: commentsCount,
      },
      orderStats: ordersSummary,
    };
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    return { error: error.message };
  }
}
