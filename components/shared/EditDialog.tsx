import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DynamicForm, FormField } from "@/components/shared/DynamicForm";
import { z } from "zod";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  fields: FormField[];
  onSubmit: (data: any) => Promise<void>;
  schema: z.ZodSchema<any>;
  initialData?: any;
  submitText?: string;
  loading?: boolean;
}

export function EditDialog({
  open,
  onOpenChange,
  title,
  description,
  fields,
  schema,
  onSubmit,
  initialData,
  submitText = "Save changes",
  loading = false
}: EditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-brand-100/20">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 h-full px-6 py-4">
          <div className="relative">
            <DynamicForm
              fields={fields}
              schema={schema}
              onSubmit={onSubmit}
              initialData={initialData}
              submitText={submitText}
              className="space-y-4 [&_.select-content]:!z-[100] [&_.combobox-content]:!z-[100] [&_.calendar]:!z-[100]"
              loading={loading}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
} 