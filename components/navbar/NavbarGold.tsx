// "use client";
// import React, { useState } from "react";

// import Link from "next/link";
// import { PiMagnifyingGlassBold, PiSignInBold } from "react-icons/pi";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";

// import {
//   Sheet,
//   SheetClose,
//   SheetContent,
//   SheetDescription,
//   SheetFooter,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";

// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import {
//   GiBigDiamondRing,
//   GiHeartNecklace,
//   GiJewelCrown,
//   GiPlantsAndAnimals,
// } from "react-icons/gi";
// import { IoExitOutline, IoMenu } from "react-icons/io5";
// import { MdOutlineHome } from "react-icons/md";
// import { LucideScrollText, Search } from "lucide-react";
// import { BiPhoneCall } from "react-icons/bi";
// import NavbarGoldLinks from "./NavbarGoldLinks";
// import { CartDrawer } from "../cart/CartDrawer";
// import { signOut } from "next-auth/react";
// import { useCurrentUser } from "@/hooks/use-current-user";
// import { UserProfileLink } from "../UserProfileLink";
// import GlobalSearch from "../search/GlobalSerach";
// import LinkWithLoader from "../loading/LinkWithLoader";
// const NavbarGold = () => {
//   const currentUser = useCurrentUser();
//   return (
//     <div className="flex h-16 w-full items-center justify-between bg-[#1e1e1e] px-5 py-2 text-[#e8ca89] shadow-md">
//       <div className="flex h-full items-center justify-center gap-1">
//         <GiPlantsAndAnimals className="size-10" />
//         <p className="text flex h-fit translate-y-1 font-bold">
//           Charmchi Jewels
//         </p>
//       </div>
//       <div className="flex items-center gap-3 lg:hidden">
//         <div className="relative flex lg:hidden">
//           <Dialog>
//             <form>
//               <DialogTrigger asChild>
//                 <Search className="text-primary cursor-pointer" size={24} />
//               </DialogTrigger>
//               <DialogContent className="bg-foreground top-36 sm:max-w-[425px]">
//                 <DialogHeader>
//                   <DialogTitle className="text-primary">
//                     جستجو در سایت
//                   </DialogTitle>
//                 </DialogHeader>
//                 <GlobalSearch />
//               </DialogContent>
//             </form>
//           </Dialog>
//         </div>
//         <div className="flex scale-120 lg:hidden">
//           <CartDrawer />
//         </div>
//         <div className="flex lg:hidden">
//           <UserProfileLink />
//         </div>
//         <Sheet>
//           <SheetTrigger asChild>
//             <IoMenu className="size-10 cursor-pointer" />
//           </SheetTrigger>
//           <SheetContent className="bg-[#252525] text-gray-300">
//             <SheetHeader>
//               <SheetTitle className="border-b pb-5 text-right text-[#e8ca89]">
//                 منو
//               </SheetTitle>
//             </SheetHeader>

//             <NavbarGoldLinks />
//           </SheetContent>
//         </Sheet>
//       </div>
//       {/* login btn + modal */}
//       <div className="hidden flex-row-reverse items-center lg:flex">
//         <NavbarGoldLinks />
//         {/* <Dialog>
//           <form>
//             <DialogTrigger asChild>
//               <Button
//                 className="cursor-pointer rounded-lg bg-[#e8ca89] px-2 py-1 text-gray-900"
//                 // variant="outline"
//               >
//                 ورود به حساب
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="bg-trasparent p-0 text-black sm:max-w-[425px]">
//               <div className="rounded-xl bg-white/20 p-10 shadow-lg backdrop-blur-md">
//                 <DialogHeader>
//                   <DialogTitle className="text-center text-gray-200">
//                     ایجاد حساب کاربری
//                   </DialogTitle>
//                 </DialogHeader>
//                 <div className="mt-5 grid gap-4">
//                   <div className="grid gap-3">
//                     <Label className="flex justify-end" htmlFor="name-1">
//                       نام
//                     </Label>
//                     <Input
//                       id="name-1"
//                       name="name"
//                       defaultValue="Pedro Duarte"
//                     />
//                   </div>
//                   <div className="grid gap-3">
//                     <Label className="flex justify-end" htmlFor="username-1">
//                       نام خانوادگی
//                     </Label>
//                     <Input
//                       id="username-1"
//                       name="username"
//                       defaultValue="@peduarte"
//                     />
//                   </div>
//                 </div>
//                 <DialogFooter>
//                   <DialogClose asChild>
//                     <Button variant="outline">Cancel</Button>
//                   </DialogClose>
//                   <Button type="submit">Save changes</Button>
//                 </DialogFooter>
//               </div>
//             </DialogContent>
//           </form>
//         </Dialog> */}
//       </div>
//     </div>
//   );
// };

// export default NavbarGold;

"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // To detect route changes
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { GiPlantsAndAnimals } from "react-icons/gi";
import { IoMenu } from "react-icons/io5";
import { Search } from "lucide-react";

import NavbarGoldLinks from "./NavbarGoldLinks";
import { CartDrawer } from "../cart/CartDrawer";
import { useCurrentUser } from "@/hooks/use-current-user";
import { UserProfileLink } from "../UserProfileLink";
import GlobalSearch from "../search/GlobalSerach";
import LoadingModal from "../loading/LoadingModal";
import LinkWithLoader from "../loading/LinkWithLoader";

const NavbarGold = () => {
  const currentUser = useCurrentUser();
  const pathname = usePathname();

  // State for Sheet and Loader
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Effect: When pathname changes (navigation finishes), stop loading and close sheet
  useEffect(() => {
    setIsLoading(false);
    setIsSheetOpen(false);
    setIsSearchOpen(false); // <--- Add this
  }, [pathname]);

  // Handler: When a user clicks a link, start loading and close sheet
  const handleNavClick = () => {
    // If we are already on the page we clicked, don't show loader (optional check)
    setIsLoading(true);
    setIsSheetOpen(false);
    setIsSearchOpen(false); // <--- Add this
  };

  return (
    <>
      {/* The Loading Modal sits at the top level */}
      <LoadingModal isLoading={isLoading} />

      <div className="flex h-16 w-full items-center justify-between bg-[#1e1e1e] px-5 py-2 text-[#e8ca89] shadow-md">
        <LinkWithLoader className="cursor-pointer" href="/">
          <div className="flex h-full items-center justify-center gap-1">
            <GiPlantsAndAnimals className="size-10" />
            <p className="text flex h-fit translate-y-1 font-bold">
              Charmchi Jewels
            </p>
          </div>
        </LinkWithLoader>

        <div className="flex items-center gap-3 lg:hidden">
          {/* Mobile Search */}
          <div className="relative flex lg:hidden">
            <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <DialogTrigger asChild>
                <Search className="text-primary cursor-pointer" size={24} />
              </DialogTrigger>

              <DialogContent className="bg-foreground top-36 sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-primary">
                    جستجو در سایت
                  </DialogTitle>
                </DialogHeader>

                {/* 5. Pass the handler to GlobalSearch */}
                <GlobalSearch onNavClick={handleNavClick} />
              </DialogContent>
            </Dialog>
          </div>

          {pathname !== "/cart" && (
            <div className="flex scale-120 lg:hidden">
              <CartDrawer />
            </div>
          )}

          <div className="flex items-center lg:hidden">
            <UserProfileLink />
          </div>

          {/* Mobile Menu Sheet - Now Controlled */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <IoMenu className="size-10 cursor-pointer" />
            </SheetTrigger>
            <SheetContent className="border-none bg-[#252525] text-gray-300 ring-0">
              <SheetHeader>
                <SheetTitle className="border-b pb-5 text-right text-[#e8ca89]">
                  منو
                </SheetTitle>
              </SheetHeader>

              {/* Pass the handler down */}
              <NavbarGoldLinks onNavClick={handleNavClick} />
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Links */}
        <div className="hidden flex-row-reverse items-center lg:flex">
          {/* Pass the handler down here too for desktop loading effect */}
          <NavbarGoldLinks onNavClick={() => setIsLoading(true)} />
        </div>
      </div>
    </>
  );
};

export default NavbarGold;
