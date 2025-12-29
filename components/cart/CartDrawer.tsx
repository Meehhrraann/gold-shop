"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FaShoppingBag } from "react-icons/fa";
import { HiOutlineShoppingBag } from "react-icons/hi";

import { useCart } from "@/context/CartContext";
import { CartList } from "./CartList";
import { formatNumberWithCommas } from "@/lib/utils";
import { Button } from "../ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export const CartDrawer = () => {
  const { itemCount, cartTotal } = useCart();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    if (pathname === "/cart") return;
    setIsLoading(false);
    setIsSheetOpen(false);
  }, [pathname]);
  const handleNavClick = () => {
    if (pathname === "/cart") return;
    // If we are already on the page we clicked, don't show loader (optional check)
    setIsLoading(true);
    setIsSheetOpen(false);
  };

  return (
    <>
      {/* <LoadingModal isLoading={isLoading} /> */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger className="relative flex cursor-pointer whitespace-nowrap">
          <p className="hidden lg:flex">سبدخرید</p>
          <HiOutlineShoppingBag className="size-5" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] text-white">
              {itemCount}
            </span>
          )}
        </SheetTrigger>
        <SheetContent
          side="right"
          className="border-foreground flex w-full flex-col p-5 text-gray-300 ring-0 sm:max-w-md"
        >
          <SheetHeader className="border-primary border-b pb-4">
            <SheetTitle className="text-primary text-right">
              سبد خرید
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto py-4">
            <CartList isDrawer />
          </div>

          {itemCount > 0 && (
            <div className="border-primary space-y-4 border-t pt-4">
              <div className="flex flex-row-reverse justify-between font-bold">
                <span>:جمع کل</span>
                <span>{formatNumberWithCommas(cartTotal)} تومان</span>
              </div>
              <Link onClick={handleNavClick} href="/cart" className="w-full">
                <Button className="text-foreground w-full cursor-pointer">
                  مشاهده و تسویه حساب
                </Button>
              </Link>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
