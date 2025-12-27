import mongoose, { Schema, models, Document, Types } from "mongoose";

export interface IMedia extends Document {
  _id: Types.ObjectId;
  originalName: string;
  filename: string;
  url: string;
  type: "image" | "video" | "audio" | "file" | "document";
  size: number;
  mimeType: string;
  uploader: Types.ObjectId;
  thumbnail?: string;
  duration?: number;
  dimensions?: {
    width: number;
    height: number;
  };
  storage: {
    provider: "local" | "aws" | "cloudinary";
    key?: string;
    bucket?: string;
  };
  isPublic: boolean;
  usedIn: {
    model: "Message" | "Ticket" | "Comment" | "User" | "Product"; // Added "Product"    id: Types.ObjectId;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const mediaSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    originalName: { type: String, required: true },
    filename: { type: String, required: true },
    url: { type: String, required: true },
    type: {
      type: String,
      enum: ["image", "video", "audio", "file", "document"],
      required: true,
    },
    size: { type: Number, required: true },
    mimeType: { type: String, required: true },
    uploader: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    thumbnail: { type: String },
    duration: { type: Number },
    dimensions: {
      width: { type: Number },
      height: { type: Number },
    },
    storage: {
      provider: {
        type: String,
        enum: ["local", "aws", "cloudinary"],
        default: "local",
      },
      key: { type: String },
      bucket: { type: String },
    },
    isPublic: { type: Boolean, default: false },
    usedIn: [
      {
        model: {
          type: String,
          enum: ["Message", "Ticket", "Comment", "User", "Product"],
          id: { type: Schema.Types.ObjectId },
        },
      },
    ],
  },
  { timestamps: true },
);

mediaSchema.index({ uploader: 1, createdAt: -1 });
mediaSchema.index({ type: 1 });
mediaSchema.index({ "usedIn.id": 1 });

export const Media =
  models?.Media || mongoose.model<IMedia>("Media", mediaSchema);
export default Media;
