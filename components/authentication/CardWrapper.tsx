import Link from "next/link";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { ImGithub } from "react-icons/im";
import Socials from "./Socials";
import { GiPlantsAndAnimals } from "react-icons/gi";

interface CardWrapperProps {
  children: React.ReactNode;
  goToLogin?: boolean;
}

const CardWrapper: React.FC<CardWrapperProps> = ({ children, goToLogin }) => {
  return (
    <div className="flex w-[80%] max-w-96 items-center justify-center gap-x-5 gap-y-3 rounded-lg border border-[#e8ca89]/20 bg-white/2 px-5 py-5 text-[#e8ca89] shadow-xl backdrop-blur-md md:w-[60%] md:max-w-[60%]">
      {" "}
      {/* left section */}
      <div className="hidden aspect-square h-full w-[50%] border-2 border-[#e8ca89] bg-[url('/authImage.png')] bg-cover lg:flex"></div>
      {/* right section */}
      <div className="flex w-full flex-col items-center lg:w-[50%]">
        {/* title */}
        <div className="flex h-full flex-col items-center justify-center gap-1">
          <GiPlantsAndAnimals className="size-14" />
          <p className="flex h-fit translate-y-1 text-lg font-bold">
            Charmchi Jewels
          </p>
        </div>

        <div className="w-full">{children}</div>
        {/* <Socials /> */}
        {goToLogin ? (
          <Link
            className="inline-block transform rounded-lg pt-5 transition-all duration-300 hover:scale-110"
            href={"/auth/register"}
          >
            ایجاد حساب کاربری
          </Link>
        ) : (
          <Link
            className="inline-block transform rounded-lg pt-5 transition-all duration-300 hover:scale-110"
            href={"/auth/login"}
          >
            ورود با حساب کاربری
          </Link>
        )}
      </div>
    </div>
  );
};

export default CardWrapper;
