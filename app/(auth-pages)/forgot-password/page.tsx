"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ShieldCheck, Mail, ArrowRight } from 'lucide-react';

const ForgotPasswordPage = () => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add password reset logic here
  };

  return (
    <div className="h-screen auth-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-brand-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-accent-100 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-brand-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1600px] w-full mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-20 lg:pl-4">
            {/* Left side - Features */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="hidden lg:block w-[700px]"
            >
              <div className="space-y-8">
                <div className="relative">
                  <h1 className="text-4xl font-bold text-brand-300 mb-3">
                    Reset Your Password
                  </h1>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-1 bg-gradient-to-r from-brand-300 to-brand-100 absolute -bottom-2 left-0"
                  ></motion.div>
                  <p className="text-base text-gray-600 mt-6">
                    We'll help you get back to your account securely
                  </p>
                </div>
                
                <div className="grid gap-4 relative">
                  {/* Animated line */}
                  <div className="absolute left-[27px] top-[48px] w-[2px] h-[calc(100%-48px)] bg-gradient-to-b from-brand-300/50 to-transparent" />
                  
                  <motion.div 
                    className="flex items-start space-x-5 backdrop-blur-sm bg-white/40 p-5 rounded-xl hover:bg-white/50 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="p-3 bg-brand-50/50 backdrop-blur-sm rounded-lg relative z-10">
                      <Mail className="w-6 h-6 text-brand-300" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-base text-gray-800 mb-1.5">Check Your Email</h3>
                      <p className="text-sm text-gray-600">We'll send you a secure reset link</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-start space-x-5 backdrop-blur-sm bg-white/40 p-5 rounded-xl hover:bg-white/50 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="p-3 bg-brand-50/50 backdrop-blur-sm rounded-lg relative z-10">
                      <ShieldCheck className="w-6 h-6 text-brand-300" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-base text-gray-800 mb-1.5">Secure Reset Process</h3>
                      <p className="text-sm text-gray-600">Your account security is our priority</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-start space-x-5 backdrop-blur-sm bg-white/40 p-5 rounded-xl hover:bg-white/50 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="p-3 bg-brand-50/50 backdrop-blur-sm rounded-lg relative z-10">
                      <ArrowRight className="w-6 h-6 text-brand-300" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-base text-gray-800 mb-1.5">Quick Recovery</h3>
                      <p className="text-sm text-gray-600">Get back to managing your business quickly</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Right side - Reset Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-[520px]"
            >
              <Card className="w-full relative overflow-hidden backdrop-blur-sm bg-white/80 shadow-2xl border-0">
                <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/50 z-0"></div>
                <div className="relative z-10">
                  <CardHeader className="space-y-1.5 pb-6 pt-6">
                    <CardTitle className="text-2xl font-bold text-center text-brand-300">Forgot Password</CardTitle>
                    <CardDescription className="text-center text-gray-600">Enter your email to reset your password</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 px-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email address"
                          className="h-11"
                          required
                        />
                      </div>
                      <Button 
                        type="submit"
                        className="w-full h-11 bg-brand-300 hover:bg-brand-400 text-white transition-colors"
                      >
                        Send Reset Link
                      </Button>
                    </form>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-3 pb-6 px-6">
                    <div className="text-sm text-center space-y-2">
                      <Link 
                        href="/sign-in" 
                        className="inline-flex items-center text-brand-300 hover:text-brand-400 font-medium"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Sign In
                      </Link>
                    </div>
                  </CardFooter>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
