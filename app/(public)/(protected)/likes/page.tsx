import { auth } from "@/auth";
import LikedProductsList from "@/components/products/LikedProductsList";
import { getLikedProduct } from "@/lib/actions/product.action";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const likedProducts = await getLikedProduct({ userId: session.user.id });

  // Check if the action returned an error object
  if (likedProducts.error) {
    return <div>Error: {likedProducts.error}</div>;
  }

  // userData now contains both user info and orders
  return (
    <div className="flex min-h-screen w-full flex-col items-center p-10 lg:p-10">
      <LikedProductsList initialProducts={likedProducts} />
    </div>
  );
}
