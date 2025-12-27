"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// --- Actions & Validation ---
import {
  getProductById,
  updateProduct,
  deleteProductMedia,
} from "@/lib/actions/product.action";
import { createCategory } from "@/lib/actions/category.action";
import { ProductSchema, MediaSchema } from "@/validation";
import useImageUpload from "@/hooks/useImageUpload";
import { inferType } from "@/lib/utils";

// --- UI Components ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormLabel,
  FormItem,
  FormMessage,
  FormField,
  FormDescription,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

import DropWithCrop from "../upload/DropWithCrop";
import { IoClose } from "react-icons/io5";

// --- Types ---
type ProductType = z.infer<typeof ProductSchema> & {
  _id: string;
};

interface FileWithPreview {
  file: File;
  preview: string;
  path?: string;
}

interface CategoryOption {
  _id: string;
  name: string;
}

// 1. Props Interface: Receive product ID and categories
interface UpdateProductFormProps {
  productId: string;
  initialCategories: CategoryOption[];
}

const GOLD_KARATS = [10, 14, 18, 21, 22, 24];
const GOLD_COLORS = ["Yellow", "White", "Rose", "Mixed"];

const GOLD_COLOR_TRANSLATION: Record<string, string> = {
  Yellow: "زرد",
  White: "سفید",
  Rose: "رُز گلد (صورتی)",
  Mixed: "ترکیبی",
};
const getPersianColor = (englishKey: string) =>
  GOLD_COLOR_TRANSLATION[englishKey] || englishKey;

// =========================================================
// ExistingMediaViewer Component
// =========================================================

interface ExistingMediaViewerProps {
  media: z.infer<typeof MediaSchema>[];
  handleMediaDelete: (filename: string, url: string) => void;
}

const ExistingMediaViewer = ({
  media,
  handleMediaDelete,
}: ExistingMediaViewerProps) => {
  const [deletingFile, setDeletingFile] = useState<string | null>(null);

  const onDeleteClick = async (filename: string, url: string) => {
    setDeletingFile(filename);
    try {
      await handleMediaDelete(filename, url);
    } catch (e) {
      console.error(e);
      // 🔥 FIX 1: Persian alert message
      alert("حذف تصویر ناموفق بود.");
    } finally {
      setDeletingFile(null);
    }
  };

  if (media.length === 0) {
    return (
      <p className="text-right text-sm text-gray-500">
        تصویر فعلی برای نمایش وجود ندارد.
      </p>
    );
  }

  return (
    <div
      className="bg-secondary/10 flex flex-wrap gap-4 rounded-lg border p-2"
      dir="rtl"
    >
      {media.map((item) => (
        <div
          key={item.filename}
          className="relative h-24 w-24 overflow-hidden rounded-md border shadow-md"
        >
          <img
            src={item.url}
            alt={item.filename}
            className="h-full w-full object-cover"
          />
          <button
            type="button"
            className="absolute top-0 right-0 rounded-bl-md bg-red-600 p-1 text-white opacity-80 hover:opacity-100 disabled:opacity-50"
            onClick={() => onDeleteClick(item.filename, item.url)}
            disabled={deletingFile === item.filename}
            title="حذف تصویر"
          >
            {deletingFile === item.filename ? "..." : "×"}
          </button>
        </div>
      ))}
    </div>
  );
};

// =========================================================
// MAIN COMPONENT
// =========================================================
const UpdateProductForm = ({
  productId,
  initialCategories,
}: UpdateProductFormProps) => {
  // --- 1. State Management & Hooks ---
  const [categories, setCategories] =
    useState<CategoryOption[]>(initialCategories);
  const [productData, setProductData] = useState<ProductType | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  // File Upload State
  const { handleUpload, deleteFile, error: uploadError } = useImageUpload();
  const [newFiles, setNewFiles] = useState<FileWithPreview[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [currentTag, setCurrentTag] = useState("");
  // Inside CreateProductForm component
  const [categoryFiles, setCategoryFiles] = useState<FileWithPreview[]>([]); // New state for category
  const [categoryError, setCategoryError] = useState(""); // New error state for category modal

  const tagInputRef = useRef<HTMLInputElement>(null);

  // --- 2. Form Initialization ---
  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: "",
      sku: "",
      category: "",
      price: 0,
      discount: 0,
      description: "",
      stockQuantity: 0,
      isAvailable: true,
      featured: false,
      goldDetails: {
        karat: 18,
        weightGrams: 0,
        color: "Yellow",
      },
      stones: [],
      tags: [],
      media: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "stones",
  });

  const currentTags = form.watch("tags") || [];
  const existingMedia = form.watch("media") || [];

  // --- 3. Data Fetching ---
  const fetchProduct = useCallback(async () => {
    setIsLoading(true);
    setSuccess("");
    setErrorMsg("");
    try {
      const res = await getProductById({ productId });

      if (res?.error) {
        setErrorMsg(res.error);
        setProductData(null);
        return;
      }
      if (res?.product) {
        const parsedProduct =
          typeof res.product === "string"
            ? JSON.parse(res.product)
            : res.product;

        // 🔥 CRITICAL FIX: Ensure category is a string ID
        if (
          parsedProduct.category &&
          typeof parsedProduct.category === "object" &&
          parsedProduct.category._id
        ) {
          // If the category was populated (nested object), use its _id
          parsedProduct.category = parsedProduct.category._id;
        } else if (parsedProduct.category) {
          // If it's a direct ObjectId string/object, ensure it's a string
          parsedProduct.category = String(parsedProduct.category);
        }
        // Handle null/undefined category if necessary:
        else {
          parsedProduct.category = ""; // Set to empty string if no category is assigned
        }
        // Ensure numbers are numbers
        parsedProduct.price = Number(parsedProduct.price || 0);
        parsedProduct.discount = Number(parsedProduct.discount || 0);
        parsedProduct.stockQuantity = Number(parsedProduct.stockQuantity || 0);
        if (parsedProduct.goldDetails) {
          parsedProduct.goldDetails.weightGrams = Number(
            parsedProduct.goldDetails.weightGrams || 0,
          );
          parsedProduct.goldDetails.karat = Number(
            parsedProduct.goldDetails.karat || 18,
          );
        }

        // Ensure stones array is valid
        if (!parsedProduct.stones || !Array.isArray(parsedProduct.stones)) {
          parsedProduct.stones = [];
        }

        setProductData(parsedProduct);

        // Reset the form data with the fetched product
        form.reset(parsedProduct);
      } else {
        setErrorMsg("محصولی برای ویرایش یافت نشد.");
        setProductData(null);
      }
    } catch (err) {
      console.error("Error fetching product", err);
      // 🔥 FIX 2: Persian fetch error message
      setErrorMsg("خطای غیرمنتظره‌ای هنگام دریافت اطلاعات محصول رخ داد.");
    } finally {
      setIsLoading(false);
    }
  }, [productId, form]);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    } else {
      setErrorMsg("شناسه محصول نامعتبر است.");
      setIsLoading(false);
    }
  }, [fetchProduct, productId]);

  // --- 4. Handlers ---
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      const newTag = currentTag.trim();
      if (newTag && !currentTags.includes(newTag)) {
        form.setValue("tags", [...currentTags, newTag], {
          shouldValidate: true,
        });
        setCurrentTag("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = currentTags.filter((tag) => tag !== tagToRemove);
    form.setValue("tags", updatedTags, { shouldValidate: true });
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    setIsCreatingCategory(true);
    try {
      let uploadedImageUrl = "";

      // 1. Upload the image if one exists in categoryFiles
      if (categoryFiles.length > 0) {
        const filesToUpload = categoryFiles.map((f) => f.file);

        // Use the same handleUpload hook logic
        await handleUpload(filesToUpload);

        // Construct the final URL (matching your storage pattern)
        uploadedImageUrl = `https://chat-ticket.storage.c2.liara.space/${categoryFiles[0].file.name}`;
      }

      // 2. Call Server Action
      const res = await createCategory({
        name: newCategoryName,
        image: uploadedImageUrl,
      });

      if (res.error) {
        setCategoryError(res.error);
      } else if (res.category) {
        const newCat = { _id: res.category._id, name: res.category.name };
        setCategories((prev) => [...prev, newCat]);
        form.setValue("category", newCat._id);

        // 3. Reset and Close
        setNewCategoryName("");
        setCategoryFiles([]); // Clear the dropzone
        setIsCategoryModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to create category", error);
      setCategoryError("خطا در آپلود تصویر");
    } finally {
      setIsCreatingCategory(false);
    }
  };
  const handleMediaDelete = async (filename: string, url: string) => {
    if (!productId) {
      // 🔥 FIX 3: Persian error message for missing ID
      setErrorMsg("امکان حذف تصویر وجود ندارد: شناسه محصول موجود نیست.");
      return;
    }

    // 1. Delete from Storage (Optional: Log the error, but try to continue)
    try {
      await deleteFile(filename);
    } catch (error) {
      console.warn(
        // 🔥 FIX 4: Persian warning message for storage deletion failure
        'هشدار("حذف فایل از فضای ذخیره‌سازی ناموفق بود. ادامه عملیات با به‌روزرسانی پایگاه داده.',
      );
    }

    // 2. Delete from Database
    try {
      const res = await deleteProductMedia({ productId, filename });
      if (res.error) {
        setErrorMsg(res.error);
        return;
      }

      // 3. Update Form State
      const updatedMedia = existingMedia.filter(
        (media) => media.filename !== filename,
      );
      form.setValue("media", updatedMedia, { shouldValidate: true });
      // 🔥 FIX 5: Persian success message
      setSuccess("تصویر با موفقیت حذف و محصول به‌روزرسانی شد.");
    } catch (error) {
      console.error("Failed to delete media from DB:", error);
      // 🔥 FIX 6: Persian error message for DB deletion failure
      setErrorMsg("خطایی هنگام حذف تصویر از پایگاه داده رخ داد.");
    }
  };

  async function onSubmit(values: z.infer<typeof ProductSchema>) {
    if (!productId) {
      // 🔥 FIX 7: Persian error message for missing ID on submit
      setErrorMsg("شناسه محصول برای به‌روزرسانی وجود ندارد.");
      return;
    }

    setIsSubmitting(true);
    setSuccess("");
    setErrorMsg("");

    try {
      // 1. Handle NEW Image Uploads
      let newMediaList: z.infer<typeof MediaSchema>[] = [];

      if (newFiles.length > 0) {
        await handleUpload(newFiles.map((file) => file.file));

        newMediaList = newFiles.map((file) => ({
          url: `https://chat-ticket.storage.c2.liara.space/${file.file.name}`,
          filename: file.file.name,
          mimeType: file.file.type,
          type: inferType(file.file.type) as any,
          size: file.file.size,
        }));
      }

      // 2. Prepare Payload
      const finalMediaList = [...existingMedia, ...newMediaList];

      const payload = {
        _id: productId,
        ...values,
        media: finalMediaList,
      };

      // 3. Call Server Action
      const res = await updateProduct(payload);

      if (res?.error) setErrorMsg(res.error);
      if (res?.success) {
        setSuccess(res.success);
        setNewFiles([]);
        fetchProduct();
      }
    } catch (error) {
      // 🔥 FIX 8: Persian generic error message
      setErrorMsg(error instanceof Error ? error.message : "خطایی رخ داد");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle Loading State
  if (isLoading) {
    return (
      <div dir="rtl" className="text-primary p-4 text-center">
        در حال بارگذاری اطلاعات محصول...
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="p-4 text-center text-rose-500">
        {errorMsg || "محصولی برای ویرایش یافت نشد."}
      </div>
    );
  }

  // --- 5. Render ---
  return (
    <Form {...form}>
      <form
        className="bg-foreground flex w-full max-w-lg flex-col gap-5 rounded-lg p-4 text-gray-300"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h1 className="text-primary text-center text-2xl font-bold" dir="rtl">
          ویرایش محصول
        </h1>
        <h2 className="text-primary text-xl font-bold" dir="rtl">
          اطلاعات اصلی محصول
        </h2>

        {/* --- Section 1: Core Product Info (Name, SKU, Category) --- */}
        <div className="grid grid-cols-2 gap-4">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem dir="rtl" className="col-span-2">
                <FormLabel className="text-primary">نام محصول</FormLabel>
                <FormControl>
                  <Input placeholder="دستبند، انگشتر و ..." {...field} />
                </FormControl>
                <FormMessage className="text-rose-500" />
              </FormItem>
            )}
          />

          {/* SKU */}
          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem dir="rtl">
                <FormLabel className="text-primary">کد کالا (SKU)</FormLabel>
                <FormControl>
                  <Input placeholder="مثال: BRCLT-001" {...field} />
                </FormControl>
                <FormMessage className="text-rose-500" />
              </FormItem>
            )}
          />

          {/* CATEGORY SELECTOR + CREATE NEW BUTTON */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem dir="rtl">
                <FormLabel className="text-primary">دسته بندی</FormLabel>
                <div className="flex gap-2">
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger dir="rtl" className="w-full">
                        <SelectValue placeholder="انتخاب دسته بندی" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent
                      className="bg-background text-gray-300"
                      dir="rtl"
                    >
                      {categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Dialog
                    open={isCategoryModalOpen}
                    onOpenChange={setIsCategoryModalOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        title="دسته بندی جدید"
                      >
                        +
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]" dir="rtl">
                      <DialogHeader>
                        <DialogTitle className="text-right">
                          افزودن دسته بندی جدید
                        </DialogTitle>
                      </DialogHeader>

                      <div className="flex w-full flex-col gap-4 py-4">
                        {/* Category Name */}
                        <Input
                          id="name"
                          placeholder="نام دسته بندی..."
                          className="col-span-4"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                        />

                        {/* Reuse your DropWithCrop here */}
                        <div className="flex w-full flex-col gap-2">
                          <label className="text-sm font-medium">
                            تصویر دسته بندی
                          </label>
                          <DropWithCrop
                            files={categoryFiles}
                            setFiles={setCategoryFiles}
                            onError={setCategoryError}
                          />
                          {categoryError && (
                            <p className="text-xs text-red-500">
                              {categoryError}
                            </p>
                          )}
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          type="button"
                          onClick={handleCreateCategory}
                          disabled={isCreatingCategory}
                        >
                          {isCreatingCategory ? "در حال ساخت..." : "ذخیره"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <FormMessage className="text-rose-500" />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem dir="rtl">
              <FormLabel className="text-primary">توضیحات</FormLabel>
              <FormControl>
                <Textarea
                  className="focus:ring-0"
                  placeholder="جزئیات و جنس و ..."
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-rose-500" />
            </FormItem>
          )}
        />

        {/* Is Available & Featured Switches */}
        <div className="flex justify-start gap-8" dir="rtl">
          <FormField
            control={form.control}
            name="isAvailable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between gap-3 space-y-0 rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel className="text-primary">وضعیت موجودی</FormLabel>
                  <FormDescription>
                    فعال/غیرفعال کردن نمایش محصول در فروشگاه
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    dir="ltr"
                    className="bg-gray-500"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between gap-3 space-y-0 rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel className="text-primary">محصول ویژه</FormLabel>
                  <FormDescription>
                    نمایش محصول در قسمت محصولات برگزیده
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    dir="ltr"
                    className="bg-gray-500"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* --- Section 2: Financial & Inventory --- */}
        <h2 className="text-primary mt-4 text-xl font-bold" dir="rtl">
          قیمت و موجودی
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {/* Price */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem dir="rtl">
                <FormLabel className="text-primary">قیمت (تومان)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage className="text-rose-500" />
              </FormItem>
            )}
          />

          {/* Discount */}
          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem dir="rtl">
                <FormLabel className="text-primary">تخفیف (درصد)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage className="text-rose-500" />
              </FormItem>
            )}
          />

          {/* Stock Quantity */}
          <FormField
            control={form.control}
            name="stockQuantity"
            render={({ field }) => (
              <FormItem dir="rtl">
                <FormLabel className="text-primary">تعداد موجودی</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage className="text-rose-500" />
              </FormItem>
            )}
          />
        </div>

        {/* --- Section 3: Gold Details --- */}
        <h2 className="text-primary mt-4 text-xl font-bold" dir="rtl">
          مشخصات طلا
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {/* Karat */}
          <FormField
            control={form.control}
            name="goldDetails.karat"
            render={({ field }) => (
              <FormItem dir="rtl">
                <FormLabel className="text-primary">عیار</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={String(field.value)}
                >
                  <FormControl>
                    <SelectTrigger dir="rtl">
                      <SelectValue placeholder="انتخاب عیار" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-background" dir="rtl">
                    {GOLD_KARATS.map((karat) => (
                      <SelectItem key={karat} value={String(karat)}>
                        {karat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-rose-500" />
              </FormItem>
            )}
          />

          {/* Weight */}
          <FormField
            control={form.control}
            name="goldDetails.weightGrams"
            render={({ field }) => (
              <FormItem dir="rtl">
                <FormLabel className="text-primary">وزن (گرم)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage className="text-rose-500" />
              </FormItem>
            )}
          />

          {/* Color */}
          <FormField
            control={form.control}
            name="goldDetails.color"
            render={({ field }) => (
              <FormItem dir="rtl">
                <FormLabel className="text-primary">رنگ</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger dir="rtl">
                      <SelectValue placeholder="انتخاب رنگ" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-background" dir="rtl">
                    {GOLD_COLORS.map((color) => (
                      <SelectItem key={color} value={color}>
                        {getPersianColor(color)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-rose-500" />
              </FormItem>
            )}
          />
        </div>

        {/* --- Section 4: Tags --- */}
        <div dir="rtl">
          <FormLabel className="text-primary">برچسب‌ها</FormLabel>
          <Input
            ref={tagInputRef}
            placeholder="برچسب جدید..."
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            className="mt-2"
          />
          <div className="flex flex-wrap gap-1 py-2">
            {currentTags.map((tag) => (
              <Badge
                key={tag}
                className="bg-primary text-foreground flex items-center gap-0 rtl:flex-row-reverse"
              >
                <p>{tag}</p>
                <button type="button" onClick={() => removeTag(tag)}>
                  <IoClose className="size-3 -translate-y-[2px]" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* --- Section 5: Stones --- */}
        <h2 className="text-primary mt-4 text-xl font-bold" dir="rtl">
          سنگ‌ها
        </h2>
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-col gap-3 rounded-lg border p-3"
            dir="rtl"
          >
            <div className="flex w-full items-center justify-between">
              <p className="text-sm font-semibold text-gray-500">
                سنگ {index + 1}#
              </p>
              <Button
                type="button"
                variant="destructive"
                className="self-start"
                onClick={() => remove(index)}
              >
                <IoClose className="size-5 text-rose-400" />
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {/* Type */}
              <FormField
                control={form.control}
                name={`stones.${index}.type`}
                render={({ field: stoneField }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="text-primary">نوع</FormLabel>
                    <FormControl>
                      <Input placeholder="الماس، یاقوت و..." {...stoneField} />
                    </FormControl>
                    <FormMessage className="text-rose-500" />
                  </FormItem>
                )}
              />
              {/* Count */}
              <FormField
                control={form.control}
                name={`stones.${index}.count`}
                render={({ field: stoneField }) => (
                  <FormItem>
                    <FormLabel className="text-primary">تعداد</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        placeholder="1"
                        {...stoneField}
                        onChange={(e) =>
                          stoneField.onChange(Number(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage className="text-rose-500" />
                  </FormItem>
                )}
              />
              {/* Cut */}
              <FormField
                control={form.control}
                name={`stones.${index}.cut`}
                render={({ field: stoneField }) => (
                  <FormItem>
                    <FormLabel className="text-primary">برش</FormLabel>
                    <FormControl>
                      <Input placeholder="برلیان، زمردی" {...stoneField} />
                    </FormControl>
                    <FormMessage className="text-rose-500" />
                  </FormItem>
                )}
              />
            </div>
            {/* Carat Weight */}
            <FormField
              control={form.control}
              name={`stones.${index}.caratWeight`}
              render={({ field: stoneField }) => (
                <FormItem className="w-1/2">
                  <FormLabel className="text-primary">وزن (قیراط)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...stoneField}
                      onChange={(e) =>
                        stoneField.onChange(Number(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-rose-500" />
                </FormItem>
              )}
            />
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({ type: "", caratWeight: 0, count: 1, cut: "" })
          }
        >
          افزودن سنگ
        </Button>

        {/* --- Section 6: Media --- */}
        <h2 className="text-primary mt-4 text-xl font-bold" dir="rtl">
          تصاویر
        </h2>

        {/* Existing Media Viewer */}
        <ExistingMediaViewer
          media={existingMedia}
          handleMediaDelete={handleMediaDelete}
        />

        {/* Dropzone for New Media */}
        <DropWithCrop
          files={newFiles}
          setFiles={setNewFiles}
          onError={setErrorMsg}
        />

        {/* --- Messages & Submit --- */}
        {errorMsg && <p className="text-right text-rose-500">{errorMsg}</p>}
        {success && <p className="text-right text-green-500">{success}</p>}

        <Button
          className="text-foreground"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "در حال به‌روزرسانی..." : "به‌روزرسانی محصول"}
        </Button>
      </form>
    </Form>
  );
};

export default UpdateProductForm;
