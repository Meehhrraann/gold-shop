"use client";

import { GLOBAL_SEARCH_TYPES } from "@/contants";
import { formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const GlobalFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParams = searchParams.get("type");
  const [active, setActive] = useState(typeParams || "");

  const handleTypeClick = (type: string) => {
    // Toggle logic: if clicking active, clear it. If new, set it.
    if (active === type) {
      setActive("");
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: null, // removing the key
      });
      router.push(newUrl, { scroll: false });
    } else {
      setActive(type);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: type.toLowerCase(),
      });
      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className="flex items-center gap-3">
      {GLOBAL_SEARCH_TYPES.map((item) => (
        <button
          type="button"
          key={item.value}
          onClick={() => handleTypeClick(item.value)}
          className={`rounded-2xl px-5 py-2 text-xs font-semibold transition-all ${
            active === item.value
              ? "bg-primary text-foreground" // Replace with your primary color class
              : "text-primary hover:text-primary/80 border-primary border bg-transparent"
          } `}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
};

export default GlobalFilters;
