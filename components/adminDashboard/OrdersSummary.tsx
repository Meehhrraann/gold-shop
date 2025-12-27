import React from "react";

const OrdersSummary = () => {
  const products = [
    {
      name: "انگشتر",
      orders: 678,
      profit: "256,000,000",
      status: { delivered: 250, pending: 64 },
    },
    {
      name: "گردنبند",
      orders: 432,
      profit: "180,000,000",
      status: { delivered: 300, pending: 45 },
    },
    {
      name: "دستبند",
      orders: 295,
      profit: "120,000,000",
      status: { delivered: 200, pending: 30 },
    },
    {
      name: "سرویس کامل",
      orders: 150,
      profit: "500,000,000",
      status: { delivered: 120, pending: 20 },
    },
    {
      name: "گوشواره",
      orders: 520,
      profit: "210,000,000",
      status: { delivered: 400, pending: 60 },
    },
  ];

  return (
    <div className="w-full px-5 py-10">
      {/* header */}
      <p className="text-right text-xl text-gray-300">دسته‌بندی‌های محبوب</p>

      <div className="border-primary mt-10 grid grid-cols-4 border-b-2 text-center">
        <div>نام محصول</div>
        <div>تعداد سفارش</div>
        <div>سود خالص</div>
        <div>وضعیت سفارشات</div>
      </div>

      {products.map((item, index) => (
        <div key={index} className="grid grid-cols-4 py-4 text-center">
          <div>{item.name}</div>
          <div>{item.orders}</div>
          <div>{item.profit}</div>
          <div className="flex justify-center gap-1">
            <div className="rounded-md bg-teal-500 px-1">
              {item.status.delivered}
            </div>
            <div className="rounded-md bg-amber-500 px-1">
              {item.status.pending}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersSummary;
