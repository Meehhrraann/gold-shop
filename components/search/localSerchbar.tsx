"use client";

import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { QUERY_SEARCH_PARAMS_KEY } from "@/contants";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { PiMagnifyingGlassBold } from "react-icons/pi";

interface CustomInputProps {
  route: string;
  iconPosition: string;
  imgSrc: string;
  placeholder: string;
  otherClasses?: string;
}

const LocalSearchbar = ({
  route,
  iconPosition,
  imgSrc,
  placeholder,
  otherClasses,
}: CustomInputProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get(QUERY_SEARCH_PARAMS_KEY);

  const [search, setSearch] = useState(query ?? "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // 🛑 CRITICAL FIX: PREVENT INFINITE LOOP
      // If the current search input is the same as the URL query, DO NOTHING.
      if (search === (query || "")) {
        return;
      }

      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: QUERY_SEARCH_PARAMS_KEY,
          value: search,
        });
        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: [QUERY_SEARCH_PARAMS_KEY],
          });
          // Only push if there was actually something to remove
          router.push(newUrl, { scroll: false });
        }
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, route, pathname, router, searchParams, query]);

  return (
    <div
      className={`bg-foreground text-primary flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}
    >
      {iconPosition === "left" && (
        <PiMagnifyingGlassBold className="size-5 cursor-pointer" />
      )}
      <Input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="paragraph-regular no-focus placeholder border-none bg-transparent text-right text-gray-400 shadow-none outline-none"
      />
      {iconPosition === "right" && (
        <PiMagnifyingGlassBold className="size-5 cursor-pointer" />
      )}
    </div>
  );
};

export default LocalSearchbar;
