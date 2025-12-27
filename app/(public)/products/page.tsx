import ProductsGallary from "@/components/products/ProductsGallary";
import React from "react";

const Page = () => {
  return (
    <div className="flex w-full flex-col items-center gap-5 px-5 pt-16 pb-10">
      <div className="flex flex-col items-end justify-end gap-1">
        <p className="text-primary text-3xl font-bold">کالکشن محصولات</p>
        <p className="text-xl font-bold text-gray-300">باما بدرخشید</p>
      </div>

      <div className="w-full md:w-3/4">
        <ProductsGallary />
      </div>
    </div>
  );
};

export default Page;
