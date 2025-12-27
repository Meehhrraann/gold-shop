import { auth } from "@/auth";
import { Settings } from "@/components/Settings";

import { getUser } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const userData = await getUser({ userId: session.user.id });

  // IMPORTANT: Serialize Mongoose object to plain JS object
  const cleanUser = JSON.parse(JSON.stringify(userData.user || userData));

  return (
    <div className="flex min-h-screen w-full justify-center p-6">
      <Settings user={cleanUser} />
    </div>
  );
}
