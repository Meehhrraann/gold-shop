"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { NewPasswordSchema } from "@/validation";
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
import {
  forgetPasswordChange,
  forgetPasswordSendEmail,
} from "@/lib/actions/auth/forgetPassword.action";
import { KeyIcon } from "lucide-react";

const NewPasswordForm = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(
    "",
  );
  const [successMessage, setSuccessMessage] = React.useState<
    string | undefined
  >("");

  const searchParams = useSearchParams();
  const paramToken = searchParams.get("token");

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof NewPasswordSchema>) {
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);
    try {
      const result = await forgetPasswordChange({
        values,
        token: paramToken,
      });

      if (result?.success) setSuccessMessage(result.success);
      if (result?.error) setErrorMessage(result.error);
    } catch (error: any) {
      setErrorMessage("somthing went wrong with forgetting password");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-y-3 rounded-lg bg-slate-50/20 p-10 text-gray-300 md:w-[350px]">
      <p className="flex gap-2 text-2xl font-semibold">
        <KeyIcon className="size-7 font-bold text-amber-500" />
        فراموشی رمز عبور
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4 rounded-md border-t-4 border-sky-600 pt-5"
        >
          {/* field 1 */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem dir="rtl" className="text-left">
                <FormLabel className="font-semibold">رمز جدید :</FormLabel>
                <FormControl>
                  <Input
                    className="border-none bg-white/70 text-black"
                    placeholder="******"
                    {...field}
                    type="password"
                  />
                </FormControl>

                <FormMessage
                  dir="rtl"
                  className="text-right text-wrap text-red-600"
                />
              </FormItem>
            )}
          />

          {/* display alert */}
          {successMessage && (
            <div
              dir="rtl"
              className="flex w-full items-center justify-start gap-2 rounded-lg bg-emerald-200 p-1 text-start text-sm text-emerald-600"
            >
              <FaCheckCircle size={18} />
              <p>{successMessage}</p>
            </div>
          )}

          {errorMessage && (
            <div
              dir="rtl"
              className="flex w-full items-center justify-start gap-2 rounded-lg bg-red-200 p-1 text-start text-sm text-red-600"
            >
              <FaExclamationCircle size={18} />
              <p>{errorMessage!}</p>
            </div>
          )}

          <Button
            disabled={!!isSubmitting}
            className={"flex w-full bg-sky-600 text-white"}
            type="submit"
          >
            تغییر رمز
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default NewPasswordForm;
