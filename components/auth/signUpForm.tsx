"use client";

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Validation schema
const formSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).superRefine((data, ctx) => {
  if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords must match",
      path: ["confirmPassword"]
    });
  }
});

type SignUpSchema = z.infer<typeof formSchema>;

const SignUpForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const email = form.watch('email');
  const password = form.watch('password');
  const confirmPassword = form.watch('confirmPassword');

  React.useEffect(() => {
    if (email) {
      form.trigger('email');
    }
  }, [email, form]);

  React.useEffect(() => {
    if (password) {
      form.trigger('password');
      if (confirmPassword) {
        form.trigger('confirmPassword');
      }
    }
  }, [password, form, confirmPassword]);

  React.useEffect(() => {
    if (confirmPassword) {
      form.trigger('confirmPassword');
    }
  }, [confirmPassword, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;

      toast({
        title: "Sign Up Successful",
        description: "Please check your email to verify your account.",
        variant: "success",
      });
      router.push('/auth/sign-in');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: error.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const { clearErrors } = form;

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'password' || name === 'confirmPassword') {
        const { password, confirmPassword } = value;
        
        // Clear error when either field is empty or when they match
        if (!password || !confirmPassword) {
          form.clearErrors('confirmPassword');
          return;
        }
        
        if (password === confirmPassword) {
          form.clearErrors('confirmPassword');
        } else {
          form.setError('confirmPassword', {
            type: 'manual',
            message: 'Passwords must match'
          });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  // Toggle password visibility
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev: boolean) => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword((prev: boolean) => !prev);
  }, []);

  // Memoizing icons for better performance
  const PasswordIcon = useMemo(() => (showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />), [showPassword]);
  const ConfirmPasswordIcon = useMemo(() => (showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />), [showConfirmPassword]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="sr-only">Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type="email"
                    placeholder="Email"
                    onChange={(e) => {
                      field.onChange(e);
                      form.trigger('email');
                    }}
                    className={cn(
                      "pl-10 bg-background-light",
                      form.formState.errors.email && [
                        "border-red-500",
                        "focus-visible:ring-red-500",
                        "placeholder:text-red-500"
                      ]
                    )}
                    aria-describedby="email-error"
                  />
                  <Mail className={cn(
                    "absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5",
                    form.formState.errors.email ? "text-red-500" : "text-gray-400"
                  )} />
                </div>
              </FormControl>
              <FormMessage className="text-sm font-medium text-red-500" role="alert" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="sr-only">Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    onChange={(e) => {
                      field.onChange(e);
                      form.trigger('password');
                    }}
                    className={cn(
                      "pl-10 pr-10 bg-background-light",
                      form.formState.errors.password && [
                        "border-red-500",
                        "focus-visible:ring-red-500",
                        "placeholder:text-red-500"
                      ]
                    )}
                    aria-describedby="password-error"
                  />
                  <Lock className={cn(
                    "absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5",
                    form.formState.errors.password ? "text-red-500" : "text-gray-400"
                  )} />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className={cn(
                      "absolute right-3 top-1/2 transform -translate-y-1/2",
                      form.formState.errors.password ? "text-red-500" : "text-gray-400"
                    )}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {PasswordIcon}
                  </button>
                </div>
              </FormControl>
              <FormMessage className="text-sm font-medium text-red-500" role="alert" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="sr-only">Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    onChange={(e) => {
                      field.onChange(e);
                      form.trigger('confirmPassword');
                    }}
                    className={cn(
                      "pl-10 pr-10 bg-background-light",
                      form.formState.errors.confirmPassword && [
                        "border-red-500",
                        "focus-visible:ring-red-500",
                        "placeholder:text-red-500"
                      ]
                    )}
                    aria-describedby="confirm-password-error"
                  />
                  <Lock className={cn(
                    "absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5",
                    form.formState.errors.confirmPassword ? "text-red-500" : "text-gray-400"
                  )} />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className={cn(
                      "absolute right-3 top-1/2 transform -translate-y-1/2",
                      form.formState.errors.confirmPassword ? "text-red-500" : "text-gray-400"
                    )}
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    {ConfirmPasswordIcon}
                  </button>
                </div>
              </FormControl>
              <FormMessage className="text-sm font-medium text-red-500" role="alert" />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full bg-brand-300 hover:bg-brand-400 text-white"
          disabled={isLoading}
        >
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </Button>
      </form>
    </Form>
  );
};

export default SignUpForm;
