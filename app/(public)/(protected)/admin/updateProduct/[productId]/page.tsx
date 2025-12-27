import CreateProductForm from "@/components/products/CreateProductForm";
import UpdateProductForm from "@/components/products/UpdateProductForm";
import { getAllCategories } from "@/lib/actions/category.action";
import React from "react";

const page = async ({ params }) => {
  // todo check is admin in layoyt
  const resolvedParams = await params;
  const { productId } = resolvedParams;
  const categories = await getAllCategories();

  

  console.log("productId", productId);

  return (
    <div className="flex w-full items-center justify-center px-5 pt-20">
      <UpdateProductForm initialCategories={categories} productId={productId} />
    </div>
  );
};

export default page;
