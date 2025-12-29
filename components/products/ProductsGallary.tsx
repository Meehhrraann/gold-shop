"use client";

import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { getProducts } from "@/lib/actions/product.action";
import LocalSearchbar from "../search/localSerchbar";
import { useSearchParams } from "next/navigation";
import { QUERY_SEARCH_PARAMS_KEY } from "@/contants";
import ProductCard from "./ProductCard";
import ProductFilter from "../search/ProductFilter";

interface Props {
  initialProducts: any[];
  initialIsNext: boolean;
}

const ProductsGallary = ({ initialProducts, initialIsNext }: Props) => {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [isNext, setIsNext] = useState(initialIsNext);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Intersection Observer
  const { ref, inView } = useInView();

  const paramFilter = searchParams.get("filter");
  const paramSearch = searchParams.get(QUERY_SEARCH_PARAMS_KEY);
  const paramCategory = searchParams.get("category");

  // Reset when filters change (Sync with Server Page)
  useEffect(() => {
    setProducts(initialProducts);
    setIsNext(initialIsNext);
    setPage(1);
    setIsLoadingMore(false);
  }, [initialProducts, initialIsNext]);

  // Infinite Scroll Trigger
  useEffect(() => {
    if (inView && isNext && !isLoadingMore) {
      loadMoreProducts();
    }
  }, [inView, isNext, isLoadingMore]);

  const loadMoreProducts = async () => {
    setIsLoadingMore(true);
    const nextPage = page + 1;

    try {
      const res = await getProducts({
        searchQuery: paramSearch || undefined,
        filter: paramFilter || undefined,
        category: paramCategory || undefined,
        page: nextPage,
      });

      // Stop if no data
      if (!res || !res.products || res.products.length === 0) {
        setIsNext(false);
        setIsLoadingMore(false);
        return;
      }

      setProducts((prev) => [...prev, ...res.products]);
      setIsNext(res.isNext);
      setPage(nextPage);
    } catch (error) {
      console.error(error);
      setIsNext(false);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // ✅ ADD THIS EFFECT
  useEffect(() => {
    // 1. Disable the browser's automatic scroll restoration
    if (typeof window !== "undefined" && "scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    // 2. Force scroll to top
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="mx-auto mt-10 mb-8 flex w-fit flex-col items-center">
        <LocalSearchbar
          route="/products"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="...جستجوی محصول"
          otherClasses="w-full max-w-md mx-auto"
        />
        <ProductFilter />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.length > 0 ? (
          products.map((item: any, i: number) => (
            <ProductCard key={`${item._id}-${i}`} product={item} />
          ))
        ) : (
          <div className="col-span-full py-10 text-center">
            محصولی یافت نشد.
          </div>
        )}
      </div>

      {isNext && (
        <div ref={ref} className="mt-4 flex w-full justify-center py-10">
          <p className="text-primary">در حال بارگذاری...</p>
        </div>
      )}
    </>
  );
};

export default ProductsGallary;
