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

// TS: Interface for files with preview
interface FileWithPreview {
  file: File;
  preview: string;
  path?: string;
}

interface DropWithCropProps {
  files: FileWithPreview[];
  setFiles: React.Dispatch<React.SetStateAction<FileWithPreview[]>>;
  onError: (error: string) => void; // Add onError prop
}

const DropWithCrop: React.FC<DropWithCropProps> = ({
  files,
  setFiles,
  onError,
}) => {
  // States: Crop
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
  //video state
  const [selectedVideo, setSelectedVideo] = useState<{
    preview: string;
    type: string;
  } | null>(null);

  // drop files with options + create preview-url + formatFileNameWithDate
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
      "video/*": [], //todo Add video support
    },
    maxSize: 1024 * 1000,
    maxFiles: 2,
    onDrop: (acceptedFiles, rejectedFiles) => {
      onError(""); // Clear previous errors

      // 1. Handle errors from rejected files FIRST + prevent repetetive error msg
      if (rejectedFiles?.length > 0) {
        console.log("rejected files:", rejectedFiles);
        const errorMessages = new Set(); // prevent repetetive error msg

        rejectedFiles.forEach((file) => {
          file.errors.forEach((err) => {
            errorMessages.add(err.message);
          });
        });

        onError(Array.from(errorMessages).join(", "));
        return; // Exit early if there are rejected files
      }

      // 2. Check cumulative total (existing + new)
      const MAX_ALLOWED_FILES = 1;
      const newTotal = files.length + acceptedFiles.length;

      if (newTotal > MAX_ALLOWED_FILES) {
        onError(`Maximum ${MAX_ALLOWED_FILES} files allowed.`);
        return; // Exit if total exceeds limit
      }

      // 3. Process valid files
      const modifiedFiles = acceptedFiles.map((file) => ({
        file: new File([file], formatFileNameWithDate(file.name), {
          type: file.type,
        }),
        preview: URL.createObjectURL(file),
      }));

      setFiles((prev) => [...prev, ...modifiedFiles]);
    },
  });

  // Remove and revoke single file
  const removeFile = (name: string) => {
    setFiles((files) => {
      // Revoke the file
      const fileToRemove = files.find((file) => file.file.name === name);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      // remove the files
      return files.filter((file) => file.file.name !== name);
    });
  };

  // remove all files + Revoke files
  const removeAll = () => {
    files.forEach((file) => URL.revokeObjectURL(file.preview)); // Eevoke the files
    setFiles([]);
    // setRejected([]);
  };

  // Handle image cropping
  const handleEditImage = (file: FileWithPreview) => {
    setCurrentCropFile(file);
    setCropModalOpen(true);
  };

  // Get cropped image
  const getCroppedImg = async (image: HTMLImageElement, crop: Crop) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Set canvas dimensions to match crop area
    canvas.width = crop.width;
    canvas.height = crop.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Fill canvas with transparent background
    ctx.fillStyle = "transparent";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw cropped image
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
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/png", // Use PNG format to preserve transparency
        0.9, // Image quality (0-1)
      );
    });
  };

  // Save cropped image
  const handleSaveCrop = async () => {
    if (!imageRef || !currentCropFile) return;

    URL.revokeObjectURL(currentCropFile.preview); // Revoke the files

    const croppedImageBlob = await getCroppedImg(imageRef, crop);
    if (!croppedImageBlob) return;

    const croppedFile = new File(
      [croppedImageBlob],
      currentCropFile.file.name,
      {
        type: "image/png", // Changed from image/jpeg
        lastModified: Date.now(),
      },
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
      <div
        {...getRootProps()}
        className="border-primary cursor-pointer rounded-lg border-2 border-dashed p-10 text-black focus:outline-none"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p dir="rtl" className="text-primary flex w-full justify-center">
            محل قرار دادن فایل...
          </p>
        ) : (
          <p dir="rtl" className="text-primary flex w-full justify-center">
            انتخاب عکس‌های مورد نظر
          </p>
        )}
      </div>
      {/* Preview */}
      {files[0]?.preview && (
        <div className="mt-4 flex gap-2 overflow-x-auto">
          {files.map((f, index) => (
            <div className="relative" key={index}>
              {/* Show image or video preview based on type */}
              {f.file.type.startsWith("image/") ? (
                <img
                  src={f.preview}
                  alt="preview"
                  className="h-24 w-24 object-cover"
                />
              ) : (
                //todo if selected was video onHover play onClick open modal
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
                {/* Only show edit button for images */}
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

      {/*todo Video Modal */}
      <Dialog
        open={!!selectedVideo}
        onOpenChange={(open) => !open && setSelectedVideo(null)}
      >
        <DialogContent className="p-0">
          <DialogHeader>
            <DialogTitle>display video</DialogTitle>
          </DialogHeader>
          <div className="flex h-full w-full items-center justify-center bg-black">
            {selectedVideo && (
              <div className="flex h-full w-full items-center justify-center bg-black">
                <video
                  controls
                  autoPlay
                  muted
                  className="max-h-full max-w-full"
                  style={{
                    aspectRatio: "auto",
                  }}
                  disablePictureInPicture
                  controlsList="nodownload noplaybackrate"
                >
                  <source
                    src={selectedVideo.preview}
                    type={selectedVideo.type}
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Crop Modal */}
      {cropModalOpen && currentCropFile && (
        <Dialog open={cropModalOpen} onOpenChange={setCropModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crop Image</DialogTitle>
            </DialogHeader>
            {currentCropFile && (
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
            )}
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

export default DropWithCrop;
