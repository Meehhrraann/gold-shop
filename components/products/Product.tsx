"use client";
// imports
import React, { useEffect } from "react";
import { CarouselProduct } from "../carousal/CarouselProduct";
import FiveStarRating from "../FiveStarRating";
import {
  FaBookmark,
  FaHeart,
  FaRegBookmark,
  FaRegCommentDots,
  FaRegEdit,
  FaRegHeart,
  FaSpinner,
} from "react-icons/fa";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import Comment from "./Comment";
import { formatNumberWithCommas } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  getComments,
  handleProductLike,
  handleProductSave,
} from "@/lib/actions/product.action";
import { toast } from "sonner";
import AddComment from "./AddComment";
import { useCurrentRole } from "@/hooks/use-current-role";

import CartControl from "../cart/CartControl";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

const Product = ({ product }) => {
  const currentUser = useCurrentUser();
  const currentRole = useCurrentRole();

  const [comments, setComments] = React.useState([]);
  const [totalCounts, setTotalCounts] = React.useState(0);
  const [isLike, setIsLike] = React.useState(false);
  const [isSave, setIsSave] = React.useState(false);
  const [error, setError] = React.useState("");
  const [cmLoading, setCmLoading] = React.useState(false);

  const { cartItems } = useCart();
  const isInCart = cartItems?.find((item) => item.product._id === product._id);
  console.log("cart", cartItems);
  console.log("product", product);

  const handleLike = async () => {
    if (!currentUser?.id) {
      toast.success("لطفا ابتدا وارد شوید");
      return;
    }
    const res = await handleProductLike({
      productId: product._id,
      userId: currentUser?.id,
    });
    console.log("likeeeeeee", res);
    if (res?.error) {
      setError(res.error);
    } else {
      setIsLike(res?.liked);
      if (res?.liked) {
        toast.success("محصول به لیست علاقه مندی های شما اضافه شد.");
      } else toast.success("محصول از لیست علاقه مندی های شما حذف شد.");
    }
  };

  const handleSave = async () => {
    if (!currentUser?.id) {
      toast.success("لطفا ابتدا وارد شوید");
      return;
    }
    const res = await handleProductSave({
      productId: product._id,
      userId: currentUser?.id,
    });
    console.log("res", res);
    if (res?.error) {
      setError(res.error);
    } else {
      setIsSave(res?.saved);
      if (res?.saved) {
        toast.success("محصول ذخیره شد.");
      } else toast.success("محصول از لیست ذخیره شده‌ها حذف شد.");
    }
  };

  const fetchComments = async () => {
    setCmLoading(true);
    const res = await getComments({ productId: product._id });
    if (res?.comments) {
      setComments(res.comments);
      setTotalCounts(res.totalCounts);
      setCmLoading(false);
    } else {
      setError(res?.error);
      setCmLoading(false);
    }
  };
  useEffect(() => {
    if (product?.likes?.includes(currentUser?.id)) {
      setIsLike(true);
    }
    if (product?.saved?.includes(currentUser?.id)) {
      setIsSave(true);
    }

    fetchComments();
  }, []);

  // color dictionary
  const colorTranslate = {
    Yellow: "زرد",
    White: "سفید",
    Rose: "رُز گلد (صورتی)",
    Mixed: "ترکیبی",
  };

  // render
  return (
    <div className="flex flex-col items-center gap-20 px-10 text-gray-300">
      {/* <div className="container mx-auto mt-20 flex w-full flex-col items-center justify-center gap-5 lg:flex-row lg:items-start"> */}
      <div className="flex w-full flex-col items-center justify-center gap-10 lg:flex-row lg:items-start lg:p-20">
        {/* left */}
        <div className="flex h-fit w-full justify-center">
          <CarouselProduct
            items={product?.media} // if we need 3 => {items.slice(0, 3)}
            aspectRatio="1:1" // =>  4:3 1:1 3:4
            maxWidth="500px" // *optional* => size of carousal component
            basisClassName="basis-full" // basis-2/3 = half-full-half ***  basis-1/3 = full-full-full ***  basis-full = full
            align="center" // start center end
            loop={false}
            autoplay={false}
            showDots={true}
            showArrows={true}
            showThumbnails={true}
            className="max-w-sm md:max-w-md lg:max-w-2xl" // *optional*
          />
        </div>
        {/* right */}
        <div className="bg-foreground flex-y-1 flex h-fit w-full max-w-lg flex-col gap-10 rounded-xl p-10">
          {/* title + rating */}
          <div className="flex w-full flex-col justify-center gap-5">
            <div className="flex flex-row-reverse justify-between gap-5">
              <h1 dir="rtl" className="text-primary truncate text-2xl">
                {product?.name}
              </h1>
              <div className="flex items-center gap-2">
                {isLike ? (
                  <FaHeart
                    onClick={handleLike}
                    className="size-6 cursor-pointer text-red-500"
                  />
                ) : (
                  <FaRegHeart
                    onClick={handleLike}
                    className="text-primary size-6 cursor-pointer"
                  />
                )}
                {isSave ? (
                  <FaBookmark
                    onClick={handleSave}
                    className="size-6 cursor-pointer text-violet-500"
                  />
                ) : (
                  <FaRegBookmark
                    onClick={handleSave}
                    className="text-primary size-6 cursor-pointer"
                  />
                )}
                {currentRole === "ADMIN" && (
                  <Link href={`/admin/updateProduct/${product?._id}`}>
                    <FaRegEdit className="text-primary size-6 cursor-pointer" />
                  </Link>
                )}
              </div>
            </div>
            <p dir="rtl" className="-mt-3 text-xs text-gray-500">
              کد محصول: {product?.sku}
            </p>
            {/* rating */}
            <div className="text-primary flex items-end justify-end gap-1">
              <FiveStarRating rating={3.5} />
              <p className="translate-y-0.5 text-xs text-gray-500">(3.5)</p>
              <p dir="rtl" className="translate-y-0.5 text-xs text-gray-500">
                <span>23</span>
                نفر
              </p>
            </div>
          </div>
          {/* desc + tags */}
          <div dir="rtl" className="flex w-full flex-col gap-2">
            <p className="text-justify leading-7">{product?.description}</p>
            <div className="flex flex-wrap gap-1">
              {product.tags.map((tag, index) => (
                <div
                  className="bg-primary text-foreground rounded-full px-1 text-xs"
                  key={index}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
          {/* category */}
          <div className="flex flex-col gap-2 text-sm">
            <div dir="rtl" className="flex items-center gap-1 text-sm">
              <p className="text-primary">دسته بندی:</p>
              <p>{product?.category?.name}</p>
            </div>
            {/* gold details */}
            {product?.goldDetails && (
              <div className="flex flex-col gap-2">
                <div dir="rtl" className="flex gap-1">
                  <p className="text-primary">عیار:</p>
                  <p>{product?.goldDetails.karat}</p>
                </div>
                <div dir="rtl" className="flex gap-1">
                  <p className="text-primary">وزن طلا:</p>
                  <p>{product?.goldDetails.weightGrams} گرم</p>
                </div>
                <div dir="rtl" className="flex gap-1">
                  <p className="text-primary">رنگ طلا:</p>

                  <p>{colorTranslate[product?.goldDetails.color]}</p>
                </div>
              </div>
            )}
            {/* stones */}
            {product?.stones?.length > 0 &&
              product.stones.map((stone, index) => (
                <div
                  key={index}
                  dir="rtl"
                  className="flex flex-col gap-2 text-sm"
                >
                  <div className="flex gap-1">
                    <p className="text-primary"> نوع سنگ:</p>
                    <div className="flex flex-col">
                      <p>{stone.type}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <p className="text-primary"> وزن سنگ:</p>
                    <div className="flex flex-col">
                      <p>{stone.caratWeight} قیرات</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          {/* price */}
          <h1
            dir="rtl"
            className="text-primary flex w-full justify-between gap-2 text-2xl"
          >
            <div className="flex items-center gap-1">
              <FaMoneyBill1Wave className="size-5 text-green-400" />
              <p>قیمت:</p>
            </div>
            <div className="flex gap-1">
              <p className="bg-primary text-foreground ml-1 h-fit w-fit translate-y-2 rounded-full px-1 text-xs">
                هزار تومان
              </p>
              <span className="text-gray-300">
                {formatNumberWithCommas(product.price)}
              </span>
            </div>
          </h1>
          {/* add to card */}
          {/* <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <FiPlusCircle className="text-primary size-8" />
              <p className="text-lg text-gray-300">3</p>
              <FiMinusCircle className="text-primary size-8" />
            </div>
            <div
              dir="rtl"
              className="text-primary flex items-center gap-1 text-2xl"
            >
              <BsCart4 className="size-5 text-gray-400" />
              <p>افزودن به سبدخرید:</p>
            </div>
          </div> */}
          <div className="flex w-full items-center justify-center gap-5 self-center">
            {isInCart && (
              <Link
                className="bg-primary text-foreground rounded-md p-2 whitespace-nowrap"
                href="/cart"
              >
                رفتن به سبد خرید
              </Link>
            )}

            <CartControl product={product} />
          </div>
        </div>
      </div>

      {/* comments */}
      <div className="mx-auto w-full gap-2 px-10 md:max-w-3/4">
        <div className="flex w-full flex-col items-end gap-5">
          <p className="text-primary text-xl font-semibold">
            دیدگاه کاربران ({totalCounts})
          </p>
          <AddComment
            onFetchCM={fetchComments}
            productId={product._id}
            senderId={currentUser?.id}
            btnTitle={
              <>
                <FaRegCommentDots className="text-primary flex size-5 self-center" />
                افزودن نظر
              </>
            }
          />
          {cmLoading && (
            <FaSpinner className="text-primary flex size-8 animate-spin self-center" />
          )}
          {comments?.map((comment) => (
            <div className="w-full" key={comment?._id}>
              <Comment
                onFetchCM={fetchComments}
                senderId={currentUser?.id}
                comment={comment}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Product;
