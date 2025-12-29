"use client";

import React, { useTransition } from "react";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import { formatNumberWithCommas } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
// import { useRouter } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { Loader2 } from "lucide-react";
import { createOrderAction } from "@/lib/actions/cart.actions";

export const CheckoutSummary = () => {
  const { data: session } = useSession();

  // FIXED: Renaming 'cart' to 'cartItems' from Context
  const { cartTotal, itemCount, cartItems, clearCart } = useCart();

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (itemCount === 0) return null;

  const handleCheckout = () => {
    if (!session?.user?.id) {
      toast.error("لطفا ابتدا وارد حساب کاربری خود شوید");
      return router.push("/auth/login");
    }

    console.log("object, cartItems", cartItems);

    startTransition(async () => {
      const res = await createOrderAction({
        userId: session.user.id,
        cartItems: cartItems,
        totalAmount: cartTotal,
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(`${res.success}. کد پیگیری: ${res.orderID}`);

        // Ensure clearCart exists in your Context to empty the cart after purchase
        if (clearCart) clearCart();

        router.push(`/orders`);
      }
    });
  };

  return (
    <div
      className="bg-foreground text-primary border-primary/20 sticky top-20 h-fit rounded-lg border shadow-lg"
      dir="rtl"
    >
      <div className="p-6">
        <h3 className="border-primary/10 mb-6 border-b pb-4 text-right text-xl font-bold">
          خلاصه سفارش
        </h3>

        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between text-gray-300">
            <span>قیمت کالاها ({itemCount})</span>
            <span>{formatNumberWithCommas(cartTotal)} تومان</span>
          </div>

          <div className="flex items-center justify-between text-gray-300">
            <span>هزینه ارسال</span>
            <span className="bg-primary/10 rounded px-2 py-1 text-xs">
              وابسته به آدرس
            </span>
          </div>
        </div>

        <div className="border-primary/10 mb-6 flex items-center justify-between border-t pt-4 text-lg font-bold">
          <span>جمع کل</span>
          <span className="text-primary">
            {formatNumberWithCommas(cartTotal)} تومان
          </span>
        </div>

        <Button
          onClick={handleCheckout}
          disabled={isPending}
          className="bg-primary text-foreground hover:bg-primary/90 w-full cursor-pointer py-6 text-lg transition-all active:scale-95"
        >
          {isPending ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>در حال ثبت سفارش...</span>
            </div>
          ) : (
            "تایید و ثبت نهایی سفارش"
          )}
        </Button>
      </div>
    </div>
  );
};
