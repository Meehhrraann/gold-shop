import React from "react";
import {
  Heart,
  Bookmark,
  MessageSquare,
  Package,
  Clock,
  RefreshCcw,
  Truck,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface ProfileProps {
  user: any;
  counts: { likes: number; saved: number; comments: number };
  orderStats: {
    Pending: number;
    Processing: number;
    Shipped: number;
    Delivered: number;
    Cancelled: number;
  };
}

export const Profile = ({ user, counts, orderStats }: ProfileProps) => {
  const statusItems = [
    {
      label: "در انتظار",
      value: orderStats.Pending,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      label: "پردازش",
      value: orderStats.Processing,
      icon: RefreshCcw,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "ارسال شده",
      value: orderStats.Shipped,
      icon: Truck,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    {
      label: "تحویل شده",
      value: orderStats.Delivered,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      label: "لغو شده",
      value: orderStats.Cancelled,
      icon: XCircle,
      color: "text-rose-500",
      bg: "bg-rose-50",
    },
  ];

  return (
    <div className="w-full max-w-4xl space-y-6 pb-20" dir="rtl">
      {/* 1. User Header - Mobile Optimized */}
      <div className="bg-foreground flex flex-col items-center gap-4 rounded-2xl p-6 shadow-sm lg:flex-row lg:justify-start">
        <div className="border-primary/10 relative size-24 rounded-full border-4 p-1">
          <Image
            src={user.image || "/default-avatar.png"}
            alt={user.name}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div className="text-center lg:text-right">
          <h2 className="text-xl font-bold text-slate-300">{user.name}</h2>
          <p className="text-sm text-slate-500">{user.email}</p>
          <span className="bg-primary/15 text-primary mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium">
            {user.role === "ADMIN" ? "مدیریت سیستم" : "کاربر تایید شده"}
          </span>
        </div>
      </div>

      {/* 2. Interaction Stats - 3 columns on all screens */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <StatCard
          icon={Heart}
          label="لایک"
          value={counts.likes}
          color="text-pink-500"
        />
        <StatCard
          icon={Bookmark}
          label="ذخیره"
          value={counts.saved}
          color="text-indigo-500"
        />
        <StatCard
          icon={MessageSquare}
          label="نظر"
          value={counts.comments}
          color="text-cyan-500"
        />
      </div>

      {/* 3. Order Status Grid - Mobile First (2 columns -> 5 columns) */}
      <Card className="bg-foreground overflow-hidden border-none shadow-sm">
        <div className="bg-foreground border-primary border-b px-5 py-4">
          <h3 className="flex items-center gap-2 font-bold text-slate-200">
            <Package className="text-primary size-5" />
            وضعیت سفارشات
          </h3>
        </div>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {statusItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-background flex flex-col items-center justify-center rounded-xl p-4"
              >
                <div className={`mb-2 rounded-full p-2.5 ${item.bg}`}>
                  <item.icon className={`size-5 ${item.color}`} />
                </div>
                <span className="text-xl font-bold text-slate-300">
                  {item.value}
                </span>
                <span className="text-[11px] text-slate-400">{item.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


const StatCard = ({ icon: Icon, label, value, color }: any) => (
  <div className="bg-foreground flex flex-col items-center rounded-2xl p-3 shadow-sm sm:p-5">
    <Icon className={`mb-1 size-5 sm:size-6 ${color}`} />
    <span className="text-lg font-bold text-slate-300 sm:text-2xl">
      {value}
    </span>
    <span className="text-[10px] text-slate-400 sm:text-xs">{label}</span>
  </div>
);
