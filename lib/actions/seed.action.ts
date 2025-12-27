"use server";

import { connectMongoDB } from "@/lib/mongodb";
import Product from "@/models/product.model";
import Order from "@/models/order.model";
import Comment from "@/models/comment.model";

// --- 1. Hardcoded Data ---

const USERS = [
  "69479aa1670cc325932d3a0e", // Meehhrraann
  "694e3ace3da6b071145f2871", // سعید
  "694e3af23da6b071145f2877", // سارا
  "694e3b023da6b071145f287d", // سارا (2)
];

const CATEGORIES = [
  {
    id: "6942b5b69478ea3570828d1e",
    name: "حلقه و انگشتر",
    slug: "حلقه-و-انگشتر",
  },
  { id: "6942bbd49478ea3570828d7b", name: "دستبند", slug: "دستبند" },
  { id: "6942bc279478ea3570828d9f", name: "گردنبند", slug: "گردنبند" },
  { id: "6942bc639478ea3570828dc3", name: "گوشواره", slug: "گوشواره" },
];

// --- 2. Persian Data Generators ---

const adjectives = [
  "زیبا",
  "لوکس",
  "مدرن",
  "کلاسیک",
  "ظریف",
  "درخشان",
  "سلطنتی",
  "مینیمال",
  "طرح اسلیمی",
  "نگین‌دار",
];
const materials = ["طلای 18 عیار", "طلای سفید", "طلای رزگلد", "جواهر اصل"];
const stoneTypes = ["الماس", "زمرد", "یاقوت", "برلیان", "فیروزه"];
const colors = ["Yellow", "White", "Rose", "Mixed"];

const commentsText = [
  "بسیار زیبا و با کیفیت بود، ممنون از ارسال سریع.",
  "نسبت به قیمت واقعا ارزش خرید داره.",
  "طراحی خیلی خاصی داره اما وزنش کمی سبک‌تر از انتظارم بود.",
  "برای هدیه گرفتم و خیلی راضی بودم.",
  "بسته‌بندی شیک و مرتبی داشت.",
  "درخشش نگین‌هاش فوق‌العاده‌ست.",
  "من عاشق این طرح شدم، حتما دوباره خرید می‌کنم.",
  "کمی با عکسش متفاوت بود اما در کل راضی‌ام.",
  "پشتیبانی سایت خیلی عالی راهنمایی کردند.",
  "سایزش دقیق بود و کاملا اندازه دستم شد.",
];

function getRandom(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// --- 3. Main Seeding Function ---

export async function seedDatabase() {
  try {
    console.log("🌱 Starting Database Seed...");
    await connectMongoDB();

    const createdProductIds: string[] = [];

    // ---------------------------------------------------------
    // A. Generate 70 Fake Products
    // ---------------------------------------------------------
    console.log("Generating 70 Products...");

    const productsToInsert = [];

    for (let i = 0; i < 70; i++) {
      const category = getRandom(CATEGORIES);
      const adjective = getRandom(adjectives);
      const material = getRandom(materials);

      const productName = `${category.name} ${adjective} ${material}`;
      // FIX: Added 'i' and random number to SKU and Slug to ensure uniqueness
      const uniqueSuffix = `${i}-${getRandomInt(100, 999)}`;

      const basePrice = getRandomInt(5_000_000, 150_000_000);

      const product = {
        name: productName,
        description: `این ${category.name} با طراحی ${adjective} یکی از محبوب‌ترین کارهای گالری ماست. ساخته شده از ${material} که جلوه‌ای خیره‌کننده به استایل شما می‌بخشد.`,
        sku: `SKU-${getRandomInt(1000, 9999)}-${uniqueSuffix}`, // Guaranteed unique SKU
        displaySlug: `${productName.replace(/\s+/g, "-")}-${uniqueSuffix}`, // Guaranteed unique Slug
        category: category.id,
        price: basePrice,
        discount: Math.random() > 0.7 ? getRandomInt(5, 20) : 0,
        stockQuantity: getRandomInt(0, 50),

        goldDetails: {
          karat: 18,
          weightGrams: parseFloat((Math.random() * 15 + 1).toFixed(2)),
          color: getRandom(colors),
        },

        stones:
          Math.random() > 0.5
            ? [
                {
                  type: getRandom(stoneTypes),
                  caratWeight: parseFloat(Math.random().toFixed(2)),
                  count: getRandomInt(1, 10),
                  cut: "Round",
                },
              ]
            : [],

        media: [],
        tags: [category.name, "طلا", adjective, "کادو", "زنانه"],
        isAvailable: true,
        featured: Math.random() > 0.8,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      productsToInsert.push(product);
    }

    const savedProducts = await Product.insertMany(productsToInsert);
    savedProducts.forEach((p) => createdProductIds.push(p._id.toString()));
    console.log("✅ Products Created.");

    // ---------------------------------------------------------
    // B. Generate 70 Fake Comments
    // ---------------------------------------------------------
    console.log("Generating 70 Comments...");
    const commentsToInsert = [];

    for (let i = 0; i < 70; i++) {
      const randomUser = getRandom(USERS);
      const randomProduct = getRandom(createdProductIds);

      commentsToInsert.push({
        content: getRandom(commentsText),
        author: randomUser,
        product: randomProduct,
        isReply: false,
        replies: [],
        createdAt: new Date(Date.now() - getRandomInt(0, 1000000000)),
        updatedAt: new Date(),
      });
    }

    await Comment.insertMany(commentsToInsert);
    console.log("✅ Comments Created.");

    // ---------------------------------------------------------
    // C. Generate 70 Fake Orders
    // ---------------------------------------------------------
    console.log("Generating 70 Orders...");
    const ordersToInsert = [];

    const statuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];
    const now = Date.now(); // Cache time

    for (let i = 0; i < 70; i++) {
      const randomUser = getRandom(USERS);
      const itemCount = getRandomInt(1, 4);
      const orderItems = [];
      let totalAmount = 0;

      for (let j = 0; j < itemCount; j++) {
        const productIndex = getRandomInt(0, savedProducts.length - 1);
        const prod = savedProducts[productIndex];

        const count = getRandomInt(1, 2);
        const price = prod.price;
        const subtotal = price * count;

        orderItems.push({
          product: prod._id,
          count: count,
          priceAtPurchase: price,
          subtotal: subtotal,
        });

        totalAmount += subtotal;
      }

      // FIX: Append loop index 'i' to ensure OrderID is strictly unique
      const uniqueOrderID = `ORD-${now.toString().slice(-6)}-${i}-${getRandomInt(100, 999)}`;

      ordersToInsert.push({
        orderID: uniqueOrderID,
        customer: randomUser,
        items: orderItems,
        totalAmount: totalAmount,
        deliveryDate: new Date(now + getRandomInt(86400000, 604800000)),
        status: getRandom(statuses),
        createdAt: new Date(now - getRandomInt(0, 500000000)),
        updatedAt: new Date(),
      });
    }

    await Order.insertMany(ordersToInsert);
    console.log("✅ Orders Created.");

    return { success: true, message: "Database seeded successfully!" };
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    return { success: false, error: String(error) };
  }
}
