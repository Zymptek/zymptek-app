"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface ImageUploadProps {
  endpoint: string;
  onUploadComplete: (file: File) => void;
}

export function ImageUpload({ endpoint, onUploadComplete }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    try {
      setUploading(true);
      const file = acceptedFiles[0];
      onUploadComplete(file);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Button 
        variant="outline" 
        className="relative"
        disabled={uploading}
      >
        <Upload className="h-4 w-4 mr-2" />
        {uploading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  );
} 