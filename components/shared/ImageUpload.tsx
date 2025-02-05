"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface ImageUploadProps {
  value: string | null;
  onChange: (value: string | null) => void;
  onRemove: () => void;
  className?: string;
}

export function ImageUpload({ value, onChange, onRemove, className }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    try {
      setUploading(true);
      const file = acceptedFiles[0];
      // Create a temporary URL for preview
      const previewUrl = URL.createObjectURL(file);
      onChange(previewUrl);
    } catch (error) {
      console.error('Error handling file:', error);
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div 
      {...getRootProps()} 
      className={`relative border-2 border-dashed rounded-lg p-4 hover:bg-brand-100/5 transition-colors cursor-pointer ${className}`}
    >
      <input {...getInputProps()} />
      {value ? (
        <div className="relative w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Uploaded image"
            className="w-full h-full object-cover rounded-lg"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            Remove
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <Upload className="h-8 w-8" />
          <p className="text-sm font-medium">
            {isDragActive ? "Drop the image here" : "Drag & drop or click to upload"}
          </p>
        </div>
      )}
    </div>
  );
} 