// @/app/products/[id]/page.tsx

import React from "react";
import Product from "@/components/products/Product";
import { getProductById } from "@/lib/actions/product.action";
import { redirect } from "next/navigation";
// import { persianSlugify } from "@/lib/utils"; // ❌ NO LONGER NEEDED HERE

// ... Interface and setup ...

const Page = async ({ params }: ProductPageProps) => {
  const { id } = await params; // ← FIX

  const decodedIdSlug = decodeURIComponent(id);
  const parts = decodedIdSlug.split("-");
  const productId = parts[0];

  const result = await getProductById({ productId });

  if (result.error || !result.product) {
    return redirect("/404");
  }

  const product = result.product;

  const correctDisplaySlug = product.displaySlug;
  const canonicalIdSlug = `${product._id.toString()}-${correctDisplaySlug}`;

  if (decodedIdSlug !== canonicalIdSlug) {
    return redirect(`/products/${canonicalIdSlug}`, "permanent");
  }

  return (
    <div>
      <Product product={product} />
    </div>
  );
};

export default Page;
