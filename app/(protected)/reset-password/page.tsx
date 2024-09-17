"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

// Validation schema
const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm Password must be at least 8 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords must match',
});

type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const supabase = createClientComponentClient();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordSchema) => {
    setLoading(true);
    setErrorMsg(null);

    const { error } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (error) {
      setErrorMsg(error.message);
      toast({
        variant: 'destructive',
        title: 'Reset Password Failed',
        description: error.message,
      });
    } else {
      toast({
        title: 'Password Reset Successful',
        description: 'You have successfully reset your password. Redirecting...',
      });
      setTimeout(() => {
        router.replace('/');
      }, 2000);
    }
    setLoading(false);
  };

  const togglePasswordVisibility = useCallback(() => setShowPassword(prev => !prev), []);
  const toggleConfirmPasswordVisibility = useCallback(() => setShowConfirmPassword(prev => !prev), []);

  const PasswordIcon = useMemo(() => (showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />), [showPassword]);
  const ConfirmPasswordIcon = useMemo(() => (showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />), [showConfirmPassword]);

  return (
    <div className="w-full flex items-top justify-center">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center text-brand-300 dark:text-brand-100">Reset Password</CardTitle>
          <CardDescription className="text-center text-brand-300 dark:text-brand-200">Enter your new password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Label htmlFor="password" className="sr-only">New Password</Label>
                        <Input
                          {...field}
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="New Password"
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
                        <Label htmlFor="confirmPassword" className="sr-only">Confirm New Password</Label>
                        <Input
                          {...field}
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm New Password"
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
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </Button>

              {/* Error Message */}
              {errorMsg && <p className="text-red-500">{errorMsg}</p>}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center">
            Remember your password?{' '}
            <Link href="/sign-in" className="font-semibold text-brand-300 hover:text-brand-400 dark:text-brand-100 dark:hover:text-brand-200">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
