import React from "react";

const QuickAction = () => {
  return (
    <div className="flex w-full flex-col gap-5 px-5 py-10">
      <div className="flex w-full justify-end">
        <p className="text-xl text-gray-300">جعبه ابزار</p>
      </div>
      <div className="flex w-full gap-5">
        <div className="bg-primary text-foreground flex w-1/2 items-center justify-center rounded-md px-4 py-2 text-xl">
          ایجاد محصول جدید
        </div>
        <div className="text-primary border-primary flex w-1/2 items-center justify-center rounded-md border-1 px-4 py-2 text-xl">
          مدیریت کاربران
        </div>
      </div>

      <div className="flex gap-5">
        <div className="text-primary border-primary flex w-1/2 items-center justify-center rounded-md border-1 px-4 py-2 text-xl">
          مدیرت محصولات
        </div>
        <div className="bg-primary text-foreground flex w-1/2 items-center justify-center rounded-md px-4 py-2 text-xl">
          ایجاد بنر
        </div>
      </div>
    </div>
  );
};

export default QuickAction;
