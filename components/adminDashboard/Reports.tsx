import React from "react";

const Reports = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-5 px-5 py-10">
      {/* Header */}
      <div className="flex w-full px-5">
        <div className="flex w-1/2 flex-col items-center justify-center text-xl">
          <p dir="rtl" className="text-gray-300">
            مجموع سفارشات سالانه{" "}
          </p>
          <p>
            2,560
            <span className="bg-primary text-foreground </div> ml-1 rounded-full px-1 text-xs whitespace-nowrap">
              عدد
            </span>
          </p>
        </div>
        <div className="mx-1 border border-r-1 border-gray-400" />
        <div className="relative flex w-1/2 flex-col items-center justify-center text-xl">
          <p dir="rtl" className="text-gray-300">
            سودخالص سالانه
          </p>
          <p>
            550,000
            <span className="bg-primary text-foreground </div> ml-1 rounded-full px-1 text-xs whitespace-nowrap">
              میلیون تومان
            </span>
          </p>
          {/* <div className="bg-primary text-foreground absolute -top-5 left-0 rounded-full px-1 text-xs">
            میلیون تومان
          </div> */}
        </div>
      </div>
      {/* content */}
      <div
        dir="rtl"
        className="border-t border-t-gray-400 pt-5 text-justify text-gray-200"
      >
        در گالری "آرام جولز"، مجموعه‌ای بی‌نظیر از انگشترهای برلیان با طرح‌ها و
        اندازه‌های متنوع را خواهید یافت، که هر کدام با دقت فراوان و با در نظر
        گرفتن بالاترین استانداردهای کیفیت و زیبایی طراحی و ساخته شده‌اند. اجازه
        دهید درخشش بی‌کران برلیان، شما را در مهمترین لحظات زندگی همراهی کند و
        شکوهی ابدی به استایل شما ببخشد.
      </div>
    </div>
  );
};

export default Reports;
