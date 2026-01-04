"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { LoginSchema } from "@/validation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginAction } from "@/lib/actions/auth/login.action";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import Link from "next/link";
import Socials from "./Socials";
import { useSearchParams } from "next/navigation";
import TwoFAConfirmation from "@/models/twoFAConfirmation";
import { generateTwoFACode } from "@/lib/tokens";

const LoginForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/settings"; // Default to settings
  const urlError = searchParams.get("error");

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isTwoFA, setIsTwoFA] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(
    "",
  );
  const [successMessage, setSuccessMessage] = React.useState<
    string | undefined
  >("");

  React.useEffect(() => {
    if (urlError === "OAuthAccountNotLinked") {
      setErrorMessage(
        "این ایمیل قبلا با حساب دیگری نظیر google | github استفاده شده است",
      );
    }
  }, [urlError]);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      // 1. Call Server Action
      const result = await loginAction({ values, callbackUrl });

      // 2. Handle 2FA (Do not redirect yet)
      if (result?.isTwoFA) {
        setIsTwoFA(true);
        return; // Stop here, let user enter code
      }

      // 3. Handle Explicit Success (If your action returns success instead of throwing)
      if (result?.success) {
        setSuccessMessage(result.success);
        // ⚡ FIX: Force Hard Reload to clear cache
        window.location.href = callbackUrl;
        return;
      }

      // 4. Handle Explicit Errors
      if (result?.error) {
        setErrorMessage(result.error);
        setIsSubmitting(false); // Only stop loading on error
      }
    } catch (error: any) {
      // 5. ⚡ INTERCEPT THE REDIRECT
      // Server Actions throw "NEXT_REDIRECT" when they try to navigate.
      // We catch this and force a hard window reload instead of a soft router push.
      if (error.message === "NEXT_REDIRECT") {
        window.location.href = callbackUrl;
        return;
      }

      setErrorMessage(error.message || "مشکلی رخ داد. دوباره تلاش کنید");
      setIsSubmitting(false);
    }
    // Do NOT put setIsSubmitting(false) in finally block,
    // because if we redirect, we want the button to stay disabled (loading state).
  }

  const resendNewCode = async (email: any) => {
    // Note: Calling Mongoose models (TwoFAConfirmation) directly in Client Component is NOT allowed.
    // You should move this logic to a Server Action.
    console.log("Resend code logic should be a server action");
  };

  return (
    <div className="mt-5 flex w-full flex-col gap-3 text-[#e8ca89]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8 rounded-md border-t-4 border-[#d6a232] pt-5"
        >
          {!isTwoFA && (
            <>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex flex-col text-right">
                    <FormLabel className="self-end font-semibold">
                      آدرس ایمیل
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="border border-[#e8ca89] text-gray-200"
                        placeholder="example@email.com"
                        {...field}
                        type="email"
                      />
                    </FormControl>
                    <FormMessage className="text-wrap text-red-600" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="flex flex-col text-right">
                    <FormLabel className="self-end font-semibold">
                      رمز عبور :
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="border border-[#e8ca89] text-gray-200"
                        placeholder="*****"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage className="text-wrap text-red-600" />
                    <FormDescription>
                      <Link className="" href={"/auth/reset"}>
                        فراموشی رمز عبور
                      </Link>
                    </FormDescription>
                  </FormItem>
                )}
              />
            </>
          )}

          {isTwoFA && (
            <>
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormLabel className="font-semibold">کد ورود :</FormLabel>
                    <FormControl>
                      <Input
                        className="text-black"
                        placeholder="123456"
                        {...field}
                        type="string"
                      />
                    </FormControl>
                    <FormMessage className="text-wrap text-red-600" />
                    <FormDescription>
                      <button
                        type="button" // Add type button
                        onClick={() => resendNewCode(form.getValues("email"))}
                        className="text-gray-400"
                      >
                        ارسال مجدد کد
                      </button>
                    </FormDescription>
                  </FormItem>
                )}
              />
            </>
          )}

          {/* display alert */}
          {successMessage && (
            <div className="flex w-full items-center justify-start gap-2 rounded-lg bg-emerald-200 p-1 text-start text-sm text-emerald-600">
              <FaCheckCircle size={18} />
              <p>{successMessage}</p>
            </div>
          )}
          {errorMessage && (
            <div className="flex w-full items-center justify-start gap-2 rounded-lg bg-red-200 p-1 text-start text-sm text-red-600">
              <FaExclamationCircle size={18} />
              <p dir="rtl">{errorMessage!}</p>
            </div>
          )}

          <Button
            disabled={!!isSubmitting}
            className={
              "flex w-full bg-gradient-to-br from-[#A57C00] via-[#e8ca89] to-amber-300 text-gray-900"
            }
            type="submit"
          >
            {isSubmitting ? "لطفا صبر کنید..." : "ورود"}
          </Button>
        </form>
      </Form>
      <Socials isSubmmiting={isSubmitting} setIsSubmmiting={setIsSubmitting} />
    </div>
  );
};

export default LoginForm;
