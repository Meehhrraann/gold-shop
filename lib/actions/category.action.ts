"use server";

import Message from "@/models/message.model";
import { connectMongoDB } from "../mongodb";
import mongoose, { Types } from "mongoose"; // Keep this import, but use 'mongoose.' prefix

import Category from "@/models/category.model"; // Adjust path
import Product from "@/models/product.model"; // Adjust path
import { CategorySchema } from "@/validation"; // Adjust path
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { persianSlugify } from "../utils";

// --- Helper: Slugify ---
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

// --- ACTIONS ---

/**
 * createCategory
 * Creates a new category. Generates slug automatically from name.
 */
export async function createCategory(values: z.infer<typeof CategorySchema>) {
  try {
    await connectMongoDB();

    // 1. Validate fields
    const validatedFields = CategorySchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid fields" };
    }

    const { name, description, parent, image } = validatedFields.data;

    // 2. Generate Slug
    const baseSlug = persianSlugify(name);
    let finalSlug = baseSlug;
    let counter = 0;

    // 1. Check for existing category and handle collisions
    while (await Category.findOne({ slug: finalSlug })) {
      counter++;
      finalSlug = `${baseSlug}-${counter}`;
      // Important: Use the while loop to check for:
      // 'gold-ring'
      // 'gold-ring-1'
      // 'gold-ring-2'
    }

    // 3. Check for existing category with same slug
    const existingCategory = await Category.findOne({ slug: finalSlug });
    if (existingCategory) {
      return { error: "دسته بندی با این نام قبلا ثبت شده است." };
    }

    // 4. Create Category
    const newCategory = await Category.create({
      name,
      slug: finalSlug,
      description,
      image,
      parent: parent || null,
    });

    revalidatePath("/products/create"); // Revalidate the form page
    return {
      success: "دسته بندی با موفقیت ایجاد شد.",
      category: JSON.parse(JSON.stringify(newCategory)),
    };
  } catch (error) {
    console.error("Create Category Error:", error);
    return { error: "خطا در ایجاد دسته بندی." };
  }
}

/**
 * getAllCategories
 * Fetches all categories. Useful for filling the <Select> in your Product Form.
 */
export async function getAllCategories() {
  try {
    await connectMongoDB();

    const categories = await Category.find({}).sort({ name: 1 }).lean(); // lean() returns plain JS objects, faster

    // Convert _id to string for Next.js serialization
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("Get Categories Error:", error);
    return [];
  }
}

/**
 * deleteCategory
 * Deletes a category only if it has no products and no sub-categories.
 */
export async function deleteCategory(categoryId: string) {
  try {
    await connectMongoDB();

    // 1. Check for child categories
    const hasChildren = await Category.findOne({ parent: categoryId });
    if (hasChildren) {
      return { error: "این دسته بندی دارای زیرمجموعه است و قابل حذف نیست." };
    }

    // 2. Check for products using this category
    const hasProducts = await Product.findOne({ category: categoryId });
    if (hasProducts) {
      return {
        error:
          "محصولاتی در این دسته بندی وجود دارند. ابتدا محصولات را تغییر دهید.",
      };
    }

    // 3. Delete
    await Category.findByIdAndDelete(categoryId);

    revalidatePath("/products/create");
    return { success: "دسته بندی حذف شد." };
  } catch (error) {
    return { error: "خطا در حذف دسته بندی." };
  }
}
