import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
  FormDescription,
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
import { useState, useEffect } from "react";
import { PhoneInput } from "@/components/shared/PhoneInput";
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

export type FormField = {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "phone" | "select" | "textarea" | "date" | "url" | "number";
  placeholder?: string;
  description?: string;
  required?: boolean;
  options?: { label: string; value: string; options?: { label: string; value: string; }[] }[];
  rows?: number;
  className?: string;
  min?: number | string;
  max?: number;
  readOnly?: boolean;
  defaultValue?: any;
  calendarProps?: {
    mode?: "single" | "multiple" | "range";
    captionLayout?: "dropdown" | "dropdown-months" | "dropdown-years";
    fromYear?: number;
    toYear?: number;
    defaultMonth?: Date;
    showOutsideDays?: boolean;
    fixedWeeks?: boolean;
    classNames?: Record<string, string>;
  };
}

interface DynamicFormProps {
  fields: FormField[];
  onSubmit: (data: any) => Promise<void>;
  schema: z.ZodSchema<any>;
  initialData?: any;
  submitText?: string;
  className?: string;
  loading?: boolean;
}

export function DynamicForm({
  fields,
  onSubmit,
  schema,
  initialData,
  submitText = "Save Changes",
  className,
  loading = false
}: DynamicFormProps) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData || {},
    mode: "onTouched"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const formState = form.formState;

  // Debug logs for form state changes
  useEffect(() => {
    console.log('Form State:', {
      isDirty: formState.isDirty,
      isSubmitting: formState.isSubmitting,
      isValid: formState.isValid,
      errors: formState.errors,
      submitCount: formState.submitCount,
      isLoading: loading,
      isLocalSubmitting: isSubmitting
    });
  }, [formState, loading, isSubmitting]);

  const handleSubmit = async (data: any) => {
    if (isSubmitting || loading) {
      console.log('Preventing duplicate submission');
      return;
    }

    try {
      console.log('Starting form submission with data:', data);
      setIsSubmitting(true);

      await onSubmit(data);
      
      // Only reset the form if submission was successful
      console.log('Form submission successful');
      form.reset(data);
    } catch (error) {
      console.error('Form submission error:', error);
      
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          console.log('Setting field error:', path, err.message);
          form.setError(path, {
            type: 'manual',
            message: err.message,
          });
        });
      } else {
        // Set a generic form error
        form.setError('root', {
          type: 'manual',
          message: 'An error occurred while saving. Please try again.',
        });
      }
    } finally {
      console.log('Completing form submission');
      setIsSubmitting(false);
    }
  };

  const renderFormControl = (field: FormField, formField: any) => {
    const fieldError = form.formState.errors[field.name];
    const labelClass = cn(
      "text-[13px] font-medium text-brand-200/90 mb-1.5 block",
      fieldError && "text-red-500"
    );
    const inputClass = cn(
      "w-full px-3 py-2 bg-white/50 border border-brand-100/20",
      "rounded-md shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-200",
      "focus:border-brand-200 focus:ring-1 focus:ring-brand-200/30",
      "placeholder:text-gray-400 text-[13px]",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      fieldError && "border-red-400 focus:border-red-400 focus:ring-red-400/20"
    );

    const renderError = () => {
      if (!fieldError) return null;
      const errorMessage = fieldError && typeof fieldError === 'object' && 'message' in fieldError
        ? String(fieldError.message)
        : typeof fieldError === 'string'
          ? fieldError
          : "This field is required";
            
      return (
        <p className="text-[11px] font-medium text-red-500 mt-1">
          {errorMessage}
        </p>
      );
    };

    switch (field.type) {
      case "textarea":
        return (
          <div className="space-y-1.5">
            <label className={labelClass}>
              {field.label}
              {field.required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <Textarea
              {...formField}
              placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
              className={cn(inputClass, "min-h-[90px] resize-none")}
              rows={field.rows || 4}
            />
            {renderError()}
          </div>
        );
      case "select":
        if (!field.options) return null;
        return (
          <div className="space-y-1.5">
            <label className={labelClass}>
              {field.label}
              {field.required && <span className="text-red-500 ml-0.5">*</span>}
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
            {renderError()}
          </div>
        );
      case "phone":
        return (
          <div className="space-y-1.5">
            <label className={labelClass}>
              {field.label}
              {field.required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <div className={cn(inputClass, "!p-0 flex items-center overflow-hidden h-10")}>
              <PhoneInput
                value={formField.value}
                onChange={formField.onChange}
              />
            </div>
            {renderError()}
          </div>
        );
      case "date":
        return (
          <div className="space-y-1.5">
            <label className={labelClass}>
              {field.label}
              {field.required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <Input
              type="date"
              {...formField}
              className={cn(inputClass, "h-10")}
              min={field.name === 'delivery_date' ? field.min : "1900-01-01"}
              max={field.name === 'delivery_date' ? undefined : new Date().toISOString().split('T')[0]}
            />
            {renderError()}
          </div>
        );
      default:
        return (
          <div className="space-y-1.5">
            <label className={labelClass}>
              {field.label}
              {field.required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <Input
              type={field.type}
              {...formField}
              placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
              className={cn(inputClass, "h-10")}
              min={field.type === "number" ? field.min : undefined}
              max={field.type === "number" ? field.max : undefined}
            />
            {renderError()}
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
                        {renderFormControl(field, formField)}
                      </FormControl>
                    </FormItem>
                  )}
                />
              </motion.div>
            ))}
          </div>

          {form.formState.errors.root && (
            <p className="text-sm font-medium text-red-500 text-center">
              {form.formState.errors.root.message}
            </p>
          )}

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
              disabled={isSubmitting || loading}
            >
              {isSubmitting || loading ? (
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