"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Home, LayoutDashboard, MessageSquare, Package, Settings, ShoppingCart, Users, DollarSign, Link, User2, Plus, PieChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import ProfileForm from '@/components/profile/ProfileForm';
import { Tables } from '@/lib/database.types';
import OrderManagement from '@/components/profile/OrderManagement';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer } from 'recharts';

type Profile = Tables<'profiles'>;

const ProfilePage = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setProfile(profile);
        }
      }
    };
    fetchProfile();
  }, [supabase]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleCreatePaymentLink = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneratedLink(`https://example.com/pay/${Math.random().toString(36).substr(2, 9)}`);
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
            ...(profile?.user_type === 'SELLER' ? [{ view: 'create-payment', icon: Plus, label: 'Create Payment Link' }] : []),
            { view: 'settings', icon: Settings, label: 'Settings' }
          ].map(({ view, icon: Icon, label }) => (
            <Button 
              key={view}
              variant={activeView === view ? 'default' : 'ghost'} 
              className={`w-full justify-start transition-colors duration-200 ${
                activeView === view 
                  ? 'bg-brand-200 text-white hover:bg-brand-300' 
                  : 'hover:bg-brand-100 hover:text-brand-200'
              }`}
              onClick={() => setActiveView(view)}
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
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
