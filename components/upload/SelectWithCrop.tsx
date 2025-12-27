"use client";
import React, { useEffect, useState } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { IoCloseSharp } from "react-icons/io5";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatFileNameWithDate } from "@/lib/utils";
import { RiAttachment2 } from "react-icons/ri";

interface FileWithPreview {
  file: File;
  preview: string;
  path?: string;
}

interface SelectWithCropProps {
  files: FileWithPreview[];
  setFiles: React.Dispatch<React.SetStateAction<FileWithPreview[]>>;
  onError: (error: string) => void;
}

const SelectWithCrop: React.FC<SelectWithCropProps> = ({
  files,
  setFiles,
  onError,
}) => {
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [currentCropFile, setCurrentCropFile] =
    useState<FileWithPreview | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 50,
    height: 50,
    x: 25,
    y: 25,
  });
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<{
    preview: string;
    type: string;
  } | null>(null);

  // Modified dropzone configuration
  const { getRootProps, getInputProps, open } = useDropzone({
    accept: {
      "image/*": [],
      "video/*": [],
    },
    maxSize: 1024 * 1000,
    maxFiles: 10, // multiple files
    noClick: true,
    noDrag: true,
    onDrop: (acceptedFiles, rejectedFiles) => {
      onError("");

      if (rejectedFiles?.length > 0) {
        const errorMessages = new Set();
        rejectedFiles.forEach((file) => {
          file.errors.forEach((err) => {
            errorMessages.add(err.message);
          });
        });
        onError(Array.from(errorMessages).join(", "));
        return;
      }

      const MAX_ALLOWED_FILES = 10; // multiple files
      const newTotal = files.length + acceptedFiles.length;
      if (newTotal > MAX_ALLOWED_FILES) {
        onError(`Maximum ${MAX_ALLOWED_FILES} files allowed.`);
        return;
      }

      const modifiedFiles = acceptedFiles.map((file) => ({
        file: new File([file], formatFileNameWithDate(file.name), {
          type: file.type,
        }),
        preview: URL.createObjectURL(file),
      }));

      setFiles((prev) => [...prev, ...modifiedFiles]);
    },
  });

  const removeFile = (name: string) => {
    setFiles((files) => {
      const fileToRemove = files.find((file) => file.file.name === name);
      if (fileToRemove) URL.revokeObjectURL(fileToRemove.preview);
      return files.filter((file) => file.file.name !== name);
    });
  };

  const removeAll = () => {
    files.forEach((file) => URL.revokeObjectURL(file.preview));
    setFiles([]);
  };

  const handleEditImage = (file: FileWithPreview) => {
    setCurrentCropFile(file);
    setCropModalOpen(true);
  };

  const getCroppedImg = async (image: HTMLImageElement, crop: Crop) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width;
    canvas.height = crop.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "transparent";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    );

    return new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/png", 0.9);
    });
  };

  const handleSaveCrop = async () => {
    if (!imageRef || !currentCropFile) return;

    URL.revokeObjectURL(currentCropFile.preview);
    const croppedImageBlob = await getCroppedImg(imageRef, crop);
    if (!croppedImageBlob) return;

    const croppedFile = new File(
      [croppedImageBlob],
      currentCropFile.file.name,
      { type: "image/png", lastModified: Date.now() },
    );

    setFiles((prevFiles) =>
      prevFiles.map((f) =>
        f.file.name === currentCropFile.file.name
          ? {
              ...f,
              file: croppedFile,
              preview: URL.createObjectURL(croppedFile),
            }
          : f,
      ),
    );
    setCropModalOpen(false);
  };

  return (
    <div>
      {/* Hidden dropzone inputs */}
      <div {...getRootProps()} className="hidden">
        <input {...getInputProps()} />
      </div>

      {/* Preview section */}
      {files[0]?.preview && (
        <div className="mt-4 flex gap-2 overflow-x-auto">
          {files.map((f, index) => (
            <div className="relative" key={index}>
              {f.file.type.startsWith("image/") ? (
                <img
                  src={f.preview}
                  alt="preview"
                  className="h-24 w-24 object-cover"
                />
              ) : (
                <video
                  className="h-24 w-24 cursor-pointer object-cover"
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLVideoElement;
                    target.muted = true;
                    target.play();
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLVideoElement;
                    target.pause();
                  }}
                  onClick={() =>
                    setSelectedVideo({
                      preview: f.preview,
                      type: f.file.type,
                    })
                  }
                  muted
                  disablePictureInPicture
                  controlsList="nodownload noplaybackrate"
                >
                  <source src={f.preview} type={f.file.type} />
                </video>
              )}
              <div className="absolute top-1 right-1 flex gap-1">
                {f.file.type.startsWith("image/") && (
                  <button
                    className="rounded-full bg-black/50 p-1 text-white"
                    onClick={() => handleEditImage(f)}
                    type="button"
                  >
                    Edit
                  </button>
                )}
                <IoCloseSharp
                  className="size-6 cursor-pointer rounded-full bg-black/50 p-1 text-white"
                  onClick={() => removeFile(f.file.name)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom file selection button */}
      <Button
        type="button"
        onClick={open}
        variant="outline"
        className="size-6 cursor-pointer p-0"
      >
        <RiAttachment2 className="size-4 cursor-pointer text-gray-400" />
      </Button>

      {/* Video preview modal */} 
      <Dialog
        open={!!selectedVideo}
        onOpenChange={(open) => !open && setSelectedVideo(null)}
      >
        <DialogContent className="p-0">
          <DialogHeader>
            <DialogTitle>Video Preview</DialogTitle>
          </DialogHeader>
          <div className="flex h-full w-full items-center justify-center bg-black">
            {selectedVideo && (
              <video
                controls
                autoPlay
                muted
                className="max-h-full max-w-full"
                style={{ aspectRatio: "auto" }}
                disablePictureInPicture
                controlsList="nodownload noplaybackrate"
              >
                <source src={selectedVideo.preview} type={selectedVideo.type} />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Crop modal */}
      {cropModalOpen && currentCropFile && (
        <Dialog open={cropModalOpen} onOpenChange={setCropModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crop Image</DialogTitle>
            </DialogHeader>
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              aspect={undefined}
            >
              <img
                className="w-full"
                src={currentCropFile.preview}
                ref={setImageRef}
                onLoad={() =>
                  setCrop({
                    unit: "%",
                    width: 50,
                    height: 50,
                    x: 25,
                    y: 25,
                  })
                }
              />
            </ReactCrop>
            <DialogFooter>
              <Button type="button" onClick={handleSaveCrop}>
                Save Crop
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SelectWithCrop;
