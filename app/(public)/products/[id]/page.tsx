// @/app/products/[id]/page.tsx

import React from "react";
import Product from "@/components/products/Product";
import { getProductById } from "@/lib/actions/product.action";
import { notFound, redirect } from "next/navigation"; // Import notFound

const Page = async ({ params }) => {
  const { id } = await params;

  const decodedIdSlug = decodeURIComponent(id);
  const parts = decodedIdSlug.split("-");
  const productId = parts[0];

  const result = await getProductById({ productId });

  // ✅ FIX 1: Use notFound() for missing products
  if (result.error || !result.product) {
    notFound();
  }

  const product = result.product;
  const canonicalIdSlug = `${product._id.toString()}-${product.displaySlug}`;

  // ✅ FIX 2: Ensure redirect is NOT inside a try/catch block
  if (decodedIdSlug !== canonicalIdSlug) {
    redirect(`/products/${canonicalIdSlug}`);
  }

  return (
    <div>
      <Product product={product} />
    </div>
  );
};

export default Page;
