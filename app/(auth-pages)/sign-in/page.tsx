"use client"

import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from 'next/link';
import SignInForm from "@/components/auth/signInForm"
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const SignInPage = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const supabase = createClientComponentClient()

  useEffect(() => {
    // If a user is logged in, redirect to the home page
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) {
      console.error('Error with Google sign-in:', error.message);
    }
  };
  
  return (
    <div className="w-full min-h-screen flex items-top justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="w-full relative overflow-hidden bg-white dark:bg-gray-800 shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-3xl font-bold text-center text-brand-300 dark:text-brand-100">Welcome back</CardTitle>
              <CardDescription className="text-center text-brand-300 dark:text-brand-200">Sign in to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="mt-4">
                <Button
                  type="button"
                  className="w-full px-4 py-2 border flex gap-2 border-brand-300 dark:border-brand-100 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150"
                  onClick={handleGoogleSignIn}
                >
                  <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
                  Sign In with Google
                </Button>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              <SignInForm />
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center space-y-2">
                <Link href="/forgot-password" className="text-brand-300 hover:text-brand-400 dark:text-brand-100 dark:hover:text-brand-200">
                  Forgot password?
                </Link>
                <div>
                  Don't have an account?{' '}
                  <Link href="/sign-up" className="font-semibold text-brand-300 hover:text-brand-400 dark:text-brand-100 dark:hover:text-brand-200">
                    Sign up
                  </Link>
                </div>
              </div>
            </CardFooter>
          </Card>
      </motion.div>
    </div>
  );
};

export default SignInPage;