"use client";

import React, { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { NavigationLoader } from "@/components/NavigationLoader"; // Or your loading component

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session, status } = useSession();

  useEffect(() => {
    // ❌ REMOVED: The check for status === "unauthenticated".
    // Why? Because Middleware and Server Components have already verified the user.
    // If the client is slow to sync, we shouldn't kick the user out.

    // ✅ KEEP: Check for explicit RefreshToken errors
    if (session?.error === "RefreshTokenExpired") {
      signOut({ callbackUrl: "/auth/login" });
    }
  }, [session]);

  // Optional: Show loading state if you want, but it's often better to just show the content
  // if the server has already rendered it.
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      {children}
    </div>
  );
}
