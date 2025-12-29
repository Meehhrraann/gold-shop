"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { formUrlQuery } from "@/lib/utils";
import { ProductFilters } from "@/contants";

const ProductFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [active, setActive] = useState("");

  const handleTypeClick = (item: string) => {
    if (active === item) {
      setActive("");
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: null,
      });

      router.push(newUrl, { scroll: false });
    } else {
      setActive(item);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: item.toLowerCase(),
      });

      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div dir="rtl" className="mt-10 flex flex-wrap gap-3">
      {ProductFilters.map((item) => (
        <Button
          key={item.value}
          onClick={() => {}}
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${
            active === item.value
              ? "bg-primary text-foreground hover:bg-primary/90"
              : "text-primary hover:bg-primary-50 border-primary border bg-transparent"
          }`}
          onClickCapture={() => handleTypeClick(item.value)}
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
};

export default ProductFilter;
