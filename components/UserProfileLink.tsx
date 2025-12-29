"use client";

import React, { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LogOut, User, Settings, ShoppingBag, Loader2 } from "lucide-react";
import { RiAdminLine } from "react-icons/ri";
import LinkWithLoader from "./loading/LinkWithLoader";
import Link from "next/link";

export function UserProfileLink() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [loadingPath, setLoadingPath] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  // Reset loading state and close popover when the URL changes
  useEffect(() => {
    setLoadingPath(null);
    setOpen(false);
  }, [pathname]);

  if (!session) {
    return (
      <Link href="/auth/login">
        <Button
          variant="outline"
          className="cursor-pointer border-[#e8ca89] px-2 text-sm text-[#e8ca89] hover:bg-[#e8ca89] hover:text-black"
        >
          ورود / ثبت‌نام
        </Button>
      </Link>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 cursor-pointer rounded-full p-0 transition-all"
        >
          <Avatar className="h-10 w-10 border border-white/10">
            <AvatarImage
              src={session.user?.image || ""}
              alt={session.user?.name || "User"}
            />
            <AvatarFallback className="text-foreground bg-[#e8ca89] font-bold">
              <p>{session.user?.name?.charAt(0) || "U"}</p>
            </AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-64 border-white/10 bg-[#1a1a1a] p-2 text-white shadow-2xl"
        align="end"
        sideOffset={10}
      >
        <div className="flex flex-col space-y-4 p-2" dir="rtl">
          {/* User Profile Summary */}
          <div className="flex flex-col space-y-1 px-1">
            <p className="text-sm font-semibold text-[#e8ca89]">
              {session.user?.name}
            </p>
            <p className="truncate text-xs text-gray-400">
              {session.user?.email}
            </p>
          </div>

          <Separator className="bg-white/10" />

          {/* Navigation Links */}
          <div className="flex flex-col gap-1">
            <MenuLink
              href="/profile"
              icon={<User size={18} />}
              label="پروفایل"
              loadingPath={loadingPath}
              setLoadingPath={setLoadingPath}
            />

            {session?.user?.role === "ADMIN" && (
              <MenuLink
                href="/admin"
                icon={<RiAdminLine size={18} />}
                label="پنل ادمین"
                loadingPath={loadingPath}
                setLoadingPath={setLoadingPath}
              />
            )}

            <MenuLink
              href="/orders"
              icon={<ShoppingBag size={18} />}
              label="سفارش‌های من"
              loadingPath={loadingPath}
              setLoadingPath={setLoadingPath}
            />

            <MenuLink
              href="/settings"
              icon={<Settings size={18} />}
              label="تنظیمات"
              loadingPath={loadingPath}
              setLoadingPath={setLoadingPath}
            />
          </div>

          <Separator className="bg-white/10" />

          {/* Logout Action */}
          <button
            onClick={() => {
              setLoadingPath("logout");
              signOut();
            }}
            className="flex w-full items-center justify-between rounded-md px-2 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
          >
            <div className="flex items-center gap-2">
              <LogOut size={18} />
              <span>خروج از حساب</span>
            </div>
            {loadingPath === "logout" && (
              <Loader2 size={16} className="animate-spin" />
            )}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Sub-component for Menu Items
interface MenuLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  loadingPath: string | null;
  setLoadingPath: (path: string | null) => void;
}

const MenuLink = ({
  href,
  icon,
  label,
  loadingPath,
  setLoadingPath,
}: MenuLinkProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const isLoading = loadingPath === href;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === href) return;

    setLoadingPath(href);
    router.push(href);
  };

  return (
    <button
      onClick={handleClick}
      className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm transition-all ${isLoading ? "bg-white/5 text-[#e8ca89]" : "text-gray-300 hover:bg-white/5 hover:text-[#e8ca89]"} `}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      {isLoading && (
        <Loader2 size={16} className="animate-spin text-[#e8ca89]" />
      )}
    </button>
  );
};
