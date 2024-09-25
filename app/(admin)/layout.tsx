// app/(protected)/layout.tsx
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Loading } from '@/components/Loading';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useToast } from '@/hooks/use-toast';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()
  const router = useRouter();
  const { toast } = useToast()

  useEffect(() => {
    const checkUser = async () => {
    if (!loading && !user) {
      router.push('/sign-in');
    }


    if(user !== null){
    const { data, error } = await supabase.from('profiles').select("user_type").eq("user_id", user?.id).single();
    

    if (error) {
        console.error('Error fetching profile:', error);
        return;
    }

    if(data.user_type !== "ADMIN"){
        router.push('/');
        toast({
            variant: "destructive",
            title: "Restricted Page",
            description: "You are trying to access restricted page"
        })
    }
    setIsLoading(false)
  }
    }
    checkUser()
  }, [user, loading, router]);

  if(isLoading){
    return <Loading />
  }

  return <div className="w-full flex flex-col gap-12 items-start">{children}</div>;
}
