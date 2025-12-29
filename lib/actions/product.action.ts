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

// --- Helper: Slugify ---
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

// ==========================================
// 1. CREATE PRODUCT
// ==========================================
export async function createProduct(values: z.infer<typeof ProductSchema>) {
  try {
    await connectMongoDB();

    // 1. Server-side Validation
    const validatedFields = ProductSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "اطلاعات وارد شده نامعتبر است." };
    }

    const data = validatedFields.data;

    // 2. Check if Category Exists
    const categoryExists = await Category.findById(data.category);
    if (!categoryExists) {
      return { error: "دسته بندی انتخاب شده یافت نشد." };
    }

    // 3. Check for Duplicate SKU
    const existingSku = await Product.findOne({ sku: data.sku });
    if (existingSku) {
      return { error: `کد کالا (SKU) تکراری است: ${data.sku}` };
    }

    // 4. Generate Unique Slug
    // We combine Name + SKU to ensure uniqueness (e.g., "gold-ring-brclt001")
    let slug = slugify(`${data.name}-${data.sku}`);

    // Double check slug uniqueness just in case
    const existingSlug = await Product.findOne({ slug });
    if (existingSlug) {
      // Fallback: Append a random string if Name+SKU somehow exists
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    // 4. Generate the Display Slug (Farsi)
    // We use only the name for the SEO slug
    const displaySlug = persianSlugify(data.name);

    // 5. Create Product
    const newProduct = await Product.create({
      ...data,
      displaySlug, // 👈 Store the Farsi display slug
      category: new mongoose.Types.ObjectId(data.category),
    });

    // 6. Revalidate Path
    // This refreshes the product list page and the new product's page
    revalidatePath("/products");

    return {
      success: "محصول با موفقیت ثبت شد.",
      product: JSON.parse(JSON.stringify(newProduct)),
    };
  } catch (error) {
    console.error("Create Product Error:", error);
    return { error: "خطا در ثبت محصول. لطفا مجددا تلاش کنید." };
  }
}

// ==========================================
// 2. GET ALL PRODUCTS (With Pagination & Search)
// ==========================================

// ... imports

export async function getProducts(params: {
  page?: number;
  filter?: string;
  searchQuery?: string;
  category?: string;
  text?: string;
}) {
  try {
    await connectMongoDB();
    const { page = 1, filter, searchQuery, category, text } = params;
    console.log("text", text);
    const pageSize = 6; // Number of items per load
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Product> = {};

    if (category) {
      query.category = category;
    }

    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { description: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions: any = {};
    switch (filter) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "expensive":
        sortOptions = { price: -1 };
        break;
      case "cheapest":
        sortOptions = { price: 1 };
        break;
      case "discount":
        query.discount = { $gt: 0 };
        sortOptions = { discount: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skipAmount) // Skip previous pages
      .limit(pageSize) // Limit results
      .populate({
        path: "category",
        model: Category,
        select: "name slug",
      })
      .lean();

    const totalProducts = await Product.countDocuments(query);

    // Calculate if there are more pages
    const isNext = totalProducts > skipAmount + products.length;

    return {
      products: JSON.parse(JSON.stringify(products)),
      isNext,
    };
  } catch (error) {
    console.error("Get Products Error:", error);
    throw error;
  }
}
// 3. GET SINGLE PRODUCT (By Slug or ID)
// ==========================================
// Define the interface for the parameters object
interface GetProductParams {
  productId: string;
}

// Update the function signature to accept the object and destructure it
export async function getProductById({
  productId,
}: GetProductParams): Promise<ProductActionResponse> {
  // Now, 'productId' is correctly the string '693e821d8dc728ec7909f180'
  // The BSON error should be fixed.

  // No need for the log that printed [object Object] anymore, but keep the conversion:

  await connectMongoDB();

  let objectId;

  try {
    // This line will now work correctly because productId is a string.
    objectId = new mongoose.Types.ObjectId(productId);
  } catch (e) {
    console.error(`ID Conversion Failed for: ${productId}`, e);
    return { error: "شناسه محصول نامعتبر است. (خطا در تبدیل شناسه)" };
  }
  // ----------------------------

  try {
    // Use the converted ObjectId for the query
    const product = await Product.findById(objectId) // <-- Use objectId here
      .populate("category", "name slug parent")
      .lean();

    if (!product) {
      console.log(`Product with ID ${productId} not found.`);
      return { error: "محصول مورد نظر یافت نشد." };
    }

    // Return the product as a serializable JSON object
    return { product: JSON.parse(JSON.stringify(product)) };
  } catch (error) {
    console.error("Error in getProductById during query:", error);
    return { error: "خطای سرور: در دریافت اطلاعات محصول مشکلی پیش آمد." };
  }
}

// ==========================================
// 4. DELETE PRODUCT
// ==========================================
export async function deleteProduct(productId: string) {
  try {
    console.log("productId", productId);
    await connectMongoDB();

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return { error: "محصول یافت نشد." };
    }

    revalidatePath("/products");
    return { success: "محصول با موفقیت حذف شد." };
  } catch (error) {
    console.error("Delete Error:", error);
    return { error: "خطا در حذف محصول." };
  }
}

export async function deleteProductMedia({
  productId,
  filename,
}: DeleteMediaParams) {
  try {
    await connectMongoDB();

    // 1. Validate input IDs
    if (!productId || typeof productId !== "string") {
      return { error: "شناسه محصول نامعتبر است." }; // Invalid Product ID
    }

    // 2. Perform the update using the $pull operator
    // $pull removes all array elements that match the specified condition.
    const updateResult = await Product.findByIdAndUpdate(
      productId,
      {
        $pull: {
          media: { filename: filename }, // Remove the media object where filename matches
        },
      },
      { new: true }, // Option to return the updated document (optional but good practice)
    );

    if (!updateResult) {
      return { error: "محصول یا تصویر مورد نظر یافت نشد." }; // Product not found
    }

    // 3. Revalidate cache for the products page
    // Adjust the path based on your admin routing structure
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/edit/${productId}`); // Revalidate the current edit page

    return { success: "تصویر با موفقیت از محصول حذف شد." };
  } catch (error) {
    // Log the detailed server-side error
    console.error("Server Action - deleteProductMedia error:", error);

    // Return a controlled error message to the client
    return { error: "خطای ناشناخته در حذف رسانه از پایگاه داده رخ داد." };
  }
}

// ==========================================
// 5. UPDATE PRODUCT
// ==========================================
// Define the input shape for the server action
interface UpdateProductInput extends z.infer<typeof ProductSchema> {
  _id: string;
}

export async function updateProduct(
  input: UpdateProductInput, // <--- Accept a single object (the payload)
) {
  try {
    // Destructure the product ID and the rest of the data
    const { _id: productId, ...values } = input; // <--- The actual data for Zod validation is now 'values'

    console.log("im hereeeeeeeeeeeeeee", values); // This will now log the product data!
    await connectMongoDB();

    // Validate using the destructured 'values'
    const validatedFields = ProductSchema.safeParse(values);

    if (!validatedFields.success) {
      console.error("ZOD VALIDATION ERROR:", validatedFields.error.issues);
      return { error: "اطلاعات نامعتبر است." };
    }
    const data = validatedFields.data;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return { error: "فرمت شناسه محصول نامعتبر است." };
    }

    // Update
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        ...data,
        category: new mongoose.Types.ObjectId(data.category),
      },
      { new: true },
    );

    if (!updatedProduct) return { error: "محصول یافت نشد." };

    revalidatePath(`/products/${updatedProduct.slug}`);
    revalidatePath("/products");

    return {
      success: "محصول بروزرسانی شد.",
      product: JSON.parse(JSON.stringify(updatedProduct)),
    };
  } catch (error) {
    console.error("Update Error:", error);
    return { error: "خطا در بروزرسانی محصول." };
  }
}

export async function handleProductLike({ productId, userId }) {
  try {
    await connectMongoDB();

    const product = await Product.findById(productId);
    if (!product) {
      return { error: "محصول یافت نشد." };
    }

    const alreadyLiked = product?.likes?.includes(userId);

    if (alreadyLiked) {
      // User already liked → remove like
      await Product.findByIdAndUpdate(productId, {
        $pull: { likes: userId },
      });

      return { liked: false };
    } else {
      // User has not liked → add like
      await Product.findByIdAndUpdate(productId, {
        $addToSet: { likes: userId }, // prevents duplicates
      });

      return { liked: true };
    }
  } catch (error) {
    console.log(error);
    return { error: "خطا در لایک محصول." };
  }
}
export async function handleProductSave({ productId, userId }) {
  try {
    await connectMongoDB();

    const product = await Product.findById(productId);
    if (!product) {
      return { error: "محصول یافت نشد." };
    }

    const alreadySaved = product.saved.includes(userId);

    if (alreadySaved) {
      // User already liked → remove like
      await Product.findByIdAndUpdate(productId, {
        $pull: { saved: userId },
      });

      return { saved: false };
    } else {
      // User has not liked → add like
      await Product.findByIdAndUpdate(productId, {
        $addToSet: { saved: userId }, // prevents duplicates
      });

      return { saved: true };
    }
  } catch (error) {
    console.log(error);
    return { error: "خطا در ذخیره محصول." };
  }
}
// lib\actions\product.action.ts (Corrected)

export async function postComment(params) {
  try {
    await connectMongoDB();
    const { content, senderId, productId, parentComment, replies } = params;

    // If parentComment is provided and not empty, we use it. Otherwise, it is undefined.
    const parentId =
      parentComment && parentComment.length > 0 ? parentComment : undefined;

    const newUserData = {
      content: content,
      author: senderId,
      product: productId,
      // Change 1: Set parentComment to parentId (which is the string/ObjectId or undefined)
      // Mongoose expects an ObjectId string or null/undefined for a Reference field.
      parentComment: parentId,
      isReply: parentId ? true : false,
      replies: replies,
    };

    // Action: Creates and saves the document
    const newComment = await Comment.create(newUserData);

    console.log("params", newComment);

    // --- IMPORTANT: Update the Parent Comment's replies array ---
    // If the comment has a parent, add the new comment's ID to the parent's replies array.
    if (parentId) {
      await Comment.findByIdAndUpdate(parentId, {
        $push: { replies: newComment._id },
      });
    }

    return {
      success: true,
      newComment: JSON.parse(JSON.stringify(newComment)),
    };
  } catch (error) {
    console.log(error);
    return { error: "خطا در ذخیره محصول." };
  }
}
export async function getComments(params) {
  try {
    await connectMongoDB();
    const { productId } = params;

    // Action: Creates and saves the document
    const comments = await Comment.find({ product: productId })
      .populate("author", "name image")
      .populate("parentComment");
    const totalCounts = await Comment.countDocuments({ product: productId });

    const data = {
      comments: JSON.parse(JSON.stringify(comments)),
      totalCounts: totalCounts,
    };

    return data;
  } catch (error) {
    console.log(error);
    return { error: "خطا در دریافت نظرات محصول." };
  }
}

// DELEtE loop for nested replies
async function deleteCommentRecursive(commentId) {
  const comment = await Comment.findById(commentId);

  if (!comment) return;

  // Recursively delete all children
  for (const replyId of comment.replies) {
    await deleteCommentRecursive(replyId);
  }

  // Remove this comment
  await Comment.findByIdAndDelete(commentId);
}
export async function deleteComment(params) {
  try {
    await connectMongoDB();
    const { commentId } = params;

    const comment = await Comment.findById(commentId);

    // Remove reference from parent
    if (comment?.parentComment) {
      await Comment.findByIdAndUpdate(comment.parentComment, {
        $pull: { replies: commentId },
      });
    }

    // Recursively delete everything
    await deleteCommentRecursive(commentId); // ⬆️

    return { success: true };
  } catch (error) {
    console.log(error);
    return { error: "خطا در حذف نظر." };
  }
}

// upvote + downvote
export async function voteComment(params) {
  try {
    await connectMongoDB();
    const { commentId, userId, type } = params;

    if (!userId) return { error: "لطفا وارد شوید." };

    const comment = await Comment.findById(commentId);
    if (!comment) throw new Error("comment not found");

    const user = await User.findById(userId);
    if (!user) return { error: "کانتری یافت نشد." };

    let updateQuery = {};

    if (type === "upvote") {
      if (comment.upvotes.includes(userId)) {
        updateQuery = { $pull: { upvotes: userId } };
      } else {
        updateQuery = { $push: { upvotes: userId } };
        if (comment.downvotes.includes(userId)) {
          updateQuery.$pull = { downvotes: userId };
        }
      }
    }

    if (type === "downvote") {
      if (comment.downvotes.includes(userId)) {
        updateQuery = { $pull: { downvotes: userId } };
      } else {
        updateQuery = { $push: { downvotes: userId } };
        if (comment.upvotes.includes(userId)) {
          updateQuery.$pull = { upvotes: userId };
        }
      }
    }

    // 🔥 IMPORTANT: apply the update
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      updateQuery,
      { new: true }, // return updated document
    );

    const data = {
      upVotes: updatedComment.upvotes,
      downVotes: updatedComment.downvotes,
    };

    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
}

export async function getLikedProduct(params) {
  try {
    await connectMongoDB();
    console.log("lllllll");
    const { userId } = params;

    if (!userId) return { error: "لطفا وارد شوید." };

    const myLiked = await Product.find({ likes: userId });
    if (!myLiked) throw new Error("myLiked not found");

    return JSON.parse(JSON.stringify(myLiked));
  } catch (error) {
    console.log(error);
  }
}
