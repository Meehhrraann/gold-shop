// "use client";
// import React, { useEffect, useState, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { useForm, useFieldArray } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// // Assuming ProductSchema and MediaSchema are imported correctly
// import { ProductSchema, MediaSchema } from "@/validation";

// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "../ui/input";
// import { Textarea } from "../ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge"; // Assuming you have a Badge component (e.g., from shadcn/ui)

// import { z } from "zod";
// // Assuming other imports are correctly defined in your project structure
// import useImageUpload from "@/hooks/useImageUpload";
// import { inferType } from "@/lib/utils";
// import DropWithCrop from "../upload/DropWithCrop";
// import { createProduct } from "@/lib/actions/product.action";

// // --- 1. ENUM & CATEGORY DEFINITIONS ---

// const GOLD_KARATS = [10, 14, 18, 21, 22, 24];
// const GOLD_COLORS = ["Yellow", "White", "Rose", "Mixed"];

// // Placeholder for categories (in a real app, this would be fetched from the database)
// const CATEGORIES = [
//   // Existing Categories
//   { id: "60c848d21f6610340050e82c", name: "انگشتر (Rings)" },
//   { id: "60c848d21f6610340050e82d", name: "گردنبند (Necklaces)" },
//   { id: "60c848d21f6610340050e82e", name: "دستبند (Bracelets)" },
//   { id: "60c848d21f6610340050e82f", name: "گوشواره (Earrings)" },
//   { id: "60c848d21f6610340050e830", name: "آویز / مدال (Pendants)" },
//   { id: "60c848d21f6610340050e831", name: "النگو (Bangles)" },
//   { id: "60c848d21f6610340050e832", name: "پابند (Anklets)" },
//   { id: "60c848d21f6610340050e833", name: "زنجیر (Chains)" },
//   { id: "60c848d21f6610340050e834", name: "سنجاق سینه (Brooches/Pins)" },
//   { id: "60c848d21f6610340050e835", name: "سرویس طلا (Jewelry Sets - Full)" },
//   {
//     id: "60c848d21f6610340050e836",
//     name: "نیم ست (Half Sets - e.g., Necklace & Earrings)",
//   },
// ];

// // --- 2. LOCALIZATION MAPS ---

// const GOLD_COLOR_TRANSLATION: Record<string, string> = {
//   Yellow: "زرد",
//   White: "سفید",
//   Rose: "رُز گلد (صورتی)",
//   Mixed: "ترکیبی",
// };

// const getPersianColor = (englishKey: string) =>
//   GOLD_COLOR_TRANSLATION[englishKey] || englishKey;

// // --- 3. TYPESCRIPT INTERFACES ---

// interface FileWithPreview {
//   file: File;
//   preview: string;
//   path?: string;
// }

// const CreateProductForm = () => {
//   const {
//     handleUpload,
//     uploadLinks,
//     error: uploadError,
//     fileList,
//   } = useImageUpload();

//   const [files, setFiles] = useState<FileWithPreview[]>([]);
//   const [isSubmmiting, setIsSubmitting] = useState(false);
//   const [success, setSuccess] = useState("");
//   const [errorMsg, setErrorMsg] = useState("");

//   const [currentTag, setCurrentTag] = useState("");
//   const tagInputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (uploadError) setErrorMsg(uploadError);
//   }, [uploadError]);

//   const form = useForm<z.infer<typeof ProductSchema>>({
//     resolver: zodResolver(ProductSchema),
//     defaultValues: {
//       name: "",
//       sku: "",
//       category: "",
//       price: 0,
//       discount: 0,
//       description: "",
//       stockQuantity: 0,
//       isAvailable: true,
//       featured: false,
//       goldDetails: {
//         karat: 18,
//         weightGrams: 0,
//         color: "Yellow",
//       },
//       stones: [],
//       tags: [],
//       comments: [],
//       media: [],
//       likes: [],
//       isLiked: false,
//       isSaved: false,
//     },
//   });

//   const { fields, append, remove } = useFieldArray({
//     control: form.control,
//     name: "stones",
//   });

//   const currentTags = form.watch("tags") || [];

//   // --- TAG HANDLERS ---
//   const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     // Check if the Enter key was pressed
//     if (e.key === "Enter" || e.key === "Tab") {
//       e.preventDefault(); // Stop form submission or tabbing
//       const newTag = currentTag.trim();

//       if (newTag && !currentTags.includes(newTag)) {
//         // Update the form state with the new tag
//         form.setValue("tags", [...currentTags, newTag], {
//           shouldValidate: true,
//         });
//         // Clear the input field
//         setCurrentTag("");
//       }
//     }
//   };

//   const removeTag = (tagToRemove: string) => {
//     const updatedTags = currentTags.filter((tag) => tag !== tagToRemove);
//     form.setValue("tags", updatedTags, { shouldValidate: true });
//   };
//   // -------------------------

//   useEffect(() => {
//     return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
//   }, []);

//   const resetHandler = () => {
//     setFiles([]);
//     form.reset();
//   };

//   // async function onSubmit(values: z.infer<typeof ProductSchema>) {
//   //   setIsSubmitting(true);
//   //   setSuccess("");
//   //   setErrorMsg("");
//   //   try {
//   //     if (files?.length > 0) {
//   //       await handleUpload(files.map((file) => file.file));
//   //     }

//   //     const formData = new FormData();

//   //     // Append simple fields
//   //     formData.append("name", values?.name ?? "");
//   //     formData.append("price", String(values?.price ?? 0));
//   //     formData.append("discount", String(values?.discount ?? 0));
//   //     formData.append("description", values?.description ?? "");
//   //     formData.append("sku", values?.sku ?? "");
//   //     formData.append("category", values?.category ?? "");
//   //     formData.append("stockQuantity", String(values?.stockQuantity ?? 0));
//   //     formData.append("isAvailable", String(values?.isAvailable ?? true));
//   //     formData.append("featured", String(values?.featured ?? false));

//   //     // Append complex objects as JSON strings
//   //     formData.append("goldDetails", JSON.stringify(values.goldDetails));
//   //     formData.append("stones", JSON.stringify(values.stones ?? []));
//   //     formData.append("tags", JSON.stringify(values.tags ?? []));

//   //     // Append media objects
//   //     const mediaList: z.infer<typeof MediaSchema>[] = files.map((file) => ({
//   //       url: `https://chat-ticket.storage.c2.liara.space/${file.file.name}`,
//   //       filename: file.file.name,
//   //       mimeType: file.file.type,
//   //       type: inferType(file.file.type) as
//   //         | "image"
//   //         | "video"
//   //         | "audio"
//   //         | "file"
//   //         | "document",
//   //       size: file.file.size,
//   //     }));
//   //     formData.append("media", JSON.stringify(mediaList));

//   //     console.log("Submitting Product Data:", values);
//   //     console.log("Media Data:", mediaList);

//   //     const res = await createProduct({ formDatas: formData });

//   //     if (res?.error) setErrorMsg(res.error);
//   //     if (res?.success) {
//   //       setSuccess(res.success);
//   //       resetHandler();
//   //     }
//   //   } catch (error) {
//   //     setErrorMsg(error instanceof Error ? error.message : "An error occurred");
//   //   } finally {
//   //     setIsSubmitting(false);
//   //   }
//   // }

//   // Inside CreateProductForm.tsx

//   async function onSubmit(values: z.infer<typeof ProductSchema>) {
//     setIsSubmitting(true);
//     setSuccess("");
//     setErrorMsg("");

//     try {
//       // 1. Upload Images First (Your existing logic)
//       let mediaList: any[] = [];
//       if (files.length > 0) {
//         await handleUpload(files.map((f) => f.file));
//         // Transform files to MediaSchema format
//         mediaList = files.map((file) => ({
//           url: `https://chat-ticket.storage.c2.liara.space/${file.file.name}`,
//           filename: file.file.name,
//           mimeType: file.file.type,
//           type: inferType(file.file.type),
//           size: file.file.size,
//         }));
//       }

//       // 2. Prepare the Final Object
//       // We override the 'media' field in 'values' with the uploaded data
//       const payload = {
//         ...values,
//         media: mediaList.length > 0 ? mediaList : [],
//         // Ensure numbers are numbers (Zod coerce handles this, but good to be safe)
//         price: Number(values.price),
//         stockQuantity: Number(values.stockQuantity),
//       };

//       // 3. Call Server Action DIRECTLY (No FormData needed!)
//       const res = await createProduct(payload);

//       if (res?.error) setErrorMsg(res.error);
//       if (res?.success) {
//         setSuccess(res.success);
//         resetHandler();
//       }
//     } catch (error) {
//       setErrorMsg("An unexpected error occurred.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   }

//   return (
//     <Form {...form}>
//       <form
//         className="bg-foreground flex w-full max-w-lg flex-col gap-5 rounded-lg p-4"
//         onSubmit={form.handleSubmit(onSubmit)}
//       >
//         <h2 className="text-primary text-xl font-bold" dir="rtl">
//           اطلاعات اصلی محصول
//         </h2>

//         {/* --- Section 1: Core Product Info --- */}
//         <div className="grid grid-cols-2 gap-4">
//           {/* 1. Name */}
//           <FormField
//             control={form.control}
//             name="name"
//             render={({ field }) => (
//               <FormItem dir="rtl" className="col-span-2">
//                 <FormLabel className="text-primary">نام محصول</FormLabel>
//                 <FormControl>
//                   <Input placeholder="دستبند، انگشتر و ..." {...field} />
//                 </FormControl>
//                 {/* FIX APPLIED HERE for full width field */}
//                 <div className="min-h-[1.5rem]">
//                   <FormMessage className="text-wrap text-rose-500" />
//                 </div>
//               </FormItem>
//             )}
//           />
//           {/* 2. SKU */}
//           <FormField
//             control={form.control}
//             name="sku"
//             render={({ field }) => (
//               <FormItem dir="rtl">
//                 <FormLabel className="text-primary">کد کالا (SKU)</FormLabel>
//                 <FormControl>
//                   <Input placeholder="مثال: BRCLT-001" {...field} />
//                 </FormControl>
//                 {/* FIX APPLIED HERE */}
//                 <div className="min-h-[1.5rem]">
//                   <FormMessage className="text-wrap text-rose-500" />
//                 </div>
//               </FormItem>
//             )}
//           />
//           {/* 3. Category (Localized) */}
//           <FormField
//             control={form.control}
//             name="category"
//             render={({ field }) => (
//               <FormItem dir="rtl">
//                 <FormLabel className="text-primary">دسته بندی</FormLabel>
//                 <Select
//                   onValueChange={field.onChange}
//                   defaultValue={field.value}
//                 >
//                   <FormControl>
//                     <SelectTrigger dir="rtl">
//                       <SelectValue placeholder="انتخاب دسته بندی" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent className="bg-background" dir="rtl">
//                     {CATEGORIES.map((cat) => (
//                       <SelectItem key={cat.id} value={cat.id}>
//                         {cat.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 {/* FIX APPLIED HERE */}
//                 <div className="min-h-[1.5rem]">
//                   <FormMessage className="text-wrap text-rose-500" />
//                 </div>
//               </FormItem>
//             )}
//           />
//         </div>

//         {/* 4. Description (Single column field, less critical but fixed for consistency) */}
//         <FormField
//           control={form.control}
//           name="description"
//           render={({ field }) => (
//             <FormItem dir="rtl">
//               <FormLabel className="text-primary">توضیحات</FormLabel>
//               <FormControl>
//                 <Textarea
//                   className="focus:ring-0"
//                   placeholder="جزئیات و جنس و ..."
//                   {...field}
//                 />
//               </FormControl>
//               {/* FIX APPLIED HERE */}
//               <div className="min-h-[1.5rem]">
//                 <FormMessage className="text-wrap text-rose-500" />
//               </div>
//             </FormItem>
//           )}
//         />

//         {/* --- Section 2: Financial & Inventory --- */}
//         <h2 className="text-primary mt-4 text-xl font-bold" dir="rtl">
//           قیمت و موجودی
//         </h2>
//         <div className="grid grid-cols-3 gap-4">
//           {/* 5. Price */}
//           <FormField
//             control={form.control}
//             name="price"
//             render={({ field }) => (
//               <FormItem dir="rtl">
//                 <FormLabel className="text-primary">قیمت</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="number"
//                     placeholder="مبلغ (تومان)"
//                     {...field}
//                     onChange={(e) => field.onChange(Number(e.target.value))}
//                   />
//                 </FormControl>
//                 {/* FIX APPLIED HERE */}
//                 <div className="min-h-[1.5rem]">
//                   <FormMessage className="text-wrap text-rose-500" />
//                 </div>
//               </FormItem>
//             )}
//           />
//           {/* 6. Discount */}
//           <FormField
//             control={form.control}
//             name="discount"
//             render={({ field }) => (
//               <FormItem dir="rtl">
//                 <FormLabel className="text-primary">درصد تخفیف</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="number"
//                     placeholder="0 تا 100"
//                     {...field}
//                     onChange={(e) => field.onChange(Number(e.target.value))}
//                   />
//                 </FormControl>
//                 {/* FIX APPLIED HERE */}
//                 <div className="min-h-[1.5rem]">
//                   <FormMessage className="text-wrap text-rose-500" />
//                 </div>
//               </FormItem>
//             )}
//           />
//           {/* 7. Stock Quantity */}
//           <FormField
//             control={form.control}
//             name="stockQuantity"
//             render={({ field }) => (
//               <FormItem dir="rtl">
//                 <FormLabel className="text-primary">موجودی انبار</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="number"
//                     placeholder="تعداد موجود"
//                     {...field}
//                     onChange={(e) => field.onChange(Number(e.target.value))}
//                   />
//                 </FormControl>
//                 {/* FIX APPLIED HERE */}
//                 <div className="min-h-[1.5rem]">
//                   <FormMessage className="text-wrap text-rose-500" />
//                 </div>
//               </FormItem>
//             )}
//           />
//         </div>

//         {/* --- Section 3: Gold Details --- */}
//         <h2 className="text-primary mt-4 text-xl font-bold" dir="rtl">
//           مشخصات طلا
//         </h2>
//         <div className="grid grid-cols-3 gap-4">
//           {/* 8. Gold Karat */}
//           <FormField
//             control={form.control}
//             name="goldDetails.karat"
//             render={({ field }) => (
//               <FormItem dir="rtl">
//                 <FormLabel className="text-primary">عیار</FormLabel>
//                 <Select
//                   onValueChange={(value) => field.onChange(Number(value))}
//                   defaultValue={String(field.value)}
//                 >
//                   <FormControl>
//                     <SelectTrigger dir="rtl">
//                       <SelectValue placeholder="انتخاب عیار" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent className="bg-background" dir="rtl">
//                     {GOLD_KARATS.map((karat) => (
//                       <SelectItem key={karat} value={String(karat)}>
//                         {karat}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 {/* FIX APPLIED HERE */}
//                 <div className="min-h-[1.5rem]">
//                   <FormMessage className="text-wrap text-rose-500" />
//                 </div>
//               </FormItem>
//             )}
//           />
//           {/* 9. Gold Weight */}
//           <FormField
//             control={form.control}
//             name="goldDetails.weightGrams"
//             render={({ field }) => (
//               <FormItem dir="rtl">
//                 <FormLabel className="text-primary">وزن (گرم)</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="number"
//                     step="0.01"
//                     placeholder="مثال: 5.25"
//                     {...field}
//                     onChange={(e) => field.onChange(Number(e.target.value))}
//                   />
//                 </FormControl>
//                 {/* FIX APPLIED HERE */}
//                 <div className="min-h-[1.5rem]">
//                   <FormMessage className="text-wrap text-rose-500" />
//                 </div>
//               </FormItem>
//             )}
//           />
//           {/* 10. Gold Color (Localized) */}
//           <FormField
//             control={form.control}
//             name="goldDetails.color"
//             render={({ field }) => (
//               <FormItem dir="rtl">
//                 <FormLabel className="text-primary">رنگ</FormLabel>
//                 <Select
//                   onValueChange={field.onChange}
//                   defaultValue={field.value}
//                 >
//                   <FormControl>
//                     <SelectTrigger dir="rtl">
//                       <SelectValue placeholder="انتخاب رنگ">
//                         {field.value
//                           ? getPersianColor(field.value)
//                           : "انتخاب رنگ"}
//                       </SelectValue>
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent className="bg-background" dir="rtl">
//                     {GOLD_COLORS.map((colorKey) => (
//                       <SelectItem key={colorKey} value={colorKey}>
//                         {getPersianColor(colorKey)}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 {/* FIX APPLIED HERE */}
//                 <div className="min-h-[1.5rem]">
//                   <FormMessage className="text-wrap text-rose-500" />
//                 </div>
//               </FormItem>
//             )}
//           />
//         </div>

//         {/* --- Section 4: Tags Input (Already Fixed Alignment) --- */}
//         <h2 className="text-primary mt-4 text-xl font-bold" dir="rtl">
//           برچسب‌ها (Tags)
//         </h2>
//         <div dir="rtl">
//           <FormLabel className="text-primary">برچسب‌های محصول</FormLabel>

//           <Input
//             ref={tagInputRef}
//             placeholder="برچسب جدید (سپس Enter یا Tab را بزنید)"
//             value={currentTag}
//             onChange={(e) => setCurrentTag(e.target.value)}
//             onKeyDown={handleTagInputKeyDown}
//             className="mt-2"
//           />

//           <div className="flex flex-wrap gap-2 py-2">
//             {/* Display existing tags */}
//             {currentTags.map((tag) => (
//               <Badge
//                 key={tag}
//                 variant="secondary"
//                 className="bg-primary text-primary-foreground flex h-7 items-center rtl:flex-row-reverse"
//               >
//                 {tag}
//                 <Button
//                   type="button"
//                   onClick={() => removeTag(tag)}
//                   className="text-primary-foreground ml-2 h-4 w-4 bg-transparent p-0 hover:bg-transparent"
//                   variant="ghost"
//                 >
//                   <span className="text-xs">×</span>
//                 </Button>
//               </Badge>
//             ))}
//           </div>

//           {/* Reserved space for tag error message */}
//           <div className="mt-1 min-h-[1.5rem]">
//             {form.formState.errors.tags && (
//               <p className="text-sm text-wrap text-rose-500">
//                 {form.formState.errors.tags.message}
//               </p>
//             )}
//           </div>

//           <FormDescription dir="rtl">
//             برچسب را تایپ کرده و Enter یا Tab را بزنید تا اضافه شود.
//           </FormDescription>
//         </div>

//         {/* --- Section 5: Stone Details (Fix applied to each field within the array) --- */}
//         <h2 className="text-primary mt-4 text-xl font-bold" dir="rtl">
//           جزئیات سنگ‌های قیمتی
//         </h2>

//         {fields.map((item, index) => (
//           <div
//             key={item.id}
//             className="relative grid grid-cols-4 gap-4 rounded-md border p-4 shadow-sm"
//             dir="rtl"
//           >
//             <h3 className="col-span-4 mb-2 text-lg font-semibold">
//               سنگ #{index + 1}
//             </h3>

//             {/* Stone Type */}
//             <FormField
//               control={form.control}
//               name={`stones.${index}.type`}
//               render={({ field }) => (
//                 <FormItem className="col-span-2">
//                   <FormLabel>نوع سنگ</FormLabel>
//                   <FormControl>
//                     <Input placeholder="الماس، یاقوت و ..." {...field} />
//                   </FormControl>
//                   {/* FIX APPLIED HERE */}
//                   <div className="min-h-[1.5rem]">
//                     <FormMessage className="text-rose-500" />
//                   </div>
//                 </FormItem>
//               )}
//             />

//             {/* Carat Weight */}
//             <FormField
//               control={form.control}
//               name={`stones.${index}.caratWeight`}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>وزن (قیراط)</FormLabel>
//                   <FormControl>
//                     <Input
//                       type="number"
//                       step="0.01"
//                       placeholder="مثال: 0.5"
//                       {...field}
//                       onChange={(e) => field.onChange(Number(e.target.value))}
//                     />
//                   </FormControl>
//                   {/* FIX APPLIED HERE */}
//                   <div className="min-h-[1.5rem]">
//                     <FormMessage className="text-rose-500" />
//                   </div>
//                 </FormItem>
//               )}
//             />

//             {/* Count */}
//             <FormField
//               control={form.control}
//               name={`stones.${index}.count`}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>تعداد</FormLabel>
//                   <FormControl>
//                     <Input
//                       type="number"
//                       placeholder="تعداد"
//                       {...field}
//                       onChange={(e) => field.onChange(Number(e.target.value))}
//                     />
//                   </FormControl>
//                   {/* FIX APPLIED HERE */}
//                   <div className="min-h-[1.5rem]">
//                     <FormMessage className="text-rose-500" />
//                   </div>
//                 </FormItem>
//               )}
//             />

//             {/* Remove Button (No FormMessage, no fix needed) */}
//             <Button
//               type="button"
//               variant="destructive"
//               size="sm"
//               onClick={() => remove(index)}
//               className="absolute top-2 left-2 h-7 w-7 p-0"
//             >
//               ❌
//             </Button>
//           </div>
//         ))}

//         {/* Add Stone Button */}
//         <Button
//           type="button"
//           onClick={() =>
//             append({ type: "", caratWeight: 0, count: 1, cut: "" })
//           }
//           variant="outline"
//           className="text-primary border-primary mt-2 w-full"
//         >
//           ➕ افزودن سنگ جدید
//         </Button>

//         {/* --- Section 6: Media Upload (Single column field, fixed for consistency) --- */}
//         <h2 className="text-primary mt-4 text-xl font-bold" dir="rtl">
//           تصاویر محصول
//         </h2>
//         <DropWithCrop files={files} setFiles={setFiles} onError={setErrorMsg} />
//         {/* FIX APPLIED HERE */}
//         <div className="min-h-[1.5rem]">
//           <FormMessage className="text-wrap text-rose-500">
//             {form.formState.errors.media?.message}
//           </FormMessage>
//         </div>

//         {/* --- Submission & Messages --- */}

//         {errorMsg && <p className="text-red-500">{errorMsg}</p>}
//         {success && <p className="text-teal-500">{success}</p>}

//         <Button
//           className="text-foreground mt-6"
//           type="submit"
//           disabled={isSubmmiting}
//         >
//           {isSubmmiting ? "در حال ثبت..." : "ثبت محصول"}
//         </Button>
//       </form>
//     </Form>
//   );
// };

// export default CreateProductForm;

"use client";

import React, { useEffect, useState, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// --- Actions & Validation ---
import { createProduct } from "@/lib/actions/product.action";
import { createCategory } from "@/lib/actions/category.action"; // Import this!
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"; // Import Dialog components

import DropWithCrop from "../upload/DropWithCrop";

// --- Types ---
interface FileWithPreview {
  file: File;
  preview: string;
  path?: string;
}

interface CategoryOption {
  _id: string;
  name: string;
}

// 1. Props Interface: Receive categories from the parent page
interface CreateProductFormProps {
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
// MAIN COMPONENT
// =========================================================
const CreateProductForm = ({ initialCategories }: CreateProductFormProps) => {
  // --- 1. State Management ---
  const [categories, setCategories] =
    useState<CategoryOption[]>(initialCategories);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const { handleUpload, error: uploadError, fileList } = useImageUpload();

  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [currentTag, setCurrentTag] = useState("");
  // Inside CreateProductForm component
  const [categoryFiles, setCategoryFiles] = useState<FileWithPreview[]>([]); // New state for category
  const [categoryError, setCategoryError] = useState(""); // New error state for category modal
  const tagInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (uploadError) setErrorMsg(uploadError);
  }, [uploadError]);

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  // --- 2. Form Initialization ---
  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: "",
      sku: "",
      category: "", // Will store the Category ID
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

  // --- 3. Handlers ---

  // Tag Handling
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

  // NEW: Handle Create Category
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
  const resetHandler = () => {
    setFiles([]);
    form.reset();
  };

  // UPDATED: Submit Handler (Sends Object, Not FormData)
  async function onSubmit(values: z.infer<typeof ProductSchema>) {
    setIsSubmitting(true);
    setSuccess("");
    setErrorMsg("");

    try {
      // 1. Handle Image Uploads
      let mediaList: z.infer<typeof MediaSchema>[] = [];

      if (files?.length > 0) {
        await handleUpload(files.map((file) => file.file));

        // Construct Media Objects
        mediaList = files.map((file) => ({
          url: `https://chat-ticket.storage.c2.liara.space/${file.file.name}`,
          filename: file.file.name,
          mimeType: file.file.type,
          type: inferType(file.file.type) as any,
          size: file.file.size,
        }));
      }

      // 2. Prepare Payload
      // Merge form values with uploaded media
      const payload = {
        ...values,
        media: mediaList,
      };

      console.log("Submitting Payload:", payload);

      // 3. Call Server Action
      const res = await createProduct(payload);

      if (res?.error) setErrorMsg(res.error);
      if (res?.success) {
        setSuccess(res.success);
        resetHandler();
      }
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        className="bg-foreground flex w-full max-w-lg flex-col gap-5 rounded-lg p-4 text-gray-300"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h2 className="text-primary text-xl font-bold" dir="rtl">
          اطلاعات اصلی محصول
        </h2>

        {/* --- Section 1: Core Product Info --- */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                  <Select
                    onValueChange={field.onChange}
                    value={field.value} // Controlled value
                  >
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

                  {/* CREATE NEW CATEGORY DIALOG */}
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
                  className="text-gray-300 focus:ring-0"
                  placeholder="جزئیات و جنس و ..."
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-rose-500" />
            </FormItem>
          )}
        />

        {/* --- Section 2: Financial & Inventory --- */}
        <h2 className="text-primary mt-4 text-xl font-bold" dir="rtl">
          قیمت و موجودی
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem dir="rtl">
                <FormLabel className="text-primary">قیمت</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage className="text-rose-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem dir="rtl">
                <FormLabel className="text-primary">تخفیف (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage className="text-rose-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stockQuantity"
            render={({ field }) => (
              <FormItem dir="rtl">
                <FormLabel className="text-primary">موجودی</FormLabel>
                <FormControl>
                  <Input
                    type="number"
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
          <FormField
            control={form.control}
            name="goldDetails.karat"
            render={({ field }) => (
              <FormItem dir="rtl">
                <FormLabel className="text-primary">عیار</FormLabel>
                <Select
                  onValueChange={(val) => field.onChange(Number(val))}
                  value={String(field.value)}
                >
                  <FormControl>
                    <SelectTrigger dir="rtl">
                      <SelectValue placeholder="عیار" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-background" dir="rtl">
                    {GOLD_KARATS.map((k) => (
                      <SelectItem key={k} value={String(k)}>
                        {k}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-rose-500" />
              </FormItem>
            )}
          />

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
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage className="text-rose-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="goldDetails.color"
            render={({ field }) => (
              <FormItem dir="rtl">
                <FormLabel className="text-primary">رنگ</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger dir="rtl">
                      <SelectValue placeholder="رنگ" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-background" dir="rtl">
                    {GOLD_COLORS.map((c) => (
                      <SelectItem key={c} value={c}>
                        {getPersianColor(c)}
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
          <div className="flex flex-wrap gap-2 py-2">
            {currentTags.map((tag) => (
              <Badge
                key={tag}
                className="bg-primary flex items-center rtl:flex-row-reverse"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 hover:text-red-300"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* --- Section 5: Stones --- */}
        <h2 className="text-primary mt-4 text-xl font-bold" dir="rtl">
          سنگ‌ها
        </h2>
        {fields.map((item, index) => (
          <div
            key={item.id}
            className="grid grid-cols-4 gap-4 rounded border p-4"
            dir="rtl"
          >
            {/* Note: Simplified for brevity, add stone fields here same as your original code */}
            <div className="col-span-4 flex justify-between">
              <span className="font-bold">سنگ #{index + 1}</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => remove(index)}
              >
                حذف
              </Button>
            </div>

            {/* Type */}
            <FormField
              control={form.control}
              name={`stones.${index}.type`}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>نوع سنگ</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* Carat */}
            <FormField
              control={form.control}
              name={`stones.${index}.caratWeight`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>وزن</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* Count */}
            <FormField
              control={form.control}
              name={`stones.${index}.count`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تعداد</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
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
        <DropWithCrop files={files} setFiles={setFiles} onError={setErrorMsg} />

        {/* --- Messages & Submit --- */}
        {errorMsg && <p className="text-right text-red-500">{errorMsg}</p>}
        {success && <p className="text-right text-green-500">{success}</p>}

        <Button
          className="text-foreground"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "در حال ثبت..." : "ثبت محصول"}
        </Button>
      </form>
    </Form>
  );
};

export default CreateProductForm;
