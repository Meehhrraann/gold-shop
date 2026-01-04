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
    message: "ایمیل معتبر وارد کنید",
  }),
  password: z.string().min(1, {
    message: "رمز عبور الزامی است",
  }),
  code: z.optional(
    z.string().max(6, { message: "کد تایید حداکثر باید ۶ رقم باشد" }),
  ),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "ایمیل معتبر وارد کنید",
  }),
  password: z.string().min(6, {
    message: "رمز عبور باید حداقل ۶ کاراکتر باشد",
  }),
  name: z.string().min(1, {
    message: "نام الزامی است",
  }),
});

export const ResetPasswordSchema = z.object({
  email: z.string().email({
    message: "ایمیل معتبر وارد کنید",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "رمز عبور جدید باید حداقل ۶ کاراکتر باشد!",
  }),
});

export const SettingsSchema = z
  .object({
    name: z.string().min(1, "نام الزامی است"),
    email: z.string().email("ایمیل معتبر وارد کنید"),
    image: z
      .string()
      .url("آدرس تصویر نامعتبر است")
      .optional()
      .or(z.literal("")),
    role: z.enum(["ADMIN", "USER"]),
    isTwoFactorEnabled: z.boolean().optional(),
    password: z.string().optional(),
    newPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }
      return true;
    },
    {
      message: "رمز عبور فعلی الزامی است!",
      path: ["password"],
    },
  );

export const MediaSchema = z.object({
  url: z.string().url({ message: "آدرس رسانه نامعتبر است" }),
  type: z.enum(["image", "video", "audio", "file"], {
    required_error: "نوع رسانه الزامی است",
  }),
  filename: z.string().min(1, { message: "نام فایل الزامی است" }),
  size: z.number().nonnegative({ message: "حجم فایل نمی‌تواند منفی باشد" }),
  mimeType: z.string().min(1, { message: "فرمت فایل (MIME type) الزامی است" }),
  thumbnail: z
    .string()
    .url({ message: "آدرس پیش‌نمایش نامعتبر است" })
    .optional(),
  duration: z
    .number()
    .positive({ message: "مدت زمان باید مثبت باشد" })
    .optional(),
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
      invalid_type_error: "وزن طلا باید عدد باشد.",
    })
    .min(0.01, {
      message: "وزن طلا باید مثبت باشد.",
    }),
  color: z.enum(["Yellow", "White", "Rose", "Mixed"], {
    errorMap: () => ({ message: "رنگ طلا باید یکی از مقادیر معتبر باشد." }),
  }),
});

export const StoneDetailsSchema = z.object({
  type: z.string().min(1, { message: "نوع سنگ الزامی است." }),
  caratWeight: z.coerce.number().min(0, {
    message: "وزن قیراط نمی‌تواند منفی باشد.",
  }),
  count: z.coerce
    .number()
    .int({ message: "تعداد باید عدد صحیح باشد" })
    .min(1, { message: "تعداد حداقل ۱ عدد است" })
    .default(1),
  cut: z.string().optional(),
});

export const CategorySchema = z.object({
  name: z.string().min(2, { message: "نام دسته‌بندی باید حداقل ۲ حرف باشد." }),
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
  category: z.string().min(1, { message: "شناسه دسته‌بندی الزامی است." }), // Mongoose ID as string

  // Financial & Inventory
  price: z.coerce
    .number()
    .min(0, { message: "قیمت نمی‌تواند منفی باشد." })
    .default(0),
  discount: z.coerce
    .number()
    .max(100, { message: "سقف تخفیف ۱۰۰ درصد می‌باشد" })
    .min(0, { message: "تخفیف نمی‌تواند منفی باشد" })
    .default(0),
  sku: z
    .string()
    .min(3, { message: "شناسه کالا (SKU) الزامی است" })
    .uppercase({ message: "شناسه کالا باید حروف بزرگ باشد." })
    .trim(),
  stockQuantity: z.coerce
    .number()
    .int({ message: "موجودی باید عدد صحیح باشد" })
    .min(0, { message: "تعداد موجودی نمی‌تواند منفی باشد." }),

  // Gold & Stone Details
  goldDetails: GoldDetailsSchema,
  stones: z.array(StoneDetailsSchema).optional(),

  // Status
  isAvailable: z.boolean().default(true),
  featured: z.boolean().default(false),
  tags: z
    .array(z.string().min(1, { message: "تگ نمی‌تواند خالی باشد" }))
    .optional(),

  // Media (Matching your form's setup to embed the full object)
  media: z.array(MediaSchema).optional(), // Array of full embedded media objects

  // User Interaction (from your original schema)
  comments: z.array(z.object({})).optional(),
  likes: z.array(z.string()).optional(),
  isLiked: z.boolean().default(false),
  isSaved: z.boolean().default(false),
});

export const addToCartSchema = z.object({
  productId: z.string().min(1, { message: "شناسه محصول الزامی است" }),
  quantity: z.number().min(1, { message: "تعداد حداقل ۱ عدد است" }).default(1),
});

export const updateCartSchema = z.object({
  productId: z.string().min(1, { message: "شناسه محصول الزامی است" }),
  quantity: z.number().min(0, { message: "تعداد نمی‌تواند منفی باشد" }),
});
