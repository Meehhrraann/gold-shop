import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { FaHeart } from "react-icons/fa";
import { BiDislike, BiLike } from "react-icons/bi";
import { LuReplyAll } from "react-icons/lu";

import { formatJalaaliDate } from "@/lib/utils";
import AddComment from "./AddComment";
import { IoTrashOutline } from "react-icons/io5";
import { toast } from "sonner";
import { deleteComment, voteComment } from "@/lib/actions/product.action";
import { useCurrentRole } from "@/hooks/use-current-role";

const Comment = ({ comment, senderId, onFetchCM }) => {
  console.log("comment", comment);
  const currentRole = useCurrentRole();

  const [upVotes, setUpVotes] = React.useState(comment?.upvotes?.length);
  const [downVotes, setDownVotes] = React.useState(comment?.downvotes?.length);

  const HandleDeleteCM = async () => {
    const res = await deleteComment({ commentId: comment._id });
    if (res?.success) {
      toast.success("نظر شما با موفقیت حذف شد.");
      onFetchCM();
    }
  };

  const handleVotes = async (type) => {
    const res = await voteComment({
      commentId: comment._id,
      userId: senderId,
      type,
    });
    console.log("res", res);
    if (res?.upVotes || res?.downVotes) {
      setUpVotes(res?.upVotes?.length);
      setDownVotes(res?.downVotes?.length);
      toast.success("نظر شما با موفقیت ثبت شد.");
    } else {
      console.log("im here", res);
      toast.error(res?.error);
    }
  };

  return (
    <div
      dir="rtl"
      className="bg-foreground relative flex w-full flex-col gap-3 rounded-xl p-10"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="size-10 bg-white/20">
            {/* The main image */}
            <AvatarImage src={comment?.author?.image} alt="@shadcn" />

            {/* Shown if image fails or is loading */}
            <AvatarFallback>
              {
                comment?.author?.name
                  ? comment.author.name.charAt(0).toUpperCase()
                  : "ن" // Short for ناشناس
              }
            </AvatarFallback>
          </Avatar>

          <p>{comment?.author?.name || "ناشناس"}</p>
        </div>
        <p className="text-xs text-gray-400">
          {formatJalaaliDate(comment?.createdAt)}
        </p>
      </div>
      {comment?.parentComment?._id && (
        <div className="bg-background border-primary flex flex-col gap-1 rounded-md border-r-3 px-2 py-1">
          <h1
            dir="rtl"
            className="flex gap-1 truncate text-sm font-semibold text-gray-300"
          >
            <p> در پاسخ به </p>
            <p className="text-primary">{"محمد"}</p>
          </h1>
          <p className="truncate text-sm text-gray-400">
            {comment?.parentComment?.content}
          </p>
        </div>
      )}
      <p className="text-200 mt-2 text-justify text-sm leading-6">
        {comment.content}
      </p>
      <div className="flex items-center justify-between">
        <AddComment
          productId={comment.product}
          senderId={senderId}
          parentComment={comment._id}
          replies={comment.replies}
          onFetchCM={onFetchCM}
          btnTitle={
            <>
              پاسخ
              <LuReplyAll className="text-primary flex size-5 self-center" />
            </>
          }
        />

        <div className="flex justify-end gap-2">
          <div className="mt-2 flex items-center gap-1">
            <BiLike
              onClick={() => handleVotes("upvote")}
              className="size-4 cursor-pointer text-teal-500"
            />
            <p className="text-sm text-gray-300">{upVotes}</p>
          </div>
          <div className="mt-2 flex items-center gap-1">
            <BiDislike
              onClick={() => handleVotes("downvote")}
              className="size-4 cursor-pointer text-rose-500"
            />
            <p className="text-sm text-gray-300">{downVotes}</p>
          </div>
        </div>
      </div>
      {currentRole === "ADMIN" && (
        <IoTrashOutline
          onClick={() => HandleDeleteCM()}
          className="bg-background absolute top-3 left-3 size-6 cursor-pointer rounded-md p-1 text-red-500"
        />
      )}
    </div>
  );
};

export default Comment;
