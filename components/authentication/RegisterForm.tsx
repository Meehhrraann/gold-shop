"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { RegisterSchema } from "@/validation";
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
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { registerAction } from "@/lib/actions/auth/register.action";
// import { useRouter } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

const RegisterForm = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(
    "",
  );
  const [successMessage, setSuccessMessage] = React.useState<
    string | undefined
  >("");
  const router = useRouter(); // 2. Initialize router

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof RegisterSchema>) {
    setIsSubmitting(true);
    setErrorMessage(""); // Clear previous errors
    setSuccessMessage(""); // Clear previous success

    try {
      const result = await registerAction(values);

      if (result?.error) {
        setErrorMessage(result.error);
      } else {
        setSuccessMessage("ثبت‌نام با موفقیت انجام شد...");
        router.push("/auth/login"); // Ensure this matches your login route path
      }
    } catch (error: any) {
      setErrorMessage("خطایی رخ داده است. لطفا دوباره تلاش کنید.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-5 flex w-full flex-col gap-3 text-[#e8ca89]">
      <Form {...form}>
        <form
          method="POST"
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8 rounded-md border-t-4 border-[#d6a232] pt-5"
        >
          {/* field 1 */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col text-right">
                <FormLabel className="self-end font-semibold">نام :</FormLabel>
                <FormControl>
                  <Input
                    className="border border-[#e8ca89] text-right text-gray-200"
                    placeholder="نام خود را وارد کنید"
                    {...field}
                    type="text"
                  />
                </FormControl>

                <FormMessage className="text-wrap text-red-600" />
              </FormItem>
            )}
          />
          {/* field 1 */}
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
              </FormItem>
            )}
          />

          {successMessage && (
            <div
              dir="rtl"
              className="flex w-full items-center justify-start gap-1 rounded-lg bg-emerald-200 pl-3 text-emerald-600"
            >
              <FaCheckCircle size={18} />
              <p>{successMessage}</p>
            </div>
          )}
          {errorMessage && (
            <div
              dir="rtl"
              className="flex w-full items-center justify-start gap-1 rounded-lg bg-red-200 pl-3 text-red-600"
            >
              <FaExclamationCircle size={18} />
              <p>{errorMessage}</p>
            </div>
          )}

          <Button
            disabled={!!isSubmitting}
            className={
              "flex w-full bg-gradient-to-br from-[#A57C00] via-[#e8ca89] to-amber-300 text-gray-900"
            }
            type="submit"
          >
            {isSubmitting ? "لطفا صبر کنید..." : "ایجاد حساب"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm;
