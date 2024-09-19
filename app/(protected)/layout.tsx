// app/(protected)/layout.tsx
'use client';

import { Suspense, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Loading } from '../../components/Loading';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in');
    }
  }, [user, loading, router]);

  return <Suspense fallback={<Loading/>}>{children}</Suspense>;
}
