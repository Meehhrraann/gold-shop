"use client";
import { formatNumberWithCommas } from "@/lib/utils";
import { Dot, Heart, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import CartControl from "../cart/CartControl";
import { usePathname } from "next/navigation";
import { currentUser } from "@/lib/actions/currentSession.action";
import { useCurrentUser } from "@/hooks/use-current-user";
import { handleProductLike } from "@/lib/actions/product.action";
import { toast } from "sonner";
import LinkWithLoader from "../loading/LinkWithLoader";
import { Button } from "../ui/button";

const ProductCard = ({ product, setProducts }) => {
  const currentUser = useCurrentUser();
  const pathname = usePathname();
  const finalPrice = product.price - product.price * (product.discount / 100);
  const isLiked = product?.likes?.includes(currentUser?.id);
  const [like, setLike] = useState(isLiked);

  const likeHandler = async () => {
    const res = await handleProductLike({
      productId: product._id,
      userId: currentUser?.id,
    });
    if (res?.liked) {
      setLike(true);
      toast.success("لایک شد");
    } else {
      setLike(false);
      setProducts((prev) => prev.filter((item) => item._id !== product._id));
      toast.success("محصول از لیست علاقه مندی های شما حذف شد.");
    }
  };

  return (
    <LinkWithLoader href={`/products/${product._id}-${product.displaySlug}`}>
      <div className="hover:border-primary/50 group w-full overflow-hidden rounded-lg border border-white/10 bg-[#2a2a2a] hover:border">
        {/* Image + btn's */}
        <div className="bg-foreground relative aspect-square overflow-hidden">
          <Image
            src={product.media[0]?.url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />

          <div className="absolute top-0 flex w-full items-center justify-between px-2 pt-2">
            {currentUser?.id && pathname === "/products" ? (
              <div
                onClick={likeHandler}
                className="aspect-square cursor-pointer rounded-full bg-black/50 p-2"
              >
                <Heart
                  fill={`${like ? "red" : "none"}`}
                  className={`size-4 ${like ? "text-red-500" : "text-primary"}`}
                />
              </div>
            ) : (
              <div
                onClick={likeHandler}
                className="aspect-square rounded-full bg-black/50 p-2"
              >
                <Trash2 className="size-4 text-gray-200 hover:text-red-400" />
              </div>
            )}

            <div
              className={`flex h-fit items-center justify-center rounded-lg bg-red-500 px-2 py-1 text-xs text-gray-300 ${product.discount === 0 ? "invisible" : ""}`}
            >
              {product.discount}٪
            </div>
          </div>
        </div>
        {/* text */}
        <div dir="rtl" className="flex flex-col gap-2 px-3 py-2 text-white">
          <p className="truncate text-lg">{product.name}</p>
          <div className="flex items-center text-[10px] tracking-widest text-white/40">
            <p>طلای {product.goldDetails.karat} عیار</p>
            <Dot className="" />
            <p> {product.goldDetails.weightGrams} گرم</p>
          </div>
          <div
            className={`flex w-full items-center justify-end gap-1 text-left text-xs text-white/40 ${product.discount > 0 ? "" : "invisible"}`}
          >
            <p>تومان</p>
            <p className="line-through">
              {formatNumberWithCommas(product.price)}
            </p>
          </div>
          <div
            className={`text-primary flex w-full items-center justify-end gap-1 text-left`}
          >
            <p className="text-primary/60">تومان</p>
            <p className="text-xl font-semibold">
              {formatNumberWithCommas(finalPrice)}
            </p>
          </div>
          {/* <div className="flex w-full justify-center"> */}
          {product?.stockQuantity > 0 ? (
            <CartControl compact={true} product={product} />
          ) : (
            <Button className="min-w-[140px] bg-transparent p-1 text-center text-lg text-white text-white/50">
              موجود نیست{" "}
            </Button>
          )}

          {/* </div> */}
        </div>
      </div>
    </LinkWithLoader>
  );
};

export default ProductCard;
