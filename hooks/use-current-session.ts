import { authRoutes, publicRoutes } from "@/routes";
import { Session } from "next-auth";
import { getSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

export const useCurrentSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<string>("unauthenticated");
  const pathName = usePathname();

  const retrieveSession = useCallback(async () => {
    try {
      setStatus("loading");
      const sessionData = await getSession();

      if (sessionData) {
        setSession(sessionData);
        setStatus("authenticated");
        return;
      }

      // No session found
      setStatus("unauthenticated");

      // Only sign out if NOT on a public route
      if (!publicRoutes.includes(pathName) && !authRoutes.includes(pathName)) {
        signOut(); // Redirects to sign-in by default
      }
    } catch (error) {
      setStatus("unauthenticated");
      setSession(null);

      if (!publicRoutes.includes(pathName) && !authRoutes.includes(pathName)) {
        signOut();
      }
    }
  }, [pathName]); // Include pathName to react to route changes

  useEffect(() => {
    retrieveSession();
  }, [retrieveSession, pathName]);

  return { session, status };
};
