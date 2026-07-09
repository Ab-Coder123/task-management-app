'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function Page() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Check if store is already hydrated
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
    } else {
      // Trigger rehydration and listen for it
      const unsubFinish = useAuthStore.persist.onFinishHydration(() => {
        setHydrated(true);
      });
      useAuthStore.persist.rehydrate();
      return () => unsubFinish();
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    // Check local session redirection after hydration completes
    if (!isAuthenticated || !user) {
      router.replace('/login');
    } else if (!user.isVerified) {
      router.replace('/waiting-approval');
    } else if (user.role === 'admin') {
      router.replace('/admin/dashboard');
    } else {
      router.replace('/dashboard');
    }
  }, [user, isAuthenticated, router, hydrated]);

  return <LoadingSpinner fullPage />;
}
