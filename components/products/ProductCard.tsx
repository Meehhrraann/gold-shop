// "use client";
// import { formatNumberWithCommas } from "@/lib/utils";
// import { Dot, Heart, Trash2 } from "lucide-react";
// import Image from "next/image";
// import React, { useState } from "react";
// import CartControl from "../cart/CartControl";
// import { usePathname } from "next/navigation";
// import { useCurrentUser } from "@/hooks/use-current-user";
// import { handleProductLike } from "@/lib/actions/product.action";
// import { toast } from "sonner";
// import { Button } from "../ui/button";
// import Link from "next/link";

// const ProductCard = ({ product, setProducts }) => {
//   const currentUser = useCurrentUser();
//   const pathname = usePathname();
//   const finalPrice = product.price - product.price * (product.discount / 100);
//   const isLiked = product?.likes?.includes(currentUser?.id);
//   const [like, setLike] = useState(isLiked);

//   const likeHandler = async (e) => {
//     // These stop the Link from triggering and the TopLoader from seeing the click
//     e.preventDefault();
//     e.stopPropagation();

//     const res = await handleProductLike({
//       productId: product._id,
//       userId: currentUser?.id,
//     });

//     if (res?.liked) {
//       setLike(true);
//       toast.success("لایک شد");
//     } else {
//       setLike(false);
//       if (setProducts) {
//         setProducts((prev) => prev.filter((item) => item._id !== product._id));
//       }
//       toast.success("محصول از لیست علاقه مندی های شما حذف شد.");
//     }
//   };

//   return (
//     <div className="group hover:border-primary/50 relative w-full overflow-hidden rounded-lg border border-white/10 bg-[#2a2a2a] hover:border">
//       {/* 1. THE HIDDEN LINK OVERLAY */}
//       {/* This covers the whole card but sits BEHIND the buttons (z-0) */}
//       <Link
//         href={`/products/${product._id}-${product.displaySlug}`}
//         target="_blank" // This opens the new tab
//         rel="noopener noreferrer" // Security best practice for target="_blank"
//         className="absolute inset-0 z-0"
//       />

//       {/* 2. CARD CONTENT */}
//       {/* We use z-10 and relative to keep interactive elements above the Link */}
//       <div className="pointer-events-none relative z-10 flex h-full flex-col">
//         {/* Image Section */}
//         <div className="bg-foreground relative aspect-square overflow-hidden">
//           <Image
//             src={product.media[0]?.url || "/no-image.jpg"}
//             alt={product.name}
//             fill
//             className="object-cover transition-transform duration-500 group-hover:scale-110"
//           />

//           {/* Action Buttons (Top) */}
//           <div className="absolute top-0 flex w-full items-center justify-between px-2 pt-2">
//             <div
//               onClick={(e) => likeHandler(e)}
//               className="pointer-events-auto aspect-square cursor-pointer rounded-full bg-black/50 p-2 transition-colors hover:bg-black/80"
//             >
//               {currentUser?.id && pathname === "/products" ? (
//                 <Heart
//                   fill={`${like ? "red" : "none"}`}
//                   className={`size-4 ${like ? "text-red-500" : "text-primary"}`}
//                 />
//               ) : (
//                 <Trash2 className="size-4 text-gray-200 hover:text-red-400" />
//               )}
//             </div>

//             <div
//               className={`flex h-fit items-center justify-center rounded-lg bg-red-500 px-2 py-1 text-xs text-gray-300 ${product.discount === 0 ? "invisible" : ""}`}
//             >
//               {product.discount}٪
//             </div>
//           </div>
//         </div>

//         {/* Text & Price Section */}
//         <div dir="rtl" className="flex flex-col gap-2 px-3 py-2 text-white">
//           <p className="truncate text-lg">{product.name}</p>

//           <div className="flex items-center text-[10px] tracking-widest text-white/40">
//             <p>طلای {product.goldDetails.karat} عیار</p>
//             <Dot />
//             <p> {product.goldDetails.weightGrams} گرم</p>
//           </div>

//           <div
//             className={`flex w-full items-center justify-end gap-1 text-left text-xs text-white/40 ${product.discount > 0 ? "" : "invisible"}`}
//           >
//             <p>تومان</p>
//             <p className="line-through">
//               {formatNumberWithCommas(product.price)}
//             </p>
//           </div>

//           <div className="text-primary flex w-full items-center justify-end gap-1 text-left">
//             <p className="text-primary/60">تومان</p>
//             <p className="text-xl font-semibold">
//               {formatNumberWithCommas(finalPrice)}
//             </p>
//           </div>

//           {/* Cart Control Section */}
//           <div className="pointer-events-auto mx-auto mt-2">
//             {product?.stockQuantity > 0 ? (
//               <CartControl compact={true} product={product} />
//             ) : (
//               <Button className="w-full cursor-default bg-transparent p-1 text-center text-lg text-white/50">
//                 موجود نیست
//               </Button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;

"use client";

import { formatNumberWithCommas } from "@/lib/utils";
import { Dot, Heart, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import CartControl from "../cart/CartControl";
import { usePathname } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import { handleProductLike } from "@/lib/actions/product.action";
import { toast } from "sonner";
import { Button } from "../ui/button";
import Link from "next/link";

const ProductCard = ({ product, setProducts }) => {
  const currentUser = useCurrentUser();
  const pathname = usePathname();

  // --- IMAGE HANDLING LOGIC ---
  // Initialize with product image or fallback immediately if missing
  const [imageSrc, setImageSrc] = useState(
    product.media[0]?.url || "/no-image.jpg",
  );

  // If the image fails to load (network error, 404, etc.), switch to fallback
  const handleImageError = () => {
    setImageSrc("/no-image.jpg");
  };
  // ----------------------------

  const finalPrice = product.price - product.price * (product.discount / 100);
  const isLiked = product?.likes?.includes(currentUser?.id);
  const [like, setLike] = useState(isLiked);

  const likeHandler = async (e) => {
    // These stop the Link from triggering and the TopLoader from seeing the click
    e.preventDefault();
    e.stopPropagation();

    const res = await handleProductLike({
      productId: product._id,
      userId: currentUser?.id,
    });

    if (res?.liked) {
      setLike(true);
      toast.success("لایک شد");
    } else {
      setLike(false);
      if (setProducts) {
        setProducts((prev) => prev.filter((item) => item._id !== product._id));
      }
      toast.success("محصول از لیست علاقه مندی های شما حذف شد.");
    }
  };

  return (
    <div className="group hover:border-primary/50 relative w-full overflow-hidden rounded-lg border border-white/10 bg-[#2a2a2a] hover:border">
      {/* 1. THE HIDDEN LINK OVERLAY */}
      {/* This covers the whole card but sits BEHIND the buttons (z-0) */}
      <Link
        href={`/products/${product._id}-${product.displaySlug}`}
        target="_blank" // This opens the new tab
        rel="noopener noreferrer" // Security best practice for target="_blank"
        className="absolute inset-0 z-0"
      />

      {/* 2. CARD CONTENT */}
      {/* We use z-10 and relative to keep interactive elements above the Link */}
      <div className="pointer-events-none relative z-10 flex h-full flex-col">
        {/* Image Section */}
        <div className="bg-foreground relative aspect-square overflow-hidden">
          <Image
            src={imageSrc} // Use state instead of direct prop
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={handleImageError} // Trigger fallback on error
          />

          {/* Action Buttons (Top) */}
          <div className="absolute top-0 flex w-full items-center justify-between px-2 pt-2">
            <div
              onClick={(e) => likeHandler(e)}
              className="pointer-events-auto aspect-square cursor-pointer rounded-full bg-black/50 p-2 transition-colors hover:bg-black/80"
            >
              {currentUser?.id && pathname === "/products" ? (
                <Heart
                  fill={`${like ? "red" : "none"}`}
                  className={`size-4 ${like ? "text-red-500" : "text-primary"}`}
                />
              ) : (
                <Trash2 className="size-4 text-gray-200 hover:text-red-400" />
              )}
            </div>
            <div
              className={`flex h-fit items-center justify-center rounded-lg bg-red-500 px-2 py-1 text-xs text-gray-300 ${
                product.discount === 0 ? "invisible" : ""
              }`}
            >
              {product.discount}٪
            </div>
          </div>
        </div>

        {/* Text & Price Section */}
        <div dir="rtl" className="flex flex-col gap-2 px-3 py-2 text-white">
          <p className="truncate text-lg">{product.name}</p>
          <div className="flex items-center text-[10px] tracking-widest text-white/40">
            <p>طلای {product.goldDetails.karat} عیار</p>
            <Dot />
            <p> {product.goldDetails.weightGrams} گرم</p>
          </div>
          <div
            className={`flex w-full items-center justify-end gap-1 text-left text-xs text-white/40 ${
              product.discount > 0 ? "" : "invisible"
            }`}
          >
            <p>تومان</p>
            <p className="line-through">
              {formatNumberWithCommas(product.price)}
            </p>
          </div>
          <div className="text-primary flex w-full items-center justify-end gap-1 text-left">
            <p className="text-primary/60">تومان</p>
            <p className="text-xl font-semibold">
              {formatNumberWithCommas(finalPrice)}
            </p>
          </div>

          {/* Cart Control Section */}
          <div className="pointer-events-auto mx-auto mt-2">
            {product?.stockQuantity > 0 ? (
              <CartControl compact={true} product={product} />
            ) : (
              <Button className="w-full cursor-default bg-transparent p-1 text-center text-lg text-white/50">
                موجود نیست
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
