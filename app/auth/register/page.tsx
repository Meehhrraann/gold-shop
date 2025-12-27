import CardWrapper from "@/components/authentication/CardWrapper";
import RegisterForm from "@/components/authentication/RegisterForm";
import React from "react";

const Page = () => {
  return (
    <div className="min-h-screen w-full bg-[url('/authImage.png')] bg-cover">
      {/* This is the new overlay div */}
      <div className="flex min-h-screen w-full items-center justify-center bg-black/50 backdrop-blur-sm">
        <CardWrapper>
          <RegisterForm />
        </CardWrapper>
      </div>
    </div>
  );
};

export default Page;
