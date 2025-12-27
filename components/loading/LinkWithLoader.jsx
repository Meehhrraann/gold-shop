// // components/LinkWithLoader.js
// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import LoadingModal from "./LoadingModal";

// export default function LinkWithLoader({ href, children, ...props }) {
//   const [loading, setLoading] = useState(false);
//   const pathname = usePathname();
//   const router = useRouter();

//   // Reset loading state if the path changes
//   useEffect(() => {
//     setLoading(false);
//   }, [pathname]);

//   const handleNavigation = (e) => {
//     // 1. Don't trigger if clicking the current page
//     if (pathname === href) return;

//     e.preventDefault();
//     setLoading(true);

//     // 2. Manually trigger the navigation
//     router.push(href);

//     // 3. Fallback: If for some reason the page doesn't change
//     // (e.g., network error), reset after 5 seconds
//     setTimeout(() => setLoading(false), 5000);
//   };

//   return (
//     <>
//       {loading && <LoadingModal isLoading={true} />}

//       {/* Note: We use the standard Link but intercept the click.
//          To close a Sheet, we can wrap this component in <SheetClose asChild>
//          wherever we use it.
//       */}
//       <Link href={href} onClick={handleNavigation} {...props}>
//         {children}
//       </Link>
//     </>
//   );
// }

"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import LoadingModal from "./LoadingModal";

export default function LinkWithLoader({ href, children, ...props }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [localLoading, setLocalLoading] = useState(false);

  // Sync state when page changes
  useEffect(() => {
    setLocalLoading(false);
  }, [pathname]);

  const handleNavigation = (e) => {
    if (pathname === href) return;

    e.preventDefault();
    setLocalLoading(true);

    startTransition(() => {
      router.push(href);
    });
  };

  const active = localLoading || isPending;

  return (
    <>
      <LoadingModal isLoading={active} />
      <Link href={href} onClick={handleNavigation} {...props}>
        {children}
      </Link>
    </>
  );
}
