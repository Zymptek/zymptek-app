"use client";

import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";

const signInSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z.string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

type SignInSchema = z.infer<typeof signInSchema>;

const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const email = form.watch('email');
  const password = form.watch('password');

  React.useEffect(() => {
    if (email) {
      form.trigger('email');
    }
  }, [email, form]);

  React.useEffect(() => {
    if (password) {
      form.trigger('password');
    }
  }, [password, form]);

  const onSubmit = async (data: SignInSchema) => {
    try {
      const response = await fetch('/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const { error } = await response.json();
        toast({
          variant: 'destructive',
          title: 'Sign In Failed',
          description: error || 'An unexpected error occurred. Please try again.'
        });
        return;
      }

      window.location.href = "/";
    } catch (error) {
      console.error('Sign In Error:', error);
      toast({
        variant: 'destructive',
        title: 'Sign In Error',
        description: 'An unexpected error occurred. Please try again.'
      });
    }
  };

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
                    onClick={() => setShowPassword(prev => !prev)}
                    className={cn(
                      "absolute right-3 top-1/2 transform -translate-y-1/2",
                      form.formState.errors.password ? "text-red-500" : "text-gray-400"
                    )}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </Form>
  );
};

export default SignInForm;
