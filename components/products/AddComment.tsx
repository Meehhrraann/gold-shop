"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { postComment } from "@/lib/actions/product.action";
import { toast } from "sonner";

const AddComment = ({
  productId,
  senderId,
  parentComment = undefined,
  btnTitle,
  replies = [],
  onFetchCM = () => {},
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const formSchema = z.object({
    content: z.string().min(1, "نظر خود را وارد کنید"),
    senderId: z.string().optional(),
    productId: z.string(),
    parentComment: z.string().optional(),
    replies: z.array(z.string()).optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      senderId: senderId,
      productId: productId,
      parentComment: parentComment || undefined,
      replies: replies || [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("hereeeeeee");
    if (!senderId) {
      toast.error("لطفا وارد شوید");
      return;
    }
    setIsSubmitting(true);
    try {
      console.log("values", values);
      const res = await postComment(values);
      if (res?.success) {
        form.reset();
        toast.success("نظر شما با موفقیت ثبت شد.");
        onFetchCM();
      }
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="border-primary text-primary cursor-pointer border"
          variant="outline"
        >
          {btnTitle}
        </Button>
      </DialogTrigger>

      <DialogContent dir="rtl" className="text-gray-300 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>ثبت نظر</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-5"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="نظر خود را بنویسید..." {...field} />
                  </FormControl>
                  <FormMessage className="text-wrap text-red-600" />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">انصراف</Button>
              </DialogClose>
              <Button
                className="text-foreground"
                type="submit"
                disabled={isSubmitting}
              >
                ثبت
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddComment;
