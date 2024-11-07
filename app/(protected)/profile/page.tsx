"use client";

import { useState } from 'react';
import { LayoutDashboard, MessageSquare, Package, Settings, ShoppingCart, User2, Plus, PieChart, Store } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import ProfileForm from '@/components/profile/ProfileForm';
import OrderManagement from '@/components/profile/OrderManagement';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useAuth } from '@/context/AuthContext';

const ProfilePage = () => {
  const supabase = createClientComponentClient();
  const { toast } = useToast();
  const { profile } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [showSellerDialog, setShowSellerDialog] = useState(false);
  const [verificationStep, setVerificationStep] = useState<'initial' | 'success'>('initial');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyName, setCompanyName] = useState(profile?.company_profile?.company_name || '');
  const [companyAddress, setCompanyAddress] = useState(profile?.company_profile?.company_address || '');
  const [companyDescription, setCompanyDescription] = useState(profile?.company_profile?.company_description || '');

  const handleBecomeSellerRequest = async () => {
    if (!profile) return;

    setIsSubmitting(true);
    try {
      const { data: existingVerification, error: fetchError } = await supabase
        .from('seller_verifications')
        .select('*')
        .eq('user_id', profile.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingVerification) {
        setVerificationStep('success');
        return;
      }

      // Update profiles table with company information
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          company_profile: {
            company_name: companyName,
            company_address: companyAddress,
            company_description: companyDescription
          }
        })
        .eq('id', profile.id);

      if (profileError) throw profileError;

      // Create seller verification entry
      const { error: verificationError } = await supabase
        .from('seller_verifications')
        .insert([
          {
            user_id: profile.id,
            company_name: companyName,
            company_address: companyAddress,
            phone_number: profile.phone_number,
            company_description: companyDescription
          }
        ]);

      if (verificationError) throw verificationError;

      toast({
        title: "Verification Submitted",
        description: "Your seller verification request has been submitted successfully.",
        variant: "success"
      });

      setVerificationStep('success');

    } catch (error) {
      console.error('Error submitting verification:', error);
      toast({
        title: "Error",
        description: "Failed to submit verification request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreatePaymentLink = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneratedLink(`https://example.com/pay/${Math.random().toString(36).substr(2, 9)}`);
  };

  const renderSellerDialog = () => {
    const isIndianUser = profile?.country === 'India' || profile?.country === 'IN';

    return (
      <Dialog open={showSellerDialog} onOpenChange={setShowSellerDialog}>
        <DialogContent className="sm:max-w-[425px]">
          {isIndianUser && verificationStep === "success" && (
            <DialogHeader>
              <DialogTitle className="text-brand-200">Become a Seller</DialogTitle>
              <DialogDescription>
                Join our marketplace as a seller and start growing your business.
              </DialogDescription>
            </DialogHeader>
          )}

          <AnimatePresence mode="wait">
            {isIndianUser ? (
              verificationStep === 'initial' ? (
                <motion.div
                  key="verification"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="py-4"
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-brand-200">Verify Phone Number</Label>
                      <PhoneInput
                        international
                        countryCallingCodeEditable={false}
                        value={profile?.phone_number}
                        onChange={(value) => value}
                        className="border-brand-100 focus:border-brand-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyName" className="text-brand-200">Company Name</Label>
                      <Input
                        id="companyName"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="border-brand-100 focus:border-brand-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyAddress" className="text-brand-200">Company Address</Label>
                      <Textarea
                        id="companyAddress"
                        value={companyAddress}
                        onChange={(e) => setCompanyAddress(e.target.value)}
                        className="border-brand-100 focus:border-brand-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyDescription" className="text-brand-200">Company Description</Label>
                      <Textarea
                        id="companyDescription"
                        value={companyDescription}
                        onChange={(e) => setCompanyDescription(e.target.value)}
                        className="border-brand-100 focus:border-brand-200"
                      />
                    </div>
                    <Button
                      onClick={handleBecomeSellerRequest}
                      className="w-full bg-brand-200 hover:bg-brand-300 text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center"
                        >
                          <span className="mr-2">Processing</span>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            ⚬
                          </motion.div>
                        </motion.div>
                      ) : (
                        "Confirm & Submit"
                      )}
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="py-4 text-center"
                >
                  <div className="mb-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 10 }}
                      className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center"
                    >
                      <Store className="w-8 h-8 text-green-600" />
                    </motion.div>
                  </div>
                  <h3 className="text-lg font-semibold text-brand-200 mb-2">
                    Request Submitted Successfully!
                  </h3>
                  <p className="text-sm text-gray-600">
                    Our team will review your application and contact you soon.
                  </p>
                  <Button
                    onClick={() => setShowSellerDialog(false)}
                    className="mt-4 bg-brand-200 hover:bg-brand-300 text-white"
                  >
                    Close
                  </Button>
                </motion.div>
              )
            ) : (
              <motion.div
                key="not-available"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-4 text-center"
              >
                <div className="mb-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center"
                  >
                    <Store className="w-8 h-8 text-red-600" />
                  </motion.div>
                </div>
                <h3 className="text-lg font-semibold text-brand-200 mb-2">
                  Service Not Available in Your Region
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  We apologize, but seller registration is currently only available in India. Thank you for your interest!
                </p>
                <Button
                  onClick={() => setShowSellerDialog(false)}
                  className="bg-brand-200 hover:bg-brand-300 text-white"
                >
                  Close
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    );
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-brand-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-brand-200">
                    Total {profile?.user_type === 'BUYER' ? 'Purchases' : 'Sales'}
                  </CardTitle>
                  <ShoppingCart className="h-4 w-4 text-brand-200" />
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-brand-200">$45,231.89</div>
                  <p className="text-xs text-brand-300">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card className="border-brand-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-brand-200">
                    {profile?.user_type === 'BUYER' ? 'Active Orders' : 'Pending Orders'}
                  </CardTitle>
                  <Package className="h-4 w-4 text-brand-200" />
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-brand-200">12</div>
                  <p className="text-xs text-brand-300">
                    +3 since last week
                  </p>
                </CardContent>
              </Card>
              <Card className="border-brand-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-brand-200">
                    New Messages
                  </CardTitle>
                  <MessageSquare className="h-4 w-4 text-brand-200" />
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-brand-200">24</div>
                  <p className="text-xs text-brand-300">
                    +5 since yesterday
                  </p>
                </CardContent>
              </Card>
              <Card className="border-brand-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-brand-200">
                    {profile?.user_type === 'BUYER' ? 'Saved Products' : 'Active Listings'}
                  </CardTitle>
                  <Package className="h-4 w-4 text-brand-200" />
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-brand-200">145</div>
                  <p className="text-xs text-brand-300">
                    +12 since last week
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-6">
              <Card className="col-span-4 border-brand-100 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-brand-200">Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <OrderManagement userType={profile?.user_type || ''} />
                </CardContent>
              </Card>
              <Card className="col-span-3 border-brand-100 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-brand-200">Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={[
                      { name: 'Jan', value: 400 },
                      { name: 'Feb', value: 300 },
                      { name: 'Mar', value: 200 },
                      { name: 'Apr', value: 278 },
                      { name: 'May', value: 189 },
                      { name: 'Jun', value: 239 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip />
                      <Bar dataKey="value" fill="var(--brand-200)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'profile':
        return (
          <Card className="border-brand-100 shadow-lg">
            <CardHeader>
              <CardTitle className="text-brand-200">User Profile</CardTitle>
            </CardHeader>
            <CardContent>
              {profile && <ProfileForm profile={profile} />}
            </CardContent>
          </Card>
        );
      case 'create-payment':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-200">Create Payment Link</h2>
            <Card className="border-brand-100 shadow-lg">
              <CardContent className="p-6">
                <form onSubmit={handleCreatePaymentLink} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-brand-200">Amount</Label>
                    <Input
                      id="amount"
                      placeholder="Enter amount"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="border-brand-100 focus:border-brand-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-brand-200">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter payment description"
                      value={paymentDescription}
                      onChange={(e) => setPaymentDescription(e.target.value)}
                      className="border-brand-100 focus:border-brand-200"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-brand-200 hover:bg-brand-300 text-white">
                    Generate Payment Link
                  </Button>
                </form>
                {generatedLink && (
                  <div className="mt-4">
                    <Label className="text-brand-200">Generated Payment Link:</Label>
                    <div className="flex mt-2">
                      <Input value={generatedLink} readOnly className="border-brand-100" />
                      <Button
                        onClick={() => navigator.clipboard.writeText(generatedLink)}
                        className="ml-2 bg-brand-100 hover:bg-brand-200 text-brand-200 hover:text-white"
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
      default:
        return <h2 className="text-2xl font-bold text-brand-200">Page not found</h2>;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-64 bg-background-light border-r border-brand-100 p-4 hidden md:block">
        <nav className="space-y-2">
          {[
            { view: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { view: 'profile', icon: User2, label: 'Profile' },
            { view: 'orders', icon: ShoppingCart, label: 'Orders' },
            { view: 'messages', icon: MessageSquare, label: 'Messages' },
            { view: 'analytics', icon: PieChart, label: 'Analytics' },
            ...(profile?.user_type === 'SELLER' 
              ? [{ view: 'create-payment', icon: Plus, label: 'Create Payment Link' }] 
              : [{ view: 'become-seller', icon: Store, label: 'Become a Seller', onClick: () => setShowSellerDialog(true) }]
            ),
            { view: 'settings', icon: Settings, label: 'Settings' }
          ].map(({ view, icon: Icon, label, onClick }) => (
            <Button 
              key={view}
              variant={activeView === view ? 'default' : 'ghost'} 
              className={`w-full justify-start transition-colors duration-200 ${
                activeView === view 
                  ? 'bg-brand-200 text-white hover:bg-brand-300' 
                  : 'hover:bg-brand-100 hover:text-brand-200'
              }`}
              onClick={onClick || (() => setActiveView(view))}
            >
              <Icon className="mr-2 h-4 w-4" />
              {label}
            </Button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden bg-background-light">
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-3xl font-bold mb-6 text-brand-200">
            Welcome, {profile?.first_name || 'User'}!
          </h1>
          {renderContent()}
          {renderSellerDialog()}
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
