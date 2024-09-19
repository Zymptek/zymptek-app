"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Select, { MultiValue } from 'react-select';
import { useForm, FieldErrors, Path, DefaultValues } from 'react-hook-form';
import { z, ZodSchema } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';

// Define field types
type FieldConfig = {
  type: 'text' | 'number' | 'textarea' | 'select' | 'multiselect' | 'date';
  name: string;
  options?: { value: string; label: string }[]; // Options for select and multiselect
};

type EditDialogProps<T> = {
  name: string;
  isOpen: boolean;
  onClose: () => void;
  defaultValues: DefaultValues<T>;
  schema: ZodSchema<T>;
  onSubmit: (data: T) => void;
  fieldConfig: Record<keyof T, FieldConfig>;
};

export const EditDialog = <T extends Record<string, any>>({
  name,
  isOpen,
  onClose,
  defaultValues,
  schema,
  onSubmit,
  fieldConfig,
}: EditDialogProps<T>) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // Reset form on open
  useEffect(() => {
    if (isOpen) {
      reset(defaultValues);
    }
  }, [isOpen, reset, defaultValues]);

  const convertToDate = (dateStr: string): Date => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Function to safely access errors
  const getFieldError = (errors: FieldErrors<T>, field: Path<T>) => {
    const error = errors[field as keyof FieldErrors<T>];
    return error ? (error.message as string | undefined) : undefined;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{name}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(data => {
            // Convert date strings to Date objects before submitting
            const convertedData = Object.keys(data).reduce((acc, key) => {
              const value = data[key as keyof T];
              if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
                acc[key as keyof T] = convertToDate(value) as any; // Convert and cast as needed
              } else {
                acc[key as keyof T] = value;
              }
              return acc;
            }, {} as T);
            onSubmit(convertedData);
          })}
          className="grid gap-4 py-4"
        >
          {Object.entries(fieldConfig).map(([key, config]) => {
            const field = key as keyof T;
            const fieldValue = watch(field as Path<T>);

            return (
              <div key={key} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={key} className="text-right">
                  {config.name}
                </Label>
                {config.type === 'date' && (
                  <Input
                    type="date"
                    id={key}
                    {...register(field as Path<T>)}
                    className="col-span-3"
                  />
                )}
                {config.type === 'number' && (
                  <Input
                    type="phone"
                    id={key}
                    {...register(field as Path<T>)}
                    className="col-span-3"
                  />
                )}
                {config.type === 'text' && (
                  <Input
                    id={key}
                    {...register(field as Path<T>)}
                    className="col-span-3"
                  />
                )}
                {config.type === 'textarea' && (
                  <textarea
                    id={key}
                    {...register(field as Path<T>)}
                    className="col-span-3 border rounded px-2 py-1 w-full"
                    rows={4}
                    maxLength={20}
                  />
                )}
                {config.type === 'select' && config.options && (
                  <select
                    id={key}
                    {...register(field as Path<T>)}
                    className="col-span-3 border rounded px-2 py-1 w-full"
                  >
                    {config.options.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
                {config.type === 'multiselect' && config.options && (
                  <div className="col-span-3">
                    <Select
                      isMulti
                      options={config.options}
                      value={config.options.filter(option => 
                        (fieldValue as string[])?.includes(option.value)
                      )}
                      onChange={(newValue: MultiValue<{ value: string; label: string }>) => {
                        const selectedValues = newValue.map(option => option.value);
                        setValue(field as Path<T>, selectedValues as any, { shouldValidate: true });
                      }}
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </div>
                )}
                {/* Show validation error */}
                {getFieldError(errors, field as Path<T>) && (
                  <p className="text-red-500 text-sm col-span-4">
                    {getFieldError(errors, field as Path<T>)}
                  </p>
                )}
              </div>
            );
          })}
          <DialogFooter>
            <Button type="submit" className='btn-primary'>Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};