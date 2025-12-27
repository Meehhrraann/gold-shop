"use client";
import React, { useEffect, useState } from "react";
import { newVerification } from "@/lib/actions/auth/newVerification.action";
import { useRouter, useSearchParams } from "next/navigation";
import { BeatLoader, PuffLoader } from "react-spinners";

const VerificationCard = () => {
  const searchParams = useSearchParams();
  const paramToken = searchParams.get("token");
  // const [status, setStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const verifyToken = async (token) => {
      const res = await newVerification({ token });
      if (res.success) setSuccessMessage(res.success);
      if (res.error) setErrorMessage(res.error);
      // setStatus(res.success || res.error);
      console.log(res);
    };
    verifyToken(paramToken);
  }, []);

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    }
  }, [successMessage]);

  return (
    <div className="rounded-lg bg-white p-5">
      <p className="text-3xl">verification status:</p>
      {successMessage || errorMessage ? (
        <p
          className={`mt-5 rounded-lg py-3 ${
            successMessage
              ? "bg-green-200 text-green-900"
              : "bg-red-200 text-red-800"
          } `}
        >
          {successMessage || errorMessage}
        </p>
      ) : (
        <div className="mt-5 flex justify-center text-red-800">
          <PuffLoader color="#87CEEB" />
        </div>
      )}
    </div>
  );
};

export default VerificationCard;
