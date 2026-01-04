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

// Mapping for Persian translations and optional color styling
const statusMap = {
  Pending: {
    label: "در انتظار تایید",
    color: "text-[#e8ca89] border-[#e8ca89]/30 bg-[#e8ca89]/10",
  },
  Processing: {
    label: "در حال پردازش",
    color: "text-blue-400 border-blue-400/30 bg-blue-400/10",
  },
  Shipped: {
    label: "ارسال شده",
    color: "text-purple-400 border-purple-400/30 bg-purple-400/10",
  },
  Delivered: {
    label: "تحویل شده",
    color: "text-green-400 border-green-400/30 bg-green-400/10",
  },
  Cancelled: {
    label: "لغو شده",
    color: "text-red-400 border-red-400/30 bg-red-400/10",
  },
};

const OrderCard = ({ order }) => {
  const formatPrice = (price) => new Intl.NumberFormat("fa-IR").format(price);
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("fa-IR");

  // Get current status details or fallback to default
  const currentStatus = statusMap[order.status] || {
    label: order.status,
    color: "text-gray-400 border-gray-400/30 bg-gray-400/10",
  };

  return (
    <div
      dir="rtl"
      className="w-full max-w-lg rounded-2xl border border-[#e8ca89]/20 bg-[#252525] p-6 text-white shadow-2xl sm:w-md"
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="text-left">
          <span
            className={`rounded-lg border px-3 py-1 text-xs font-medium ${currentStatus.color}`}
          >
            {currentStatus.label}
          </span>
        </div>
        <div className="text-right">
          <span className="mb-1 block text-xs font-medium text-gray-400">
            شماره سفارش
          </span>
          <div className="flex items-center justify-end gap-1">
            <span className="text-xl font-bold tracking-tighter text-[#e8ca89] uppercase">
              {order.orderID}
            </span>
            <Hash className="h-5 w-5 -translate-y-0.5 text-[#e8ca89]" />
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Area for Product Images */}
      <div className="mb-6">
        <p className="mb-3 flex justify-between text-xs text-gray-400">
          <span>اقلام سفارش ({order.items.length})</span>
        </p>

        <div className="no-scrollbar flex snap-x flex-row-reverse gap-3 overflow-x-auto scroll-smooth pb-3">
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
      <div className="items-سفشقف mb-6 flex flex-col justify-between gap-4 border-y border-[#e8ca89]/10 py-4 wrap-normal sm:flex-row-reverse">
        <div className="flex items-center gap-1 text-right">
          <Calendar className="h-4 w-4 text-gray-500" />
          <p className="text-xs whitespace-nowrap text-gray-400">:ثبت سفارش</p>
          <span className="text-xs text-white">
            {formatDate(order.createdAt)}
          </span>
        </div>
        <div className="flex items-center gap-1 text-right">
          <Truck className="h-4 w-4 text-gray-500" />
          <span className="text-xs whitespace-nowrap text-gray-400">
            :تحویل تقریبی{" "}
          </span>
          <span className="text-xs text-white">
            {formatDate(order.deliveryDate)}
          </span>
        </div>
      </div>

      {/* Price and Action */}
      <div className="flex flex-row-reverse items-end justify-between gap-1">
        <div className="flex flex-col items-end gap-1">
          <span className="block text-[10px] text-gray-400">مبلغ پرداختی </span>
          <div className="text-primary gap- flex items-center gap-1 text-2xl font-black">
            <span className="text-primary bg-primary/10 rounded-full px-2 py-1 text-xs font-light">
              تومان
            </span>
            {formatPrice(order.totalAmount)}
          </div>
        </div>

        <button
          onClick={() => toast.success("درخواست پیگیری با موفقیت ارسال شد")}
          className="text-foreground bg-primary flex items-center gap-1 rounded-xl p-2 font-semibold shadow-lg transition-all hover:bg-[#d4b570] active:scale-95"
        >
          <p>پیگیری</p>
          <Headset className="size-5" />
        </button>
      </div>

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
