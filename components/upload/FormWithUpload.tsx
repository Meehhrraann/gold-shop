"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { DestinationSchema } from "@/validation";
// import {
//   getDestination,
//   updateDestination,
// } from "@/lib/actions/generalActions/destination.actions";
import DropWithCrop from "./SelectWithCrop";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
// import TagInput from "../TagInput";
import { z } from "zod";
import useImageUpload from "@/hooks/useImageUpload";
import SelectWithCrop from "./SelectWithCrop";
import { MessageSchema } from "@/validation";
import { createMessage } from "@/lib/actions/message.action";
import { useCurrentUser } from "@/hooks/use-current-user";
import { BiSend } from "react-icons/bi";
import { useParams } from "next/navigation";
import { inferType } from "@/lib/utils";
import { socket } from "@/lib/socketio/socket";

// TS: Interface for files with preview
interface FileWithPreview {
  file: File;
  preview: string;
  path?: string;
}

const FormWithUpload = ({
  replayTo,
  setReplayTo,
  chatId,
  currentUserName,
  onMessageSent,
}) => {
  const {
    handleUpload,
    uploadLinks,
    permanentLinks,
    error: uploadError,
    fileList,
  } = useImageUpload();

  const params = useParams();
  const roomId = params.roomId as string;

  console.log("uploadError", uploadError);

  const currentUser = useCurrentUser();
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  // States: UI
  const [isSubmmiting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Listen for errors from the hook
  useEffect(() => {
    if (uploadError) setErrorMsg(uploadError);
  }, [uploadError]);

  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
    defaultValues: {
      content: "", // ✅ string input
      sender: currentUser?.id, // ✅ string input
      senderName: currentUser?.name,
      chat: roomId, // ✅ string input
      replyTo: "", // ✅ optional but should default to empty string if used in input
      // type: "text", // ✅ enum input
      isEdited: false, // ✅ boolean input
      // deleted: false, // ✅ boolean input
      // editedAt: undefined, // ✅ date input (can be undefined if not rendered)
      // deletedAt: undefined,
      media: [],
      likes: [],
    },
  });

  // fetch initials
  // useEffect(() => {
  //   const fetchDest = async () => {
  //     const res = await getDestination({ destinationId });
  //     if (res.destination) {
  //       const dest = JSON.parse(res.destination);
  //       form.setValue("name", dest?.name);
  //       form.setValue("accommodations", dest?.accommodations);
  //       form.setValue("activities", dest?.activities);
  //       form.setValue("attractions", dest?.attractions);
  //       form.setValue("description", dest?.description);
  //       form.setValue("location", dest?.location);
  //     }
  //   };
  //   fetchDest();
  // }, []);
  // watch changing replay
  useEffect(() => {
    form.setValue("replyTo", replayTo ?? "");
  }, [replayTo]);

  // Revoke files
  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  const resetHandler = () => {
    setReplayTo("");
    setFiles([]); // reset files
    form.reset(); // reset form
  };

  // todo 1. Handle Typing Events
  const handleTyping = () => {
    socket.emit("typing", { chatId, userName: currentUserName });

    // Logic to stop typing after 2 seconds of inactivity
    setTimeout(() => {
      socket.emit("stop_typing", { chatId });
    }, 2000);
  };

  // submit => UPDATE + handleUpload()
  async function onSubmit(values: z.infer<typeof MessageSchema>) {
    console.log("helo jojo");
    setIsSubmitting(true);
    setSuccess("");
    setErrorMsg("");
    try {
      // just UPDATE when we have files
      if (files?.length > 0) {
        await handleUpload(files.map((file) => file.file));
      }

      // formdata
      const formData = new FormData();

      // strings
      formData.append("content", values?.content ?? "");
      formData.append("senderName", values?.senderName);
      formData.append("sender", values?.sender); // required
      formData.append("chat", values?.chat); // required
      formData.append("replyTo", values?.replyTo ?? "");
      formData.append("isEdited", values?.isEdited);

      //stringyfy array
      formData.append("likes", JSON.stringify(values?.likes ?? []));
      formData.append("media", JSON.stringify(values?.media ?? []));

      // create object for each file in the files array
      const arrayOfFiles = files.map((file) => ({
        url: `https://chat-ticket.storage.c2.liara.space/${file.file.name}`, // or url from .env
        filename: file.file.name,
        mimeType: file.file.type,
        type: inferType(file.file.type), // inferType() func from utils
        size: file.file.size,
      }));
      // stringyfy files array
      formData.append("medias", JSON.stringify(arrayOfFiles));

      // todo 1. SAVE TO DB (Your existing Server Action
      const res = await createMessage({
        formDatas: formData,
      });

      //reset form
      // resetHandler();

      if (res?.error) setErrorMsg(res.error);
      if (res?.success && res?.newMsg) {
        // Send the REAL database object to socket
        socket.emit("send_message", {
          chatId: values.chat,
          ...res.newMsg,
        });

        // Add to own list
        onMessageSent(res.newMsg);

        resetHandler();
      }
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-[80%]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} method="post">
          <div className="z-20 flex w-full flex-shrink-0 items-center justify-evenly gap-1 rounded-lg border border-gray-100 py-2 pr-2 shadow-md">
            {/* Add other form fields here */}
            <SelectWithCrop
              files={files}
              setFiles={setFiles}
              onError={setErrorMsg}
            />
            {/* fields */}
            <div className="flex-1">
              {/* field 1 */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Name</FormLabel> */}
                    <FormControl>
                      <Input
                        className="border-0 bg-white text-2xl text-gray-800 ring-0 outline-none"
                        placeholder="type something..."
                        {...field}
                        // todo
                        onChange={(e) => {
                          field.onChange(e); // Keep React Hook Form logic
                          handleTyping(); // Add Socket logic
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-wrap text-red-600" />
                  </FormItem>
                )}
              />
            </div>

            {/* <DropWithCrop
              files={files}
              setFiles={setFiles}
              onError={setErrorMsg} // Pass error handler
            /> */}

            {/* messages */}
            {errorMsg && <p className="text-red-500">{errorMsg}</p>}
            {success && <p className="text-teal-500">{success}</p>}
            {/* liara download links */}
            <Button className="size-9 rounded-full" type="submit">
              <BiSend
                type="submit"
                className="bg-primary size-9 rounded-full p-1 text-white"
              />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormWithUpload;
