"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
// import LoadingLink from "../LoadingLink";
import Link from "next/link";
// import { SidebarTrigger } from "../ui/sidebar";

const NavbarLinks = () => {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: "/settings", label: "settings" },
    { href: "/server", label: "server" },
    { href: "/client", label: "client" },
    { href: "/admin", label: "admin" },
    { href: "/chats", label: "chats" },
    { href: "/ticketing", label: "ticketing" },
  ];

  return (
    <div>
      {/* links */}
      <div className="flex gap-2 text-black dark:text-white">
        {/* <SidebarTrigger className="-ml-1" /> */}

        {links.map((link) => {
          const isActive = pathname.includes(link.href);

          return (
            <div key={link.label}>
              <Link
                href={link.href}
                className={`block hover:scale-105 ${isActive && "border-primary border-b-3"}`}
              >
                {link.label}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NavbarLinks;
