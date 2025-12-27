// @/components/products/ProductsGallary.tsx

"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import LinkWithLoader from "../loading/LinkWithLoader";
import { getProducts } from "@/lib/actions/product.action";
import { formatNumberWithCommas } from "@/lib/utils";
import LocalSearchbar from "../search/localSerchbar";
import { useSearchParams } from "next/navigation";
import { QUERY_SEARCH_PARAMS_KEY } from "@/contants";
import Filter from "../search/ProductFilter";
import ProductCard from "./ProductCard";

// Note: You can now remove the static 'items' array

const ProductsGallary = () => {
  // Initialize state as an empty array, which is safe for .map()
  const [products, setProducts] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState();

  const searchParams = useSearchParams();
  const paramFilter = searchParams.get("filter");
  const paramPage = searchParams.get("page");
  const paramSearch = searchParams.get(QUERY_SEARCH_PARAMS_KEY);
  const paramCategory = searchParams.get("category");

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await getProducts({
        searchQuery: paramSearch,
        filter: paramFilter,
        page: paramPage ? +paramPage : 1,
        category: paramCategory, // 2. Pass it to the server action
      });

      if (res?.products) setProducts(res.products);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("ssssssss");
    setProducts([]); // reset result
    setError(""); // reset error
    fetchProducts();
  }, [paramFilter, paramPage, paramSearch, paramCategory]);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-10">
      <Filter />
      <LocalSearchbar
        route="/products" // route that we are!
        iconPosition="left"
        imgSrc="/assets/icons/search.svg"
        placeholder="...جستجوی محصول"
        otherClasses="flex-1 max-w-md"
      />

      {isLoading && (
        <div
          dir="rtl"
          className="text-primary flex items-center gap-2 text-center"
        >
          <div className="border-primary size-4 animate-spin rounded-full border-3 border-t-transparent"></div>

          <p>در حال بارگذاری محصولات...</p>
        </div>
      )}
      {products.length === 0 && !isLoading && (
        <p className="text-center text-gray-500">محصولی برای نمایش یافت نشد.</p>
      )}
      <div className="grid w-full grid-cols-2 justify-center gap-4 md:grid-cols-3 lg:grid-cols-4">
        {/* Remove the JSON.stringify(products) once you are sure the data is structured correctly */}
        {!isLoading &&
          products.map((item) => (
            // <LinkWithLoader
            //   // Use the unique ID from MongoDB (_id) for routing
            //   href={`/products/${item._id}-${item.displaySlug}`}
            //   key={item._id}
            //   className="border-primary relative overflow-hidden rounded-lg border"
            // >
            //   {/* IMAGE */}
            //   <div className="relative aspect-square w-full bg-gray-500">
            //     <Image
            //       // Safely access the first media item's URL
            //       src={item.media?.[0]?.url || "/placeholder.png"}
            //       alt={item.name}
            //       fill
            //       style={{ objectFit: "cover" }}
            //     />

            //     {/* bottom fade only over image */}
            //     <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-black/80 to-transparent" />
            //   </div>

            //   {/* TEXT */}
            //   <div className="text-primary relative z-10 flex h-16 flex-col items-center justify-center text-sm">
            //     <p>{item.name}</p>
            //     <p>
            //       {/* Assuming price is a number and you have a formatNumber utility */}
            //       {item.price ? formatNumberWithCommas(item.price) : "—"}
            //       <span className="bg-primary text-foreground ml-1 rounded-full px-1 text-xs">
            //         تومان
            //       </span>
            //     </p>
            //   </div>
            // </LinkWithLoader>
            <div key={item._id}>
              <ProductCard product={item} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default ProductsGallary;
