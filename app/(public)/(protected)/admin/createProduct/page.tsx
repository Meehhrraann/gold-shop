import CreateProductForm from "@/components/products/CreateProductForm";
import { getAllCategories } from "@/lib/actions/category.action";
import React from "react";

const page = async () => {
  // todo check is admin in layoyt
  const categories = await getAllCategories();

  return (
    <div className="flex w-full items-center justify-center px-5 pt-20">
      <CreateProductForm initialCategories={categories} />
    </div>
  );
};

export default page;
