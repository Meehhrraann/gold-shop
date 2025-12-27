// import { UserRole } from "@prisma/client";
import { currentUser } from "@/lib/actions/currentSession.action";
import * as z from "zod";

const UserRole = {
  ADMIN: "ADMIN",
  USER: "USER",
};

// const user = await currentUser();

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string().max(6)),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

export const ResetPasswordSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum 6 characters required!",
  }),
});

export const SettingsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Email is required"),
  image: z.string().url("Invalid URL").optional().or(z.literal("")),
  role: z.enum(["ADMIN", "USER"]),
  isTwoFactorEnabled: z.boolean().optional(),
  password: z.string().optional(),
  newPassword: z.string().optional(),
}).refine((data) => {
  if (data.newPassword && !data.password) {
    return false;
  }
  return true;
}, {
  message: "Current password is required!",
  path: ["password"]
});

export const MediaSchema = z.object({
  url: z.string().url({ message: "Valid media URL is required" }),
  type: z.enum(["image", "video", "audio", "file"], {
    required_error: "Media type is required",
  }),
  filename: z.string().min(1, { message: "Filename is required" }),
  size: z.number().nonnegative({ message: "Size must be non-negative" }),
  mimeType: z.string().min(1, { message: "MIME type is required" }),
  thumbnail: z.string().url().optional(),
  duration: z.number().positive().optional(),
});

export const MessageSchema = z.object({
  content: z.string().optional(),
  senderName: z.string(),
  sender: z.string().min(1, { message: "Sender ID is required" }),
  chat: z.string().min(1, { message: "Chat ID is required" }),
  readBy: z.array(z.string()).optional(),
  media: z.array(MediaSchema).optional(),
  replyTo: z.string().optional(),
  type: z.enum(["text", "media", "system", "reply"]).default("text"),
  isEdited: z.boolean().default(false),
  editedAt: z.coerce.date().optional(),
  likes: z.array(z.string()).optional(), // ✅ new field
});

// --- Gold Product Schemas (New/Extended) ---

export const GoldDetailsSchema = z.object({
  karat: z.union(
    [
      z.literal(10),
      z.literal(14),
      z.literal(18),
      z.literal(21),
      z.literal(22),
      z.literal(24),
    ],
    {
      message: "عیار طلا باید یکی از مقادیر مجاز باشد.",
    },
  ),
  weightGrams: z.coerce
    .number({
      // Use z.coerce.number for input fields that return strings
      invalid_type_error: "وزن طلا باید عدد باشد.",
    })
    .min(0.01, {
      message: "وزن طلا باید مثبت باشد.",
    }),
  color: z.enum(["Yellow", "White", "Rose", "Mixed"], {
    message: "رنگ طلا باید یکی از مقادیر معتبر باشد.",
  }),
});

export const StoneDetailsSchema = z.object({
  type: z.string().min(1, { message: "نوع سنگ الزامی است." }),
  caratWeight: z.coerce.number().min(0, {
    message: "وزن قيراط نمی‌تواند منفی باشد.",
  }),
  count: z.coerce.number().int().min(1).default(1),
  cut: z.string().optional(),
});

export const CategorySchema = z.object({
  name: z.string().min(2, { message: "نام دسته بندی باید حداقل ۲ حرف باشد." }),
  description: z.string().optional(),
  parent: z.string().optional(), // ID of parent category
  image: z.string().optional(),
});

// --- Final Product Schema ---

export const ProductSchema = z.object({
  // Core Fields
  name: z.string().min(1, { message: "نام محصول الزامی است" }),
  description: z.string().min(1, { message: "توضیحات محصول الزامی است" }),

  // References
  category: z.string().min(1, { message: "شناسه دسته بندی الزامی است." }), // Mongoose ID as string

  // Financial & Inventory
  price: z.coerce
    .number()
    .min(0, { message: "قیمت نمی‌تواند منفی باشد." })
    .default(0),
  discount: z.coerce
    .number()
    .max(100, { message: "سقف تخفیف 100 درصد میباشد" })
    .min(0)
    .default(0),
  sku: z
    .string()
    .min(3, { message: "SKU محصول الزامی است" })
    .uppercase({ message: "SKU باید حروف بزرگ باشد." })
    .trim(),
  stockQuantity: z.coerce
    .number()
    .int()
    .min(0, { message: "تعداد موجودی نمی‌تواند منفی باشد." }),

  // Gold & Stone Details
  goldDetails: GoldDetailsSchema,
  stones: z.array(StoneDetailsSchema).optional(),

  // Status
  isAvailable: z.boolean().default(true),
  featured: z.boolean().default(false),
  tags: z.array(z.string().min(1)).optional(),

  // Media (Matching your form's setup to embed the full object)
  media: z.array(MediaSchema).optional(), // Array of full embedded media objects

  // User Interaction (from your original schema)
  comments: z.array(z.object({})).optional(),
  likes: z.array(z.string()).optional(),
  isLiked: z.boolean().default(false),
  isSaved: z.boolean().default(false),
});

export const addToCartSchema = z.object({
  productId: z.string(),
  quantity: z.number().min(1).default(1),
});

export const updateCartSchema = z.object({
  productId: z.string(),
  quantity: z.number().min(0),
});
