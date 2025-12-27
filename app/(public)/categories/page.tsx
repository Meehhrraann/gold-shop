import ProductCategories from "@/components/products/ProductCategories";
import React from "react";

const Page = () => {
  return (
    <div className="flex w-full flex-col items-center gap-10 px-5 pt-20">
      <p className="text-primary text-3xl font-bold"> دسته‌بندی محصولات</p>
      <div className="w-full md:w-3/4">
        <ProductCategories />
      </div>
    </div>
  );
};

export default Page;
