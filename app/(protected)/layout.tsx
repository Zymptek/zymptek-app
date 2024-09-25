// app/(protected)/layout.tsx
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Loading } from '../../components/Loading';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in');
    }

    setIsLoading(false)
  }, [user, loading, router]);

  if(isLoading){
    return <Loading/>
  }

  return <div>{children}</div>;
}
