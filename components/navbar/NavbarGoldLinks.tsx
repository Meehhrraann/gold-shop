"use client";
import { LucideScrollText } from "lucide-react";
import Link from "next/link"; // Standard Link
import React from "react";
import { GiBigDiamondRing, GiHeartNecklace } from "react-icons/gi";
import { MdOutlineHome } from "react-icons/md";
import { UserProfileLink } from "../UserProfileLink";
import GlobalSearch from "../search/GlobalSerach";
import { CartDrawer } from "../cart/CartDrawer";
import { usePathname } from "next/navigation";
import { useCurrentRole } from "@/hooks/use-current-role";

// Define the props interface
interface NavbarGoldLinksProps {
  onNavClick: () => void;
}

const NavbarGoldLinks = ({ onNavClick }: NavbarGoldLinksProps) => {
  const currentRole = useCurrentRole();
  const pathname = usePathname();

  return (
    <div className="flex w-full flex-col items-end gap-5 px-5 text-right lg:flex-row-reverse">
      <div className="my-auto hidden h-full items-center lg:flex">
        <UserProfileLink />
      </div>

      <Link
        href="/"
        onClick={onNavClick}
        className="hover:text-primary/90 my-auto flex items-center transition-colors"
      >
        <p>خانه</p>
        <MdOutlineHome className="size-5" />
      </Link>

      <Link
        href="/products"
        onClick={onNavClick}
        className="hover:text-primary/90 my-auto flex items-center transition-colors"
      >
        <p>محصولات</p>
        <GiBigDiamondRing className="size-5" />
      </Link>

      <Link
        href="/categories"
        onClick={onNavClick}
        className="hover:text-primary/90 my-auto flex items-center transition-colors"
      >
        <p>دسته‌بندی‌ها</p>
        <GiHeartNecklace className="size-5 translate-y-0.5" />
      </Link>

      <Link
        href="/about"
        onClick={onNavClick}
        className="hover:text-primary/90 my-auto flex items-center transition-colors"
      >
        <p>درباره‌ما</p>
        <LucideScrollText className="size-5" />
      </Link>

      {pathname !== "/cart" && (
        <div className="my-auto hidden items-center justify-center lg:flex">
          <CartDrawer />
        </div>
      )}

      <div className="my-auto hidden items-center lg:flex">
        <GlobalSearch />
      </div>
    </div>
  );
};

export default NavbarGoldLinks;
