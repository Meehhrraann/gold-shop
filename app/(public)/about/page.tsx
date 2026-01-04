"use client";
import { LucideScrollText } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { FaFacebook, FaInstagram, FaTelegram, FaTwitter } from "react-icons/fa";

const Page = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    // Increased padding and max-width for better responsiveness
    <div className="min-h-screen w-full px-6 py-12 md:px-12 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col-reverse items-center gap-12 lg:flex-row lg:items-start">
          {/* 1. Image Container */}
          <div className="relative flex w-full items-center justify-center lg:w-1/2">
            {!imageLoaded && (
              <div className="aspect-square w-full max-w-[500px] animate-pulse rounded-2xl bg-white/10 shadow-xl" />
            )}

            <Image
              src="/about-page.png"
              alt="درباره آرام جولز"
              width={500}
              height={500}
              // Added h-auto for proportional scaling on mobile
              className={`h-auto w-full max-w-[500px] rounded-2xl object-cover shadow-2xl transition-opacity duration-500 ${
                !imageLoaded ? "opacity-0" : "opacity-100"
              }`}
              onLoad={() => setImageLoaded(true)}
              priority
            />
          </div>

          {/* 2. Content Container */}
          <div className="flex w-full flex-col gap-6 lg:w-1/2" dir="rtl">
            {/* Title Section */}
            <div className="flex items-center gap-3 text-[#e8ca89]">
              <LucideScrollText className="size-8 lg:size-10" />
              <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                درباره ما
              </h1>
            </div>

            {/* Main Content */}
            <div className="space-y-4 text-justify leading-relaxed text-gray-300 md:text-lg">
              در قلب هر قطعه جواهر "آرام جولز"، نه تنها طلا و سنگ‌های قیمتی،
              بلکه میراثی غنی از هنر، ظرافت و عشق نهفته است. ما با الهام از
              زیبایی‌های بی‌بدیل طبیعت و فرهنگ اصیل ایرانی، آثاری خلق می‌کنیم که
              فراتر از یک زیورآلات ساده، به نمادی از داستان شخصی شما تبدیل
              می‌شوند. از طراحی‌های کلاسیک و بی‌زمان تا مدل‌های مدرن و جسورانه،
              هر مجموعه ما با دقت و اشتیاق فراوان توسط صنعتگران ماهر ساخته
              می‌شود. تعهد ما به کیفیت بی‌نظیر، از انتخاب بهترین مواد اولیه تا
              کوچکترین جزئیات پرداخت، ستون اصلی کار ماست. ما معتقدیم که هر مشتری
              سزاوار تجربه خریدی منحصر به فرد و لذت‌بخش است، و تیم ما همواره
              آماده ارائه مشاوره‌های تخصصی و پشتیبانی بی‌دریغ است. با "آرام
              جولز"، شما نه تنها یک قطعه جواهر، بلکه خاطره‌ای ماندگار و ارزشی
              ابدی را به خانه می‌برید. ما به داستان شما درخششی ابدی می‌بخشیم
            </div>

            {/* Social Media Section */}
            <div className="mt-4 flex flex-col gap-4">
              <p className="font-medium text-[#e8ca89]">
                ما را در صفحات اجتماعی دنبال کنید:
              </p>
              <div className="flex items-center gap-4">
                <SocialIcon Icon={FaInstagram} href="#" />
                <SocialIcon Icon={FaFacebook} href="#" />
                <SocialIcon Icon={FaTelegram} href="#" />
                <SocialIcon Icon={FaTwitter} href="#" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Extracted Social Icon component for cleaner code
const SocialIcon = ({ Icon, href }: { Icon: any; href: string }) => (
  <a
    href={href}
    className="flex size-10 items-center justify-center rounded-full bg-[#e8ca89] text-[#252525] transition-transform hover:scale-110 active:scale-95"
  >
    <Icon className="size-5" />
  </a>
);

export default Page;
