import { useState } from "react";
import { S3 } from "aws-sdk";

const useImageUpload = () => {
  const [error, setError] = useState<string | null>(null);
  const [uploadLinks, setUploadLinks] = useState<string[]>([]);
  const [permanentLinks, setPermanentLinks] = useState<string[]>([]);
  const [fileList, setFileList] = useState<string[]>([]);

  // const accessKeyId = process.env.NEXT_PUBLIC_LIARA_ACCESS_KEY!;
  // const secretAccessKey = process.env.NEXT_PUBLIC_LIARA_SECRET_KEY!;
  // const endpoint = process.env.NEXT_PUBLIC_LIARA_ENDPOINT!;
  // const bucket = process.env.NEXT_PUBLIC_LIARA_BUCKET_NAME!;
  const accessKeyId = "at64up4ec2gu2nhn";
  const secretAccessKey = "8d8777d0-80f8-45c2-aaa9-e102fd5522d9";
  const endpoint = "https://storage.c2.liara.space";
  const bucket = "chat-ticket"; // "traveler/Folder_Name"

  const s3 = new S3({
    accessKeyId,
    secretAccessKey,
    endpoint,
  });

  const handleUpload = async (files: File[]) => {
    setError(null);
    setUploadLinks([]);
    setPermanentLinks([]);
    try {
      const uploadPromises = files.map(async (file) => {
        const params = {
          Bucket: bucket,
          Key: file.name,
          Body: file,
        };

        await s3.upload(params).promise();

        const signedUrl = s3.getSignedUrl("getObject", {
          Bucket: bucket,
          Key: file.name,
          Expires: 3600,
        });

        const permanentSignedUrl = s3.getSignedUrl("getObject", {
          Bucket: bucket,
          Key: file.name,
          Expires: 31536000,
        });

        return {
          uploadLink: signedUrl,
          permanentLink: permanentSignedUrl,
        };
      });

      const uploadResults = await Promise.all(uploadPromises);
      setUploadLinks(uploadResults.map((result) => result.uploadLink));
      setPermanentLinks(uploadResults.map((result) => result.permanentLink));
      return { success: true };
    } catch (err) {
      const message = "Upload failed: " + (err as Error).message;
      setError(message);
      throw new Error(message); // Throw error to be caught in EditDest
    }
  };

  const deleteFile = async (fileName: string) => {
    try {
      await s3
        .deleteObject({
          Bucket: bucket,
          Key: fileName,
        })
        .promise();
      setFileList(fileList.filter((file) => file !== fileName));
    } catch (err) {
      setError("Error deleting file: " + (err as Error).message);
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await s3
        .listObjectsV2({
          Bucket: bucket,
        })
        .promise();

      setFileList(response.Contents?.map((item) => item.Key!) || []);
    } catch (err) {
      setError("Error fetching files: " + (err as Error).message);
    }
  };

  const generateDownloadLink = (fileName: string) => {
    try {
      return s3.getSignedUrl("getObject", {
        Bucket: bucket,
        Key: fileName,
        Expires: 3600,
      });
    } catch (err) {
      setError("Error generating download link: " + (err as Error).message);
      return null;
    }
  };

  return {
    handleUpload,
    deleteFile,
    fetchFiles,
    generateDownloadLink,
    uploadLinks,
    permanentLinks,
    fileList,
    error,
  };
};

export default useImageUpload;
