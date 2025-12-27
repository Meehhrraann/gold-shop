// "use client";
// import { LucideScrollText, ShoppingCart } from "lucide-react";
// import Link from "next/link";
// import React from "react";
// import { GiBigDiamondRing, GiHeartNecklace } from "react-icons/gi";
// import { MdOutlineExitToApp, MdOutlineHome } from "react-icons/md";
// import { PiMagnifyingGlassBold, PiSignInBold } from "react-icons/pi";
// import LinkWithLoader from "@/components/loading/LinkWithLoader";
// import { RiAdminLine } from "react-icons/ri";
// import { useCurrentRole } from "@/hooks/use-current-role";
// import { BsCart4 } from "react-icons/bs";
// import { CartDrawer } from "../cart/CartDrawer";
// import { usePathname } from "next/navigation";
// import { Button } from "../ui/button";
// import { IoExitOutline } from "react-icons/io5";
// import { signOut } from "next-auth/react";
// import { UserProfileLink } from "../UserProfileLink";
// import GlobalSearch from "../search/GlobalSerach";

// import { Sheet, SheetClose, SheetTrigger } from "@/components/ui/sheet";

// const NavbarGoldLinks = () => {
//   const currentRole = useCurrentRole();
//   const pathname = usePathname();
//   return (
//     <div className="flex w-full flex-col items-end gap-5 px-5 text-right lg:flex-row-reverse">
//       <div className="hidden lg:flex">
//         <UserProfileLink />
//       </div>

//       <LinkWithLoader href="/" className="my-auto flex items-center">
//         <p>خانه</p>
//         <MdOutlineHome className="size-5" />
//       </LinkWithLoader>

//       <LinkWithLoader href="/products" className="my-auto flex items-center">
//         <p>محصولات</p>
//         <GiBigDiamondRing className="size-5" />
//       </LinkWithLoader>
//       <LinkWithLoader href="/categories" className="my-auto flex items-center">
//         <p>دسته‌بندی‌ها</p>
//         <GiHeartNecklace className="size-5 translate-y-0.5" />
//       </LinkWithLoader>
//       <LinkWithLoader href="/about" className="my-auto flex items-center">
//         <p>درباره‌ما</p>
//         <LucideScrollText className="size-5" />
//       </LinkWithLoader>

//       {/* <LinkWithLoader
//         href="/cart"
//         className="flex items-center whitespace-nowrap"
//       >
//         <p>سبد خرید</p>
//         <ShoppingCart className="size-5" />
//       </LinkWithLoader> */}
//       {pathname !== "/cart" && (
//         <div className="my-auto hidden items-center justify-center lg:flex">
//           <CartDrawer />
//         </div>
//       )}

//       {/* {!currentRole && (
//         <LinkWithLoader
//           href="/auth/login"
//           className="w-full rounded-lg bg-[#e8ca89] px-2 py-1 text-gray-900"
//         >
//           <div className="flex items-center justify-center gap-1">
//             <PiSignInBold className="size-4" />
//             <p>ورود به حساب</p>
//           </div>
//         </LinkWithLoader>
//       )} */}

//       <div className="my-auto hidden items-center lg:flex">
//         <GlobalSearch />
//       </div>
//     </div>
//   );
// };

// export default NavbarGoldLinks;

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
