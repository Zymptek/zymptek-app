"use client";

import { Button } from "@/components/ui/button";
import { Upload, Check } from "lucide-react";
import { useState } from "react";

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
  uploaded?: boolean;
}

export function FileUpload({ onUpload, uploaded = false }: FileUploadProps) {
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      await onUpload(file);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {uploaded ? (
        <Button variant="outline" className="w-[100px] bg-green-50" disabled>
          <Check className="w-4 h-4 text-green-500" />
          <span className="ml-2">Done</span>
        </Button>
      ) : (
        <Button
          variant="outline"
          className="w-[100px]"
          disabled={loading}
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-brand-200 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span className="ml-2">Upload</span>
            </>
          )}
        </Button>
      )}
      <input
        id="fileInput"
        type="file"
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileChange}
      />
    </div>
  );
} 