"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  ShoppingCart,
  DollarSign,
  Users,
  Package,
  ArrowUpLeft,
} from "lucide-react";

// --- Types ---
interface DashboardProps {
  totals: {
    revenue: number;
    orders: number;
    users: number;
    products: number;
  };
  recentOrders: {
    id: string;
    customer: string;
    total: number;
    status: string;
  }[];
  chartData: {
    date: string;
    sales: number;
    orders: number;
  }[];
}

// --- Helpers for Persian Formatting ---

const toPersianDigits = (num: number | string) => {
  return num.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);
};

// 1. NEW: Compact Formatter for Charts (e.g. 1,000,000 -> ۱M)
const formatCompactNumber = (number: number) => {
  if (number >= 1000000000) {
    return toPersianDigits((number / 1000000000).toFixed(1)) + " B";
  }
  if (number >= 1000000) {
    return toPersianDigits((number / 1000000).toFixed(1)) + " M";
  }
  if (number >= 1000) {
    return toPersianDigits((number / 1000).toFixed(0)) + " k";
  }
  return toPersianDigits(number);
};

// Standard Currency Formatter (for Tables/Cards where we have space)
const formatCurrency = (amount: number) => {
  const formatted = Math.round(amount).toLocaleString("en-US");
  return toPersianDigits(formatted);
};

const toJalaliDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("fa-IR-u-ca-persian", {
    month: "short",
    day: "numeric",
  });
};

const translateStatus = (status: string) => {
  const map: Record<string, string> = {
    Pending: "در انتظار",
    Processing: "در حال پردازش",
    Shipped: "ارسال شده",
    Delivered: "تحویل شده",
    Cancelled: "لغو شده",
  };
  return map[status] || status;
};

// --- Sub-Components ---

const StatCard = ({ title, value, icon: Icon, unit = "" }: any) => (
  <div className="rounded-xl border border-white/10 bg-[#252525] p-6 shadow-lg transition hover:bg-[#2a2a2a]">
    <div className="flex items-center justify-between">
      <div className="rounded-full bg-[#e8ca89]/10 p-3 text-[#e8ca89]">
        <Icon size={28} />
      </div>
      <div className="text-left">
        <p className="text-sm font-medium text-gray-400">{title}</p>
        <h3 className="mt-2 text-2xl font-bold text-[#e8ca89]">
          {value}{" "}
          <span className="text-sm font-normal text-gray-500">{unit}</span>
        </h3>
      </div>
    </div>
  </div>
);

const AdminDashboard = ({
  totals,
  recentOrders,
  chartData,
}: DashboardProps) => {
  return (
    <div
      className="min-h-screen w-full bg-[#1e1e1e] p-4 text-white md:p-8"
      dir="rtl"
    >
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#e8ca89]">
            نمای کلی داشبورد
          </h1>
          <p className="mt-1 text-gray-400">
            خوش آمدید، گزارش‌های امروز شما آماده است.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="درآمد کل"
          value={formatCompactNumber(totals.revenue)} // Used compact here for very large numbers
          // unit="$"
          icon={DollarSign}
        />
        <StatCard
          title="تعداد سفارشات"
          value={toPersianDigits(totals.orders)}
          icon={ShoppingCart}
        />
        <StatCard
          title="کاربران فعال"
          value={toPersianDigits(totals.users)}
          icon={Users}
        />
        <StatCard
          title="محصولات"
          value={toPersianDigits(totals.products)}
          icon={Package}
        />
      </div>

      {/* Charts Section */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Sales Chart */}
        <div className="rounded-xl border border-white/10 bg-[#252525] p-6 shadow-lg">
          <h3 className="mb-6 text-lg font-bold text-white">
            نمودار فروش (۷ روز گذشته)
          </h3>
          {/* Force LTR for the chart container so axes render correctly */}
          <div className="h-[300px] w-full" style={{ direction: "ltr" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                // 2. INCREASE MARGINS to prevent text clipping
                margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#444"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke="#888"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  axisLine={false}
                  tickFormatter={(val) => toJalaliDate(val)}
                  dy={10}
                />
                <YAxis
                  stroke="#888"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  axisLine={false}
                  // 3. INCREASE WIDTH for the Y-Axis labels
                  width={80}
                  // 4. Use COMPACT formatter
                  tickFormatter={(val) => formatCompactNumber(val)}
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e1e1e",
                    borderColor: "#333",
                    color: "#fff",
                    textAlign: "right",
                    direction: "rtl",
                    fontFamily: "inherit",
                  }}
                  formatter={(value: number) => [
                    formatCurrency(value),
                    "تومان",
                  ]}
                  labelFormatter={(label) => toJalaliDate(label)}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#e8ca89"
                  strokeWidth={3}
                  dot={{ fill: "#e8ca89", strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="rounded-xl border border-white/10 bg-[#252525] p-6 shadow-lg">
          <h3 className="mb-6 text-lg font-bold text-white">تعداد سفارشات</h3>
          <div dir="lrt" className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#444"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke="#888"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  axisLine={false}
                  tickFormatter={(val) => toJalaliDate(val)}
                  dy={10}
                />
                <YAxis
                  stroke="#888"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  axisLine={false}
                  width={40} // Smaller width needed for simple integers
                  tickFormatter={(val) => toPersianDigits(val)}
                  dx={-10}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    backgroundColor: "#1e1e1e",
                    borderColor: "#333",
                    color: "#fff",
                    textAlign: "right",
                    direction: "rtl",
                  }}
                  formatter={(value: number) => [
                    toPersianDigits(value),
                    "سفارشات",
                  ]}
                  labelFormatter={(label) => toJalaliDate(label)}
                />
                <Bar
                  dataKey="orders"
                  fill="#e8ca89"
                  radius={[4, 4, 0, 0]}
                  opacity={0.8}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="mt-8 rounded-xl border border-white/10 bg-[#252525] p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">سفارشات اخیر</h3>
          <button className="flex items-center text-sm text-[#e8ca89] hover:underline">
            مشاهده همه <ArrowUpLeft size={16} className="mr-1" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-right text-sm text-gray-400">
            <thead className="border-b border-white/10 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">شماره سفارش</th>
                <th className="px-4 py-3 font-medium">مشتری</th>
                <th className="px-4 py-3 font-medium">وضعیت</th>
                <th className="px-4 py-3 font-medium">مبلغ کل</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-white/5 transition hover:bg-white/5"
                  >
                    <td className="px-4 py-3 font-mono font-medium text-white">
                      {order.id}
                    </td>
                    <td className="px-4 py-3">{order.customer}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          order.status === "Delivered"
                            ? "bg-green-500/10 text-green-500"
                            : order.status === "Pending"
                              ? "bg-yellow-500/10 text-yellow-500"
                              : order.status === "Processing"
                                ? "bg-blue-500/10 text-blue-500"
                                : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {translateStatus(order.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white">
                      {formatCurrency(order.total)}{" "}
                      <span className="text-primary bg-primary/10 rounded-full px-2 text-xs">
                        تومان
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    سفارشی یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
