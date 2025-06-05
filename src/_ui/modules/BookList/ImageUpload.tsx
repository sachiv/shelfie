"use client";

import { createClient } from "@/_lib/supabase/client";
import { Button } from "@/_ui/shadcn/button";
import { Input } from "@/_ui/shadcn/input";
import { UploadIcon } from "lucide-react";
import { useState } from "react";

interface ImageUploadProps {
  onImageUploaded: (imagePath: string) => void;
  onUploadStart?: () => void;
  isLoading?: boolean;
}

export function ImageUpload({
  onImageUploaded,
  onUploadStart,
  isLoading,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault(); // Prevent form submission

    try {
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }
      setUploading(true);
      onUploadStart?.();
      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${new Date().getTime()}.${fileExt}`;
      const { error: uploadError, data } = await supabase.storage
        .from("images")
        .upload(filePath, file);
      if (uploadError) {
        throw uploadError;
      }
      onImageUploaded(
        data?.fullPath
          ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data.fullPath}`
          : ""
      );
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    document.getElementById("image-upload")?.click();
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isLoading || uploading}
        className="hidden"
        id="image-upload"
      />
      <Button
        type="button"
        variant="outline"
        onClick={handleButtonClick}
        disabled={isLoading || uploading}
        className="w-full"
      >
        <UploadIcon className="h-4 w-4 mr-2" />
        {uploading ? "Uploading..." : "Upload Image"}
      </Button>
    </div>
  );
}
