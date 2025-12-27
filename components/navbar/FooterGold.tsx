import React from "react";
import { GiPlantsAndAnimals } from "react-icons/gi";
import { TbCopyright } from "react-icons/tb";
import LinkWithLoader from "../loading/LinkWithLoader";

const FooterGold = () => {
  const info = [
    {
      title: "درباره ما",
      desc: "ما یک فروشگاه آنلاین زیورآلات هستیم که با هدف ارائه محصولات باکیفیت و طراحی‌های خاص فعالیت می‌کنیم.",
    },
    {
      title: "آدرس",
      desc: "تهران، خیابان ولیعصر، بالاتر از پارک ملت، پلاک ۱۲۳",
    },
    {
      title: "شماره تماس",
      desc: "021-12345678",
    },
  ];

  return (
    <>
      {/* section 4 */}
      <div className="mt-5 flex min-h-36 w-full flex-col items-center justify-center gap-16 bg-[#1e1e1e] py-2 text-[#e8ca89] lg:flex-row">
        <LinkWithLoader className="cursor-pointer" href="/">
          <div className="flex h-full w-fit flex-col items-center justify-center gap-1">
            <GiPlantsAndAnimals className="size-10" />
            <p className="flex h-fit translate-y-1 font-bold">
              Charmchi Jewels
            </p>
          </div>
        </LinkWithLoader>
        <div className="flex flex-col items-start justify-evenly gap-16 md:flex-row">
          {info.map((item, index) => {
            return (
              <div key={index} className="flex w-48 flex-col text-right">
                <p className="truncate">{item.title}</p>
                <p className="line-clamp-3 text-right text-gray-300">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* section 5 */}
      <div
        dir="rtl"
        className="flex w-full flex-wrap items-center justify-center gap-1 py-3 text-gray-300"
      >
        <TbCopyright className="text-primary size-6" />
        این سایت توسط Meehhrraann@ طراحی شده
      </div>
    </>
  );
};

export default FooterGold;
