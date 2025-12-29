import Image from "next/image";

import { GiPlantsAndAnimals } from "react-icons/gi";

import { TbCopyright } from "react-icons/tb";
import { FaFacebook, FaInstagram, FaTelegram, FaTwitter } from "react-icons/fa";
import NavbarGold from "@/components/navbar/NavbarGold";
import { Banner } from "@/components/carousal/Carousel";
import LinkWithLoader from "@/components/loading/LinkWithLoader";
import { getProducts } from "@/lib/actions/product.action";
import Link from "next/link";

export default async function Home() {
  const { products } = await getProducts({
    filter: "newest",
    page: 1,

    // category: "some-category-id"
  });
  return (
    <div className="flex min-h-screen flex-col items-center text-center text-[#e8ca89]">
      {/* section 1 */}

      <div
        className="relative h-36 w-full bg-[url('/hero.png')] bg-cover bg-center px-3 shadow-2xl"
        style={{
          height: "calc(100vh - 4rem)",
        }}
      >
        <div className="bg-trasparent bottom-[10%] left-16 mt-50 flex items-center justify-center text-right text-[#e8ca89] lg:absolute">
          <div className="rounded-xl bg-white/20 p-10 shadow-lg backdrop-blur-md">
            <p className="text-5xl drop-shadow-2xl">طلا و جواهر چرمچی</p>

            <p className="mt-2 text-2xl text-gray-300">
              زیبایی که نسل‌ها ماندگار است
            </p>
            <p className="text-xl text-gray-300">هنر در دستان شما</p>
            <Link className="cursor-pointer" href={"/products"}>
              <div className="mt-2 flex-1 rounded-lg bg-[#e8ca89] p-2 text-center text-gray-800">
                نمایش محصولات
              </div>
            </Link>
          </div>
        </div>

        {/* <div className="absolute bottom-[25%] left-14 flex flex-col text-right text-[#e8ca89]">
          
          
        </div> */}
      </div>

      {/* section 2 */}
      <div className="mt-10 flex h-full w-full flex-col items-center">
        <div className="flex h-fit w-[60%] w-full flex-col gap-2">
          <Banner products={products} />
        </div>

        {/* section 3 */}
        <div className="mt-16 flex min-h-20 w-full flex-col items-center justify-center justify-evenly gap-10 md:flex-row md:gap-1">
          <div className="flex w-72 flex-col text-right">
            <p className="text-4xl">کلکسیون جواهرات</p>
            <p className="text-gray-300">انتخاب با شماست</p>
          </div>
          <Link
            className="border-primary w-64 cursor-pointer rounded-lg border-2 bg-transparent px-3 py-2"
            href="/products"
          >
            نمایش همه محصولات
          </Link>
          <div className="flex w-72 items-center justify-center gap-2">
            <FaInstagram className="size-10 rounded-full bg-[#e8ca89] p-1 text-[#252525]" />
            <FaFacebook
              fill="#e8ca89"
              className="size-10 rounded-full text-[#252525]"
            />
            <FaTelegram
              fill="#e8ca89"
              className="size-10 rounded-full text-[#252525]"
            />
            <FaTwitter className="size-10 rounded-full bg-[#e8ca89] p-1 text-[#252525]" />
          </div>
        </div>
      </div>
    </div>
  );
}
