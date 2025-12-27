import { auth } from "@/auth";
import LikedProducts from "@/components/products/LikedProducts";
import LikedProductsList from "@/components/products/LikedProductsList";
import ProductCard from "@/components/products/ProductCard";
import { Profile } from "@/components/Profile";
import { getLikedProduct } from "@/lib/actions/product.action";
import { getUserProfile } from "@/lib/actions/user.action";
import { toPersianDigits } from "@/lib/utils";
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
    <div className="flex min-h-screen w-full flex-col items-center  p-10 lg:p-10">
      {/* <LikedProducts products={likedProducts} /> */}
      {/* <ProductCard products={likedProducts} /> */}
      <LikedProductsList initialProducts={likedProducts} />
      
    </div>
  );
}
