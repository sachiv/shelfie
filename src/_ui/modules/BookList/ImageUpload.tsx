"use client";

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault(); // Prevent form submission
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    onUploadStart?.();
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      onImageUploaded(data.path);
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
