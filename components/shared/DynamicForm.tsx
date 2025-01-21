import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { PhoneInput } from "@/components/shared/PhoneInput";
import { DatePicker } from "@/components/shared/DatePicker";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Field types for B2B marketplace
export type FieldType = 
  | "text" 
  | "email" 
  | "password"
  | "tel"
  | "number"
  | "url"
  | "textarea"
  | "select"
  | "date"
  | "phone";

export interface FormFieldOption {
  label: string;
  value: string;
  options?: FormFieldOption[];
}

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  description?: string;
  required?: boolean;
  options?: FormFieldOption[];
  min?: number;
  max?: number;
  rows?: number;
}

interface DynamicFormProps {
  fields: FormField[];
  onSubmit: (data: any) => Promise<void>;
  schema: z.ZodSchema<any>;
  initialData?: any;
  submitText?: string;
  className?: string;
}

export function DynamicForm({
  fields,
  onSubmit,
  schema,
  initialData,
  submitText = "Save Changes",
  className
}: DynamicFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData || {},
  });

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      await onSubmit(data);
      form.reset(data);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormControl = (field: FormField, formField: any) => {
    const labelClass = cn(
      "text-[13px] font-medium text-brand-200/90 mb-1.5 block",
      formField.error && "text-red-500"
    );
    const inputClass = cn(
      "w-full px-3 py-2 bg-white/50 border border-brand-100/20",
      "rounded-md shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-200",
      "focus:border-brand-200 focus:ring-1 focus:ring-brand-200/30",
      "placeholder:text-gray-400 text-[13px]",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      formField.error && "border-red-400 focus:border-red-400 focus:ring-red-400/20"
    );

    switch (field.type) {
      case "textarea":
        return (
          <div className="space-y-1.5">
            <label className={labelClass}>
              {field.label}
              {field.required && <span className="text-brand-300 ml-0.5 font-medium">*</span>}
            </label>
            <Textarea
              {...formField}
              placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
              className={cn(inputClass, "min-h-[90px] resize-none")}
              rows={field.rows || 4}
            />
          </div>
        );
      case "select":
        if (!field.options) return null;
        return (
          <div className="space-y-1.5">
            <label className={labelClass}>
              {field.label}
              {field.required && <span className="text-brand-300 ml-0.5 font-medium">*</span>}
            </label>
            <Select
              onValueChange={formField.onChange}
              defaultValue={formField.value}
            >
              <SelectTrigger className={cn(inputClass, "cursor-pointer h-10")}>
                <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent 
                className="bg-white/95 backdrop-blur-sm border border-brand-100/20 shadow-lg rounded-md overflow-hidden z-50 max-h-[300px]"
                position="popper"
                sideOffset={4}
              >
                <div className="overflow-y-auto max-h-[300px] scrollbar-thin scrollbar-thumb-brand-100 scrollbar-track-transparent">
                  {field.options.map((option) => (
                    option.options ? (
                      <SelectGroup key={option.label}>
                        <SelectLabel className="px-3 py-2 text-sm font-semibold text-brand-200">{option.label}</SelectLabel>
                        {option.options.map((subOption) => (
                          <SelectItem 
                            key={subOption.value} 
                            value={subOption.value}
                            className="py-2 px-3 focus:bg-brand-100/10 hover:bg-brand-100/5 cursor-pointer text-[13px]"
                          >
                            {subOption.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ) : (
                      <SelectItem 
                        key={option.value} 
                        value={option.value}
                        className="py-2 px-3 focus:bg-brand-100/10 hover:bg-brand-100/5 cursor-pointer text-[13px]"
                      >
                        {option.label}
                      </SelectItem>
                    )
                  ))}
                </div>
              </SelectContent>
            </Select>
          </div>
        );
      case "phone":
        return (
          <div className="space-y-1.5">
            <label className={labelClass}>
              {field.label}
              {field.required && <span className="text-brand-300 ml-0.5 font-medium">*</span>}
            </label>
            <div className={cn(inputClass, "!p-0 flex items-center overflow-hidden h-10")}>
              <PhoneInput
                value={formField.value}
                onChange={formField.onChange}
              />
            </div>
          </div>
        );
      case "date":
        return (
          <div className="space-y-1.5">
            <label className={labelClass}>
              {field.label}
              {field.required && <span className="text-brand-300 ml-0.5 font-medium">*</span>}
            </label>
            <div className={cn(inputClass, "!p-0 h-10")}>
              <DatePicker
                value={formField.value}
                onChange={formField.onChange}
              />
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-1.5">
            <label className={labelClass}>
              {field.label}
              {field.required && <span className="text-brand-300 ml-0.5 font-medium">*</span>}
            </label>
            <Input
              type={field.type}
              {...formField}
              placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
              className={cn(inputClass, "h-10")}
              min={field.type === "number" ? field.min : undefined}
              max={field.type === "number" ? field.max : undefined}
            />
          </div>
        );
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full px-4 py-3 space-y-5">
          <div className="grid grid-cols-1 gap-5">
            {fields.map((field, index) => (
              <motion.div
                key={field.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: index * 0.05 }}
              >
                <FormField
                  control={form.control}
                  name={field.name}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormControl>
                        {renderFormControl(field, {
                          ...formField,
                          error: form.formState.errors[field.name]
                        })}
                      </FormControl>
                      <FormMessage className="mt-1 text-[11px] font-medium text-red-400" />
                    </FormItem>
                  )}
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, delay: fields.length * 0.05 }}
          >
            <Button 
              type="submit" 
              className={cn(
                "w-full bg-brand-200 text-white h-10 px-4 rounded-md text-[13px]",
                "hover:bg-brand-300 transition-colors duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              disabled={isLoading || !form.formState.isValid}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Saving changes...</span>
                </>
              ) : (
                <span>{submitText}</span>
              )}
            </Button>
          </motion.div>
        </form>
      </Form>
    </div>
  );
} 