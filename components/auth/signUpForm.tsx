"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

// Validation schema
const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm Password must be at least 8 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords must match',
});

type SignUpSchema = z.infer<typeof signUpSchema>;

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast()
  const router = useRouter();

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignUpSchema) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Failed to sign up");
        toast({
          variant: 'destructive',
          title: 'Sign Up Failed',
          description: 'An unexpected error occurred. Please try again.',
        });
      } else {
        toast({
          title: 'Sign Up Successful',
          description: 'You have successfully signed up. Redirecting...',
        });

        setTimeout(() => {
          router.push('/auth/callbac');
        }, 4000);
      }

    } catch (err) {
      console.error("Signup Error: ", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = useCallback(() => setShowPassword(prev => !prev), []);
  const toggleConfirmPasswordVisibility = useCallback(() => setShowConfirmPassword(prev => !prev), []);

  // Memoizing icons for better performance
  const PasswordIcon = useMemo(() => (showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />), [showPassword]);
  const ConfirmPasswordIcon = useMemo(() => (showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />), [showConfirmPassword]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <label htmlFor="email" className="sr-only">Email</label>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="Email"
                    className="pl-10 bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark"
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
              </FormControl>
              <FormMessage className='text-red-400'/>
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <label htmlFor="password" className="sr-only">Password</label>
                  <Input
                    {...field}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="pl-10 pr-10 bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {PasswordIcon}
                  </button>
                </div>
              </FormControl>
              <FormMessage className='text-red-400'/>
            </FormItem>
          )}
        />

        {/* Confirm Password Field */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                  <Input
                    {...field}
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    className="pl-10 pr-10 bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    {ConfirmPasswordIcon}
                  </button>
                </div>
              </FormControl>
              <FormMessage className='text-red-400'/>
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full bg-brand-300 hover:bg-brand-400 text-white" disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </Button>

        {/* Error Message */}
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </Form>
  );
};

export default SignUpForm;
