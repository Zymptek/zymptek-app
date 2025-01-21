import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface ImageEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  currentImage: string | null;
  onSave: (imageUrl: string | null) => Promise<void>;
  aspectRatio?: "square" | "wide";
}

export function ImageEditDialog({
  open,
  onOpenChange,
  title,
  description,
  currentImage,
  onSave,
  aspectRatio = "square"
}: ImageEditDialogProps) {
  const [image, setImage] = useState<string | null>(currentImage);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await onSave(image);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-md p-0 gap-0 bg-gradient-to-b from-background to-background/80 border-brand-100/20">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden rounded-lg"
            >
              <DialogHeader className="px-6 py-4 border-b border-brand-100/20">
                <DialogTitle className="text-xl text-brand-200">{title}</DialogTitle>
                {description && (
                  <DialogDescription className="text-muted-foreground">
                    {description}
                  </DialogDescription>
                )}
              </DialogHeader>

              <div className="p-6">
                <div className={aspectRatio === "wide" ? "aspect-video" : "aspect-square"}>
                  <ImageUpload
                    value={image}
                    onChange={setImage}
                    onRemove={() => setImage(null)}
                    className="w-full h-full"
                  />
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="text-brand-200 border-brand-200 hover:bg-brand-100/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="bg-brand-200 hover:bg-brand-300 text-white"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
} 