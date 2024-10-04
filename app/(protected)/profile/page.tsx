"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import ProfileForm from '@/components/profile/ProfileForm';
import { Tables } from '@/lib/database.types';
import { User as UserIcon, ClipboardList, LogOut, Globe } from 'lucide-react';
import OrderManagement from '@/components/profile/OrderManagement';
import Link from 'next/link';

type Profile = Tables<'profiles'>;


const ProfilePage = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [profile, setProfile] = useState<Profile | null>(null);

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

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <motion.div
      className="min-h-screen bg-background-light p-2"
      initial="initial"
      animate="animate"

      exit="exit"
      variants={pageVariants}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="flex justify-end mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {profile && profile.user_type === 'SELLER' && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href={`/sellers/${profile.id}`} passHref>
                <Button
                  className="bg-brand-100 hover:bg-brand-600 text-white px-4 py-2 rounded-full font-semibold flex items-center transition-colors duration-300"
                >
                  <Globe className="mr-2 h-4 w-4" />
                  View Public Profile
                </Button>
              </Link>
            </motion.div>
          )}
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            className="bg-white rounded-lg shadow-lg p-6"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <UserIcon className="text-5xl text-brand-200 mb-4" />
            <h2 className="text-2xl font-semibold mb-4">User Profile</h2>
            {profile && <ProfileForm profile={profile} />}

          </motion.div>

          <motion.div
            className="bg-white rounded-lg shadow-lg p-6 md:col-span-2"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <ClipboardList className="text-5xl text-green-600 mb-4" />
            <h2 className="text-2xl font-semibold mb-4">Order Management</h2>
            <OrderManagement userType={profile?.user_type || ''} /> 

          </motion.div>


        </div>

        <motion.div
          className="mt-8 text-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            onClick={handleSignOut}
            className="bg-brand-100 hover:bg-red-600 text-white px-6 py-3 rounded-full font-semibold"
          >
            <LogOut className="inline-block mr-2" />
            Sign Out
          </Button>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default ProfilePage;