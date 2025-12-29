"use client";

import React from "react";
import Link from "next/link";
import { useCurrentRole } from "@/hooks/use-current-role"; // Assuming you have this hook
import {
  LayoutDashboard,
  PlusCircle,
  Trello,
  Edit3,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import LinkWithLoader from "./loading/LinkWithLoader";

const adminLinks = [
  {
    title: "داشبورد مدیریت",
    description: "مشاهده آمار و گزارشات کلی سایت",
    href: "/admin/adminDashboard",
    icon: LayoutDashboard,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "محصول جدید",
    description: "اضافه کردن کالای جدید به فروشگاه",
    href: "/admin/createProduct",
    icon: PlusCircle,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "مدیریت سفارشات (Kanban)",
    description: "بررسی وضعیت سفارشات و فرآیند فروش",
    href: "/admin/kanban",
    icon: Trello,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    title: "ویرایش محصولات",
    description: "تغییر موجودی، قیمت و جزئیات کالاها",
    href: "/products",
    icon: Edit3,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
];

const AdminDashboardClient = () => {
  const role = useCurrentRole();

  return (
    <div className="bg-background min-h-screen px-6 py-12">
      <div className="mx-auto max-w-5xl">
        {/* Header Section */}
        <div className="mb-10 flex flex-col items-center justify-between gap-4 md:flex-row-reverse">
          <div className="text-right">
            <h1 className="text-primary text-3xl font-bold drop-shadow-sm drop-shadow-amber-500 ">
              پنل مدیریت
            </h1>
            <p dir="rtl" className="mt-2 text-white/50">
              خوش آمدید! از بخش‌های زیر برای مدیریت فروشگاه استفاده کنید.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-full bg-emerald-500/10 px-4 py-2 shadow-sm">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <div dir="rtl" className="flex items-center gap-2 text-sm">
              <span className="text-white">سطح دسترسی:</span>
              <span className="font-mono font-bold text-emerald-400">
                {role || "Loading..."}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {adminLinks.map((link) => (
            <Link key={link.href} href={link.href} className="group">
              <Card className="bg-foreground h-full border-none transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <CardContent
                  className="flex items-center gap-5 p-6 text-right"
                  dir="rtl"
                >
                  <div
                    className={`rounded-xl p-4 transition-colors ${link.bg} ${link.color} group-hover:bg-opacity-20`}
                  >
                    <link.icon size={32} />
                  </div>
                  <div>
                    <h3 className="text-primary/50 group-hover:text-primary text-lg font-bold transition-colors">
                      {link.title}
                    </h3>
                    <p className="mt-1 text-sm text-white/50">
                      {link.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardClient;
