// import { useSession } from "next-auth/react";
// import { useCurrentSession } from "./use-current-session";

// export const useCurrentUser = () => {
//   const { data: session } = useSession();
//   return session?.user;
// };

import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
  const { data: session, status } = useSession();

  // Debug log to see what's happening inside the hook
  // console.log("useCurrentUser status:", status, "data:", session);

  if (status === "loading") return undefined; // Or null

  return session?.user;
};
