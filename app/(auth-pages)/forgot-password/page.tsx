"use client";

import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

// Validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { toast } = useToast();
  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    console.log(data)
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMsg(errorData.error || "Failed to send reset email");
        toast({
          variant: 'destructive',
          title: 'Request Failed',
          description: errorData.error || 'An unexpected error occurred. Please try again.',
        });
      } else {
        toast({
          title: 'Reset Email Sent',
          description: 'If an account with that email exists, a password reset link has been sent.',
        });

        window.location.href = "/sign-in"
      }
    } catch (err) {
      console.error("Forgot Password Error: ", err);
      setErrorMsg("An unexpected error occurred.");
      toast({
        variant: 'destructive',
        title: 'Request Failed',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-top justify-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-brand-300 dark:text-brand-100">Forgot Password</CardTitle>
          <CardDescription className="text-center text-brand-300 dark:text-brand-200">Enter your email to reset your password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <Label htmlFor="email" className="sr-only">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                className="pl-10 bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark"
                {...form.register('email')}
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            <p className="text-red-500">{form.formState.errors.email?.message}</p>
            <Button type="submit" className="w-full bg-brand-300 hover:bg-brand-400 text-white" disabled={loading}>
              {loading ? 'Sending...' : 'Send Request'}
            </Button>
          </form>
        </CardContent>
        <CardContent>
          <div className="text-sm text-center">
            Remember your password?{' '}
            <Link href="/sign-in" className="font-semibold text-brand-300 hover:text-brand-400 dark:text-brand-100 dark:hover:text-brand-200">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
