"use client";

import React, { useRef, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import GlobalResult from "./GlobalResult";
import { Search, X } from "lucide-react";

// 1. Define Props to accept the handler
interface GlobalSearchProps {
  onNavClick?: () => void;
}

const GlobalSearch = ({ onNavClick }: GlobalSearchProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const [search, setSearch] = useState(searchParams.get("global") || "");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = (value: string) => {
    setSearch(value);
    setIsOpen(value.length > 0);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const currentUrlQuery = searchParams.get("global") || "";

      if (value) {
        if (value !== currentUrlQuery) {
          const newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: "global",
            value: value,
          });
          router.push(newUrl, { scroll: false });
        }
      } else if (currentUrlQuery) {
        const newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["global", "type"],
        });
        router.push(newUrl, { scroll: false });
      }
    }, 500);
  };

  const handleReset = () => {
    setSearch("");
    setIsOpen(false);
  };

  // 2. New handler: Clears local search AND triggers parent Loader/Close
  const handleResultClick = () => {
    handleReset();
    if (onNavClick) onNavClick();
  };

  return (
    <div ref={searchContainerRef} className="relative w-full max-w-[600px]">
      <div className="bg-background relative flex min-h-[48px] grow items-center gap-2 rounded-xl px-4">
        <Search className="text-primary" size={20} />

        <Input
          dir="rtl"
          type="text"
          placeholder="جستجو کنید..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => search.length > 0 && setIsOpen(true)}
          className="border-none bg-transparent p-0 text-[16px] text-gray-300 shadow-none"
        />

        {search && (
          <X
            size={18}
            className="hover:text-foreground cursor-pointer text-slate-400"
            onClick={handleReset}
          />
        )}
      </div>

      {/* 3. Pass the new handler to the result component */}
      {isOpen && <GlobalResult onLinkClick={handleResultClick} />}
    </div>
  );
};

export default GlobalSearch;
