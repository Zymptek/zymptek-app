"use client"

import Hero from "@/components/hero";
import { useAuth } from "@/context/AuthContext";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Index() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Fetch user profile completion status
      supabase
        .from('profiles')
        .select('user_type')
        .eq('user_id', user.id)
        .single()
        .then(({ data: user }) => {
          if (user?.user_type) {
            router.push("/");
          } else {
            router.push("/complete-profile");
          }
        })
    }
  }, [isAuthenticated, user, router, supabase]);

  return (
    <>
      <Hero />
    </>
  );
}
