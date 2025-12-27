import CardWrapper from "@/components/authentication/CardWrapper";
import LoginForm from "@/components/authentication/LoginForm";
import Link from "next/link";
import React from "react";

const Page = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[url('/authImage.png')] bg-cover">
      {/* This is the new overlay div */}
      <div className="flex min-h-screen w-full items-center justify-center bg-black/50 backdrop-blur-sm">
        <CardWrapper goToLogin>
          <LoginForm />
        </CardWrapper>
      </div>
    </div>
  );
};

export default Page;
