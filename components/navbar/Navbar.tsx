"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import NavbarLinks from "./NavbarLinks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ImExit } from "react-icons/im";
import { IoExitOutline } from "react-icons/io5";
import { LogoutButton } from "../authentication/LogoutButton";
// import { SidebarTrigger } from "../ui/sidebar";
import { ThemeToggle } from "../theme-toggle";

const Navbar = () => {
  return (
    <div className="dark:bg-bg-primary flex min-w-96 items-center justify-between bg-white p-2">
      <NavbarLinks />
      <div className="flex items-center justify-center">
        <DropdownMenu>
          <div className="flex items-center justify-center gap-2">
            <ThemeToggle />
            <DropdownMenuTrigger
              className="focus:outline-none"
              suppressHydrationWarning
            >
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className="bg-white">
            <DropdownMenuLabel>Hello Mehran</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex gap-1">
              <IoExitOutline />
              <LogoutButton>Logout</LogoutButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;
