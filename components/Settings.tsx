"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";

import { SettingsSchema } from "@/validation";
import { updateProfileAction } from "@/lib/actions/user.action";
import useImageUpload from "@/hooks/useImageUpload";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import DropWithCrop from "./upload/DropWithCrop";
import { inferType } from "@/lib/utils";

export const Settings = ({ user }: { user: any }) => {
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();
  const [files, setFiles] = useState<any[]>([]);
  const [uploadError, setUploadError] = useState("");
  const { handleUpload } = useImageUpload();

  const form = useForm({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      image: user?.image || "",
      role: user?.role || "USER",
      isTwoFactorEnabled: !!user?.isTwoFactorEnabled,
      password: "",
      newPassword: "",
    },
  });

  const currentImageUrl = form.watch("image");

  const onSubmit = (values: any) => {
    startTransition(async () => {
      try {
        // 1. Upload to Liara S3 if files selected
        if (files.length > 0) {
          await handleUpload(files.map((f) => f.file));
        }

        // 2. Prepare FormData
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("email", values.email);
        formData.append("role", values.role);
        formData.append(
          "isTwoFactorEnabled",
          String(values.isTwoFactorEnabled),
        );
        formData.append("image", values.image);
        formData.append("password", values.password || "");
        formData.append("newPassword", values.newPassword || "");

        // 3. Add Media Metadata
        if (files.length > 0) {
          const mediaMetadata = files.map((f) => ({
            url: `https://chat-ticket.storage.c2.liara.space/${f.file.name}`,
            filename: f.file.name,
            mimeType: f.file.type,
            type: inferType(f.file.type),
            size: f.file.size,
          }));
          formData.append("medias", JSON.stringify(mediaMetadata));
        }

        const res = await updateProfileAction({
          formDatas: formData,
          userId: user._id,
        });

        if (res.error) {
          toast.error(res.error);
        } else {
          await update({ user: res.user });
          toast.success("پروفایل به روز شد");
          setFiles([]);
          window.location.reload();
        }
      } catch (err) {
        toast.error("مشکلی پیش آمده");
      }
    });
  };

  return (
    <Card
      dir="rtl"
      className="bg-foreground text-primary mx-auto h-fit w-full max-w-2xl py-8 shadow-lg"
    >
      <CardHeader>
        <CardTitle className="text-xl">تنظیمات</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Image Management Section */}
            <div className="mx-auto w-fit space-y-4 rounded-lg bg-slate-50/50 p-4 shadow-md">
              <div className="relative flex w-fit items-center gap-x-6">
                <Avatar className="size-36 border-2 border-white shadow-sm">
                  <AvatarImage src={files[0]?.preview || currentImageUrl} />
                  <AvatarFallback className="bg-primary text-xl text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <Dialog>
                  <DialogTrigger
                    className="text-primary absolute right-1 bottom-1 cursor-pointer"
                    asChild
                  >
                    <PlusCircle className="size-8 rounded-full bg-white" />
                  </DialogTrigger>
                  <DialogContent className="focus:outline-none sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-primary pb-5 text-right">
                        عکس پروفایل
                      </DialogTitle>
                    </DialogHeader>

                    <DropWithCrop
                      files={files}
                      setFiles={setFiles}
                      onError={(err) => setUploadError(err)}
                    />

                    <DialogFooter className="gap-2 sm:justify-start">
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          انصراف
                        </Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button
                          className="bg-blue-600 text-white"
                          type="button"
                        >
                          تایید
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                    {uploadError && (
                      <p className="text-destructive mt-2 text-center text-xs">
                        {uploadError}
                      </p>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Standard Fields */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نام</FormLabel>
                    <FormControl>
                      <Input
                        className="border-primary bg-background text-gray-300"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>آدرس ایمیل</FormLabel>
                    <FormControl>
                      <Input
                        className="border-primary bg-background text-gray-300"
                        {...field}
                        disabled={isPending}
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نقش</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-primary bg-background text-gray-300">
                          <SelectValue className="text-gray-300" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background border-0 text-gray-300 ring-0 focus:outline-none">
                        <SelectItem value="ADMIN">ادمین</SelectItem>
                        <SelectItem value="USER">کاربر عادی</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isTwoFactorEnabled"
                render={({ field }) => (
                  <FormItem
                    /* Corrected "lrt" to "ltr" and forced flex direction */
                    className="bg-background flex flex-row-reverse items-center justify-between rounded-lg border p-3 shadow-sm"
                    dir="ltr"
                  >
                    <FormLabel className="m-0 cursor-pointer">
                      فعالسازی ورود دو مرحله‌ای
                    </FormLabel>
                    <FormControl>
                      <Switch
                        className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-300"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Password Section */}
            <div className="bg-background space-y-4 rounded-lg border p-4">
              <h3 className="text-muted-foreground text-sm font-semibold">
                تغییر رمز عبور
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">
                        رمز عبور فعلی
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          disabled={isPending}
                          placeholder="*****"
                          className="border-primary border text-gray-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">
                        رمز عبور جدید
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          disabled={isPending}
                          placeholder="*****"
                          className="border-primary border text-gray-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button
              disabled={isPending}
              type="submit"
              className="text-foreground h-12 w-full"
            >
              {isPending ? "درحال انجام..." : "ذخیره تغییرات"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
