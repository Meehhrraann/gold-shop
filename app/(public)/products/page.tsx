import ProductsGallary from "@/components/products/ProductsGallary";
import { getProducts } from "@/lib/actions/product.action";
import { QUERY_SEARCH_PARAMS_KEY } from "@/contants";
import React from "react";

// 1. Update the Props interface to reflect that searchParams is a Promise
interface Props {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

const Page = async (props: Props) => {
  // 2. Await the params before accessing them
  const searchParams = await props.searchParams;

  const searchQuery = searchParams[QUERY_SEARCH_PARAMS_KEY];
  const filter = searchParams.filter;
  const category = searchParams.category;

  // Fetch initial data (Page 1) on the server
  const { products: initialProducts, isNext: initialIsNext } =
    await getProducts({
      searchQuery,
      filter,
      category,
      page: 1,
      text: "server",
    });

  return (
    <div className="w-full">
      <div className="mx-auto mt-10 flex w-fit flex-col items-end">
        <h1 className="text-primary text-2xl font-bold">کالکشن محصولات</h1>
        <p className="text-white/50">باما بدرخشید</p>
      </div>

      <div className="mt-10 w-full px-5 lg:px-10">
        <ProductsGallary
          initialProducts={initialProducts}
          initialIsNext={initialIsNext}
        />
      </div>
    </div>
  );
};

export default Page;
