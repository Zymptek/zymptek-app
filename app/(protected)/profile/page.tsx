"use client";

import { useState } from 'react';
import { LayoutDashboard, Star, Package, Settings, ShoppingCart, User2, Plus, PieChart, Store } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";

interface Review {
  id: number;
  rating: number;
  content: string;
  authorName: string;
  createdAt: string;
  isRead: boolean;
  reply?: string;
  replyDate?: string;
}

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
  const [replyText, setReplyText] = useState('');
  const [unreadReviews, setUnreadReviews] = useState(3);

  const mockReviews: Review[] = [
    {
      id: 1,
      rating: 4,
      content: "Great product and excellent service! The quality exceeded my expectations.",
      authorName: "John Doe",
      createdAt: "2 days ago",
      isRead: false,
      reply: "Thank you for your kind words! We're glad you enjoyed our service.",
      replyDate: "1 day ago"
    },
    {
      id: 2,
      rating: 5,
      content: "Amazing seller, very responsive and professional.",
      authorName: "Jane Smith",
      createdAt: "3 days ago",
      isRead: true
    },
    {
      id: 3,
      rating: 4,
      content: "Good communication and fast shipping.",
      authorName: "Mike Johnson",
      createdAt: "1 week ago",
      isRead: false
    }
  ];

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

  const handleReplySubmit = async (reviewId: number) => {
    if (!replyText.trim()) return;

    try {
      // Add your API call here to save the reply
      toast({
        title: "Reply Posted",
        description: "Your reply has been posted successfully.",
        variant: "success"
      });
      setReplyText('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive"
      });
    }
  };

  const renderReviewsSection = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-brand-200">Reviews</h2>
          <div className="flex gap-4">
            <Badge variant="secondary" className="bg-brand-100">
              Total Reviews: {mockReviews.length}
            </Badge>
            {unreadReviews > 0 && (
              <Badge variant="destructive" className="bg-red-500">
                {unreadReviews} Unread
              </Badge>
            )}
          </div>
        </div>

        <div className="grid gap-6">
          <Card className="border-brand-100 shadow-lg">
            <CardHeader>
              <CardTitle className="text-brand-200">Review Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[5,4,3,2,1].map((rating) => (
                  <div key={rating} className="flex items-center gap-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="ml-1">{rating}</span>
                    </div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-brand-200 rounded-full" 
                        style={{width: `${Math.random() * 100}%`}}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-brand-100 shadow-lg">
            <CardHeader>
              <CardTitle className="text-brand-200">Recent Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockReviews.map((review) => (
                  <div key={review.id} className="border-b border-brand-100 pb-6 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          {!review.isRead && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              New
                            </Badge>
                          )}
                        </div>
                        <h4 className="font-medium mt-2">{review.authorName}</h4>
                      </div>
                      <span className="text-sm text-gray-500">{review.createdAt}</span>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{review.content}</p>

                    <div className="pl-6 border-l-2 border-brand-100 mt-4">
                      <div className="space-y-2">
                        {review.reply && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600">{review.reply}</p>
                            <span className="text-xs text-gray-500 mt-1 block">
                              Replied {review.replyDate}
                            </span>
                          </div>
                        )}
                        
                        {!review.reply && (
                          <div className="space-y-2">
                            <Textarea
                              placeholder="Write a public reply..."
                              className="text-sm border-brand-100 focus:border-brand-200"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                            />
                            <Button 
                              size="sm"
                              className="bg-brand-200 hover:bg-brand-300 text-white"
                              onClick={() => handleReplySubmit(review.id)}
                            >
                              Post Reply
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
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
                    Unread Reviews
                  </CardTitle>
                  <Star className="h-4 w-4 text-brand-200" />
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-brand-200">{unreadReviews}</div>
                  <p className="text-xs text-brand-300">
                    +2 since yesterday
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
      case 'reviews':
        return renderReviewsSection();
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
            { 
              view: 'reviews', 
              icon: Star, 
              label: 'Reviews',
              badge: unreadReviews > 0 ? unreadReviews : undefined
            },
            { view: 'analytics', icon: PieChart, label: 'Analytics' },
            ...(profile?.user_type === 'SELLER' 
              ? [{ view: 'create-payment', icon: Plus, label: 'Create Payment Link' }] 
              : [{ view: 'become-seller', icon: Store, label: 'Become a Seller', onClick: () => setShowSellerDialog(true) }]
            ),
            { view: 'settings', icon: Settings, label: 'Settings' }
          ].map(({ view, icon: Icon, label, onClick, badge }) => (
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
              {badge && (
                <Badge 
                  variant="destructive" 
                  className="ml-auto bg-red-500"
                >
                  {badge}
                </Badge>
              )}
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
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
