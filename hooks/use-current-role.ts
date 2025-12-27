import { useSession } from "next-auth/react";
import { useCurrentSession } from "./use-current-session";

export const useCurrentRole = () => {
  const { data: session } = useSession();
  return session?.user?.role;
};
