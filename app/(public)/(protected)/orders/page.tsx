import { auth } from "@/auth";
import OrdersList from "@/components/Order/OrdersList";
import { getOrders } from "@/lib/actions/order.action";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const orders = await getOrders({ userId: session.user.id });

  // Check if the action returned an error object
  if (orders.error) {
    return <div>Error: {orders.error}</div>;
  }

  // userData now contains both user info and orders
  return (
    <div className="flex min-h-screen w-full flex-col items-center p-4 lg:p-10">
      <OrdersList initialOrders={orders} />
    </div>
  );
}
