"use client";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
  maxSizeMB?: number;
  acceptedFileTypes?: string[];
  className?: string;
}

export function FileUpload({ 
  onUpload, 
  maxSizeMB = 5, 
  acceptedFileTypes = ['.pdf'], 
  className 
}: FileUploadProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);

      // Validate file size
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > maxSizeMB) {
        toast({
          title: "File too large",
          description: `File size must be less than ${maxSizeMB}MB`,
          variant: "destructive"
        });
        return;
      }

      // Validate file type
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!acceptedFileTypes.includes(fileExtension)) {
        toast({
          title: "Invalid file type",
          description: `File must be one of: ${acceptedFileTypes.join(', ')}`,
          variant: "destructive"
        });
        return;
      }

      await onUpload(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      // Clear the input
      e.target.value = '';
    }
  };

  return (
    <div className={className}>
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileChange}
        accept={acceptedFileTypes.join(',')}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => document.getElementById('file-upload')?.click()}
        disabled={loading}
        className="h-9"
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </>
        )}
      </Button>
    </div>
  );
} 