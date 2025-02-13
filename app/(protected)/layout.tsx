// app/(protected)/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Loading } from '@/components/loading';


export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && !profile) {
      router.push('/sign-in');
    }

    setIsLoading(false)
  }, [user, loading, router]);

  if(loading || isLoading) {
    return <Loading/>
  }

  return <div>{children}</div>;
}
