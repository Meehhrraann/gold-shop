"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import { getAllCategories } from "@/lib/actions/category.action";
import Link from "next/link";

const ProductCategories = () => {
  const items = [
    {
      id: "1",
      url: "/angoshtar.png",
      name: "انگشتر بلریان",
      price: "25,000,000",
    },
    { id: "2", url: "/dastband.png", name: "دستبند", price: "135,000,000" },
    { id: "3", url: "/goshvare.png", name: "گوشواره زمرد", price: "7500,000" },
    {
      id: "4",
      url: "/gardanband.png",
      name: "گردنبند الماس",
      price: "4,500,000",
    },
  ];

  const [categories, setCategories] = React.useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await getAllCategories();
      console.log("ppppppppp", res);
      if (res) setCategories(res);
    };
    fetch();
  }, []);

  return (
    <div className="grid grid-cols-1 justify-center gap-4 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((item) => (
        <Link
          href={`/products?category=${item._id}`}
          key={item._id}
          className="border-primary relative flex flex-col overflow-hidden rounded-lg border"
        >
          {/* IMAGE */}
          <div className="relative aspect-4/3 w-full">
            <Image
              src={item.image || "/no-image.jpg"}
              alt={item.name}
              fill
              style={{ objectFit: "cover" }}
            />

            {/* Bottom shadow + text */}
            <div className="absolute bottom-0 left-0 flex h-20 w-full items-end justify-end bg-gradient-to-t from-black/80 to-transparent p-3"></div>
            <p className="text-primary text-md absolute right-3 bottom-3 text-right">
              {item.name}
            </p>
          </div>

          {/* Bottom section */}
          {/* <div className="flex h-8 justify-end bg-black/70 px-4">
            <p className="text-primary text-right text-sm">{item.name}</p>
          </div> */}
        </Link>
      ))}
    </div>
  );
};

export default ProductCategories;
