import { auth } from "@/auth";
import { Profile } from "@/components/Profile";
import { getUserProfile } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const userData = await getUserProfile({ userId: session.user.id });

  // Check if the action returned an error object
  if (userData.error) {
    return <div>Error: {userData.error}</div>;
  }

  // userData now contains both user info and orders
  return (
    <div className="flex min-h-screen w-full flex-col items-center p-4 lg:p-10">
      <Profile
        user={userData.user} // Added this prop
        counts={userData.counts}
        orderStats={userData.orderStats}
      />
    </div>
  );
}
