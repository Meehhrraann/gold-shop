"use client";

import React, { useEffect, useState, useRef } from "react";
import { Loader2, Tag, ShoppingBag } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import GlobalFilters from "./GlobalFilters";
import { globalSearch } from "@/lib/actions/search.action";
import { GLOBAL_SEARCH_TYPES } from "@/contants";

// Removed DialogTrigger import as it's no longer needed

const GlobalResult = ({ onLinkClick }: { onLinkClick: () => void }) => {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any[]>([]);

  const global = searchParams.get("global");
  const type = searchParams.get("type");

  const lastFetchedQuery = useRef("");

  useEffect(() => {
    const controller = new AbortController();

    const delayDebounceFn = setTimeout(() => {
      const fetchResult = async () => {
        if (!global?.trim()) {
          setResult([]);
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        try {
          const res = await globalSearch({ query: global, type });
          if (!controller.signal.aborted) {
            setResult(JSON.parse(res));
            lastFetchedQuery.current = global;
          }
        } catch (error: any) {
          if (error.name !== "AbortError") console.error(error);
        } finally {
          if (!controller.signal.aborted) setIsLoading(false);
        }
      };

      fetchResult();
    }, 300);

    return () => {
      clearTimeout(delayDebounceFn);
      controller.abort();
    };
  }, [global, type]);

  return (
    <div className="text-primary bg-foreground absolute top-full z-50 mt-3 w-full rounded-xl py-5 shadow-2xl">
      <div
        dir="rtl"
        className="no-scrollbar flex items-center justify-center gap-5 overflow-x-auto px-5"
      >
        <p className="shrink-0 text-xs font-semibold uppercase">فیلتر:</p>
        <GlobalFilters />
      </div>

      <div className="bg-primary my-5 h-[1px]" />

      <div className="max-h-[70vh] space-y-5 overflow-y-auto px-5">
        <p dir="rtl" className="text-xs font-semibold uppercase">
          نتایج جستجو:
        </p>

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-5">
            <p dir="rtl" className="mt-2 text-sm text-gray-200">
              در حال جستجو...
            </p>
            <Loader2 className="text-primary size-6 animate-spin" />
          </div>
        ) : (
          <div className="scrollbar-custom flex max-h-50 flex-col gap-2 overflow-y-auto pr-1">
            {result.length > 0 ? (
              result.map((item: any, index: number) => (
                <Link
                  href={item.url}
                  key={`${item.id}-${index}`}
                  // 1. Trigger the Loading Modal + Close Dialog here
                  onClick={onLinkClick}
                >
                  {/* 2. Removed DialogTrigger. We just use a standard div/styling now */}
                  <div
                    dir="rtl"
                    className="hover:bg-background flex w-full cursor-pointer items-start gap-3 rounded-lg px-3 py-2 text-gray-200 transition"
                  >
                    {item.type === "product" ? (
                      <ShoppingBag className="text-primary mt-1" size={18} />
                    ) : (
                      <Tag className="text-primary mt-1" size={18} />
                    )}

                    <div className="flex flex-col items-start">
                      <p className="line-clamp-1 text-sm font-medium">
                        {item.title}
                      </p>
                      <div className="mt-1 text-[10px] font-bold text-slate-400 uppercase">
                        {GLOBAL_SEARCH_TYPES.find((t) => t.value === item.type)
                          ?.name || item.type}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-5">
                <p dir="rtl" className="text-sm text-gray-200">
                  موردی یافت نشد.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalResult;
