// models/category.model.ts
import mongoose, { Schema, models, Document, Types } from "mongoose";

export interface ICategory extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  parent?: Types.ObjectId; // If null, it's a root category
  image?: string; // Optional icon/image for the category
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: { type: String },
    // Self-referencing field for Nested Categories (e.g., Jewelry > Rings > Gold)
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    image: { type: String },
  },
  { timestamps: true },
);

// Index for faster lookups
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1 });

const Category =
  models?.Category || mongoose.model<ICategory>("Category", categorySchema);

export default Category;
