// /models/product.model.ts

import mongoose, { Schema, models, Document, Types } from "mongoose";

// --- Re-used IMedia Structure (Embedded) ---

// NOTE: Since your Zod schema points to a full MediaSchema,
// we use the IMedia structure for embedding here.
export interface IMedia {
  url: string;
  type: "image" | "video" | "audio" | "file" | "document";
  filename: string;
  size: number;
  mimeType: string;
  thumbnail?: string;
  duration?: number;
}

const mediaSchema = new Schema(
  {
    url: { type: String, required: true },
    type: {
      type: String,
      enum: ["image", "video", "audio", "file", "document"],
      required: true,
    },
    filename: { type: String, required: true },
    size: { type: Number, required: true },
    mimeType: { type: String, required: true },
    thumbnail: { type: String },
    duration: { type: Number },
  },
  { _id: false },
); // Embeds media without its own _id

// --- Product Sub-Schemas ---

export interface IGoldDetails {
  karat: 10 | 14 | 18 | 21 | 22 | 24;
  weightGrams: number;
  color: "Yellow" | "White" | "Rose" | "Mixed";
}

export interface IStoneDetails {
  type: string;
  caratWeight: number;
  count: number;
  cut?: string;
}

const goldDetailsSchema = new Schema(
  {
    karat: {
      type: Number,
      enum: [10, 14, 18, 21, 22, 24],
      required: true,
    },
    weightGrams: { type: Number, required: true, min: 0 },
    color: {
      type: String,
      enum: ["Yellow", "White", "Rose", "Mixed"],
      required: true,
    },
  },
  { _id: false },
);

const stoneDetailsSchema = new Schema(
  {
    type: { type: String, required: true },
    caratWeight: { type: Number, required: true, min: 0 },
    count: { type: Number, required: true, min: 1, default: 1 },
    cut: { type: String },
  },
  { _id: false },
);

// --- Main Product Interface & Schema ---

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  sku: string;
  category: Types.ObjectId;
  price: number;
  discount: number; // Added discount
  goldDetails: IGoldDetails;
  stones?: IStoneDetails[];
  media: IMedia[]; // Embedded Media
  tags: string[];
  isAvailable: boolean;
  stockQuantity: number;
  featured: boolean;
  likes: Types.ObjectId[];
  saved: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    // 👇 THIS FIELD MUST BE IN YOUR SCHEMA
    displaySlug: {
      type: String,
      required: true, // You can set this to true
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 }, // New field
    stockQuantity: { type: Number, required: true, min: 0 },
    goldDetails: { type: goldDetailsSchema, required: true },
    stones: [stoneDetailsSchema],
    media: [mediaSchema], // Embedded Media
    tags: [{ type: String, trim: true }],
    isAvailable: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }], // For the likes array
    saved: [{ type: Schema.Types.ObjectId, ref: "User" }], // For the likes array
  },
  { timestamps: true },
);

productSchema.index({ sku: 1 });
productSchema.index({ category: 1, isAvailable: -1, price: 1 });

export const Product =
  models?.Product || mongoose.model<IProduct>("Product", productSchema);
export default Product;
