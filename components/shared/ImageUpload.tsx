import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: string | null;
  onChange: (value: string | null) => void;
  onRemove: () => void;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  className
}: ImageUploadProps) {
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      setLoading(true);
      const file = acceptedFiles[0];
      
      // Convert file to base64 for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false);
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed rounded-lg transition-colors cursor-pointer",
          isDragActive ? "border-brand-200 bg-brand-100/10" : "border-gray-300 hover:border-brand-200",
          loading && "opacity-50 cursor-wait"
        )}
      >
        <input {...getInputProps()} />
        {value ? (
          <div className="relative w-full h-full">
            <Image
              src={value}
              alt="Uploaded image"
              className="object-cover rounded-lg"
              fill
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground p-4">
            <ImageIcon className="h-10 w-10 mb-2" />
            <p className="text-sm text-center">
              {isDragActive ? "Drop image here" : "Drag & drop or click to upload"}
            </p>
          </div>
        )}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-200"></div>
          </div>
        )}
      </div>
    </div>
  );
} 