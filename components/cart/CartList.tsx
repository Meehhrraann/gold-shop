"use client";

import React from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import CartControl from "@/components/cart/CartControl";
import { formatNumberWithCommas } from "@/lib/utils";
import { FaShoppingCart } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CartListProps {
  isDrawer?: boolean;
}

export const CartList = ({ isDrawer = false }: CartListProps) => {
  const { cartItems, cartTotal, itemCount, loading } = useCart();

  if (loading)
    return <div className="p-10 text-center">در حال بارگذاری...</div>;

  if (cartItems?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <FaShoppingCart className="size-12 text-gray-200" />
        <p className="text-gray-500">سبد خرید شما خالی است</p>
        {isDrawer && (
          <Link href="/products">
            <Button variant="outline" size="sm">
              برو به فروشگاه
            </Button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-4 ${isDrawer ? "px-2" : ""}`}>
      {cartItems.map((item) => (
        <div
          key={item.product._id}
          className="bg-foreground flex flex-row-reverse items-center justify-between gap-3 rounded-lg p-3 text-gray-300 shadow-sm"
        >
          {/* Image */}
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md">
            <Image
              src={item.product.media?.[0]?.url || "/no-image.jpg"}
              alt={item.product.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Details */}
          <div dir="rtl" className="flex flex-1 justify-between gap-3">
            <div className="flex flex-col items-start gap-1">
              <h4 className="line-clamp-1 text-sm font-bold">
                {item.product.name}
              </h4>
              <p
                dir="rtl"
                className="text-primary line-clamp-1 text-xs font-semibold"
              >
                قیمت {formatNumberWithCommas(item.product.price)} هزارتومان
              </p>
            </div>
            <CartControl product={item.product} />
          </div>
        </div>
      ))}
    </div>
  );
};
