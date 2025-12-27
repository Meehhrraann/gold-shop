"use client";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { ImGithub } from "react-icons/im";

const Socials = ({ isSubmmiting, setIsSubmmiting }) => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  // const [isSubmmiting, setIsSubmmiting] = useState(false);

  const loginHandler = async (provider: "google" | "github") => {
    try {
      setIsSubmmiting(true);
      await signIn(provider, {
        callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
      });
    } catch (error) {}
  };

  return (
    <div className="flex w-full justify-between gap-3">
      <button
        onClick={() => loginHandler("github")}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-white/20 p-1 drop-shadow-md disabled:opacity-50"
        disabled={!!isSubmmiting}
      >
        <ImGithub className="size-6 rounded-full bg-black text-white" />
      </button>
      <button
        onClick={() => loginHandler("google")}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-white/20 p-1 drop-shadow-md disabled:opacity-50"
        disabled={!!isSubmmiting}
      >
        <FcGoogle className="size-6" />
      </button>
    </div>
  );
};

export default Socials;
