"use client";
import React from "react";
import Image from "next/image";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { handleProductLike } from "@/lib/actions/product.action";
import { toast } from "sonner";

// Helper to format currency and convert to Persian digits
const formatPersianPrice = (price) => {
  return new Intl.NumberFormat("fa-IR").format(price);
};

const LikedProducts = ({ products = [] }) => {
  const [likedProducts, setLikedProducts] = React.useState(products);

  const currentUser = useCurrentUser();

  const handleDeleteProduct = async (id) => {
    const res = await handleProductLike({
      productId: id,
      userId: currentUser?.id,
    });
    if (!res?.liked) {
      setLikedProducts(likedProducts.filter((product) => product._id !== id));
      toast.success("محصول از لیست علاقه مندی های شما حذف شد.");
    }
  };

  if (likedProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-white/50">
        <Heart size={48} className="mb-4 opacity-20" />
        <p className="font-medium">لیست علاقه‌مندی‌های شما خالی است</p>
      </div>
    );
  }

  return (
    <section className="bg-background text-foreground p-6" dir="rtl">
      {/* Header Info */}
      <div className="border-primary/20 mb-8 flex items-center justify-between border-b pb-4">
        <h2 className="text-primary text-xl font-bold">محصولات مورد علاقه</h2>
        <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm">
          {formatPersianPrice(likedProducts.length)} کالا
        </span>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {likedProducts.map((product) => {
          const discountPrice = product.price * (1 - product.discount / 100);

          return (
            <div
              key={product._id}
              className="group hover:border-primary/50 relative overflow-hidden rounded-2xl border border-white/5 bg-[#2a2a2a] shadow-xl transition-all duration-300"
            >
              {/* Image Section */}
              <div className="relative aspect-square overflow-hidden bg-[#333]">
                <Image
                  src={product.media[0]?.url}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Discount Badge */}
                {product.discount > 0 && (
                  <div className="absolute top-3 right-3 z-10 rounded-lg bg-red-500 px-2 py-1 text-xs font-bold text-white">
                    {formatPersianPrice(product.discount)}٪
                  </div>
                )}
                {/* Remove Button */}
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  className="absolute top-3 left-3 rounded-full bg-black/40 p-2 text-white/70 backdrop-blur-md transition-colors hover:text-red-400"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Content Section */}
              <div className="p-4">
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="flex-1 truncate text-lg font-medium text-white">
                    {product.name}
                  </h3>
                </div>

                {/* Technical Specs Mini-Row */}
                <div className="mb-4 flex gap-3 text-[10px] tracking-widest text-white/40 uppercase">
                  <span>
                    طلای {formatPersianPrice(product.goldDetails.karat)} عیار
                  </span>
                  <span>•</span>
                  <span>
                    {formatPersianPrice(product.goldDetails.weightGrams)} گرم
                  </span>
                </div>

                {/* Price Section */}
                <div className="mb-4 flex flex-col items-end">
                  {/* The container will always have the height of this span */}
                  <div
                    className={`mb-1 flex gap-1 text-xs line-through transition-opacity ${
                      product.discount > 0 ? "text-white/30" : "invisible"
                    }`}
                  >
                    <p>تومان</p>
                    <p>{formatPersianPrice(product.price)}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-primary/70 text-xs">تومان</span>
                    <span className="text-primary text-xl font-bold">
                      {formatPersianPrice(discountPrice)}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                {product?.stockQuantity > 0 ? (
                  <button className="bg-primary hover:bg-primary/80 text-background flex w-full items-center justify-center gap-2 rounded-xl py-3 font-bold transition-colors">
                    <ShoppingBag size={18} />
                    <span className="text-sm font-medium">
                      افزودن به سبد خرید
                    </span>
                  </button>
                ) : (
                  <p className="py-3 text-center text-lg text-white/50">
                    محصول ناموجود
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default LikedProducts;
