import CardWrapper from "@/components/authentication/CardWrapper";
import LoginForm from "@/components/authentication/LoginForm";
import Link from "next/link";
import React from "react";

const Page = ({ children }) => {
  return (
    <div className="mx-auto flex w-full justify-center">
      {/* This is the new overlay div */}
      <CardWrapper goToLogin>
        <LoginForm />
      </CardWrapper>
    </div>
  );
};

export default Page;
