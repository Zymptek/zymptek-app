"use client"

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from 'next/link';
import SignInForm from "@/components/auth/signInForm";
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Factory, Truck, BarChart3, Building2 } from 'lucide-react';

const SignInPage = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const supabase = createClientComponentClient();

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Error with Google sign-in:', error.message);
    }
  };

  return (
    <div className="h-screen auth-background relative overflow-hidden w-full">
      {/* Background Elements */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-brand-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-accent-100 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-brand-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 h-full flex">
        {/* Left side - Features */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:flex w-1/2 p-12 xl:p-24 2xl:p-32"
        >
          <div className="w-full">
            <div className="space-y-8">
              <div className="relative">
                <h1 className="text-4xl font-bold text-brand-300 mb-3">
                  Streamline Your Supply Chain
                </h1>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-1 bg-gradient-to-r from-brand-300 to-brand-100 absolute -bottom-2 left-0"
                ></motion.div>
                <p className="text-base text-gray-600 mt-6">
                  Continue managing your procurement process efficiently
                </p>
              </div>
              
              <div className="grid gap-3 relative">
                {/* Animated line */}
                <div className="absolute left-[27px] top-[48px] w-[2px] h-[calc(100%-48px)] bg-gradient-to-b from-brand-300/50 to-transparent" />
                
                <motion.div 
                  className="flex items-start space-x-4 backdrop-blur-sm bg-white/40 p-5 rounded-xl hover:bg-white/50 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="p-3 bg-brand-50/50 backdrop-blur-sm rounded-lg relative z-10">
                    <Factory className="w-6 h-6 text-brand-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-gray-800 mb-1">Direct Manufacturer Access</h3>
                    <p className="text-sm text-gray-600">Connect with verified manufacturers</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start space-x-4 backdrop-blur-sm bg-white/40 p-5 rounded-xl hover:bg-white/50 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="p-3 bg-brand-50/50 backdrop-blur-sm rounded-lg relative z-10">
                    <Truck className="w-6 h-6 text-brand-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-gray-800 mb-1">Efficient Supply Chain</h3>
                    <p className="text-sm text-gray-600">Real-time tracking and optimization</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start space-x-4 backdrop-blur-sm bg-white/40 p-5 rounded-xl hover:bg-white/50 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="p-3 bg-brand-50/50 backdrop-blur-sm rounded-lg relative z-10">
                    <BarChart3 className="w-6 h-6 text-brand-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-gray-800 mb-1">Business Analytics</h3>
                    <p className="text-sm text-gray-600">Data-driven procurement decisions</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start space-x-4 backdrop-blur-sm bg-white/40 p-5 rounded-xl hover:bg-white/50 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="p-3 bg-brand-50/50 backdrop-blur-sm rounded-lg relative z-10">
                    <Building2 className="w-6 h-6 text-brand-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-gray-800 mb-1">Enterprise Network</h3>
                    <p className="text-sm text-gray-600">Access verified business network</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right side - Sign In Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-12 xl:p-24 2xl:p-32"
        >
          <div className="w-full">
            <Card className="w-full relative overflow-hidden backdrop-blur-sm bg-white/80 shadow-2xl border-0">
              <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/50 z-0"></div>
              <div className="relative z-10">
                <CardHeader className="space-y-1.5 pb-6 pt-6">
                  <CardTitle className="text-2xl font-bold text-center text-brand-300">Sign in to Zymptek</CardTitle>
                  <CardDescription className="text-center text-gray-600">Access your procurement dashboard</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 px-6">
                  <div>
                    <Button
                      type="button"
                      className="w-full h-11 border flex gap-2 items-center justify-center bg-white/80 border-brand-300 rounded-lg text-slate-700 hover:bg-brand-50 hover:border-brand-400 hover:text-slate-900 hover:shadow-lg transition duration-300"
                      onClick={handleGoogleSignIn}
                    >
                      <img className="w-5 h-5" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
                      Continue with Google
                    </Button>
                  </div>

                  <div className="relative py-1">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-3 text-muted-foreground rounded-full">Or continue with email</span>
                    </div>
                  </div>

                  <SignInForm />
                </CardContent>
                <CardFooter className="flex flex-col space-y-3 pb-6 px-6">
                  <div className="text-sm text-center space-y-2">
                    <div>
                      <Link href="/forgot-password" className="text-brand-300 hover:text-brand-400">
                        Forgot password?
                      </Link>
                    </div>
                    <div>
                      <span className="text-gray-600">New to Zymptek?</span>{' '}
                      <Link href="/sign-up" className="font-semibold text-brand-300 hover:text-brand-400">
                        Create an account
                      </Link>
                    </div>
                  </div>
                </CardFooter>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignInPage;