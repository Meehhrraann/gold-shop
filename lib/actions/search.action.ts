"use server";

import { connectMongoDB } from "@/lib/mongodb";
import Product from "@/models/product.model";
import Category from "@/models/category.model";

export async function globalSearch(params: { query: string; type?: string }) {
  try {
    await connectMongoDB();
    const { query, type } = params;

    // Create a case-insensitive regex
    const regexQuery = { $regex: query, $options: "i" };

    let results = [];

    const modelsAndTypes = [
      {
        model: Product,
        searchFields: ["name"], // 👈 Array of multiple fields
        displayField: "name", // UI display this
        type: "product",
      },
      {
        model: Category,
        searchFields: ["name"], // 👈 Search in name OR description
        displayField: "name", // UI display this
        type: "category",
      },
    ];

    const typeLower = type?.toLowerCase();
    const activeModels =
      typeLower && typeLower !== "global"
        ? modelsAndTypes.filter((item) => item.type === typeLower)
        : modelsAndTypes;

    for (const { model, searchFields, displayField, type } of activeModels) {
      // 1. Build the $or array dynamically
      // This creates: [ { name: regex }, { sku: regex }, { tags: regex } ]
      const searchConditions = searchFields.map((field) => ({
        [field]: regexQuery,
      }));

      // 2. Execute query using $or
      const queryResults = await model.find({ $or: searchConditions }).limit(8);

      // 3. Map to standard output
      results.push(
        ...queryResults.map((item) => ({
          title: item[displayField],
          type: type,
          id: item._id.toString(),
          url:
            type === "product"
              ? `/products/${item._id}-${item.displaySlug || item._id}`
              : `/category/${item.slug}`,
        })),
      );
    }

    return JSON.stringify(results);
  } catch (error) {
    console.error("Global Search Error:", error);
    throw error;
  }
}
