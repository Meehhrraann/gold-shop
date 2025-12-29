"use client";
import React from "react";
import {
  Calendar,
  Hash,
  ChevronLeft,
  Van,
  Truck,
  ChevronRight,
  Phone,
  Headset,
} from "lucide-react";
import { toast } from "sonner";

const OrderCard = ({ order }) => {
  const formatPrice = (price) => new Intl.NumberFormat("fa-IR").format(price);
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("fa-IR");

  return (
    <div className="w-full max-w-lg rounded-2xl border border-[#e8ca89]/20 bg-[#252525] p-6 text-white shadow-2xl sm:w-md">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className="mb-1 block text-xs font-medium text-gray-400">
            شماره سفارش
          </span>
          <div className="flex items-center gap-1">
            <Hash className="h-5 w-5 -translate-y-0.5 text-[#e8ca89]" />
            <span className="text-xl font-bold tracking-tighter text-[#e8ca89] uppercase">
              {order.orderID}
            </span>
          </div>
        </div>
        <div className="text-left">
          <span className="rounded-lg border border-[#e8ca89]/30 bg-[#e8ca89]/10 px-3 py-1 text-xs text-[#e8ca89]">
            {order.status === "Pending" ? "در انتظار تایید" : order.status}
          </span>
        </div>
      </div>

      {/* Horizontal Scroll Area for Product Images */}
      <div className="mb-6">
        <p className="mb-3 flex justify-between text-xs text-gray-400">
          <span>اقلام سفارش ({order.items.length})</span>
        </p>

        <div className="no-scrollbar flex snap-x gap-3 overflow-x-auto scroll-smooth pb-3">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="h-20 w-20 flex-none snap-start overflow-hidden rounded-xl border border-[#e8ca89]/10 bg-[#1e1e1e] transition-colors hover:border-[#e8ca89]/40"
            >
              <img
                src={item.product?.media?.[0]?.url || "/no-image.jpg"}
                alt={item.product?.name || "Product"}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Details Section */}
      <div className="mb-6 flex justify-between gap-4 border-y border-[#e8ca89]/10 py-4">
        <div className="flex items-center gap-1">
          <span className="text-xs text-white">
            {formatDate(order.createdAt)}
          </span>
          <p className="text-xs text-gray-400">:ثبت سفارش</p>
          <Calendar className="h-4 w-4 text-gray-500" />
        </div>
        <div className="flex items-center gap-1 text-left">
          <span className="text-xs text-white">
            {formatDate(order.deliveryDate)}
          </span>
          <span className="text-xs text-gray-400">:تحویل تقریبی </span>
          <Truck className="h-4 w-4 text-gray-500" />
        </div>
      </div>

      {/* Price and Action */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="block text-[10px] text-gray-400">مبلغ پرداختی </span>
          <div className="text-primary flex gap-2 text-2xl font-black">
            {formatPrice(order.totalAmount)}
            <span className="text-primary bg-primary/10 mr-1 rounded-full px-2 py-1 text-sm font-light">
              تومان
            </span>
          </div>
        </div>

        <button
          onClick={() => toast.success("درخاست پیگیری با موفقیت ارسال شد")}
          className="text-foreground flex items-center gap-1 rounded-xl bg-[#e8ca89] p-3 shadow-lg transition-all hover:bg-[#d4b570] active:scale-95"
        >
          <p>پیگیری</p>
          <Headset className="size-5" />
        </button>
      </div>

      {/* Custom Scrollbar Styles (Add to your global CSS or use tailwind-scrollbar plugin) */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          height: 4px;
        }
        .no-scrollbar::-webkit-scrollbar-track {
          background: #1e1e1e;
          border-radius: 10px;
        }
        .no-scrollbar::-webkit-scrollbar-thumb {
          background: #e8ca8933;
          border-radius: 10px;
        }
        .no-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #e8ca8966;
        }
      `}</style>
    </div>
  );
};

export default OrderCard;
