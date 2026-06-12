'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function Page() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Check local session redirection
    if (!isAuthenticated || !user) {
      router.replace('/login');
    } else if (user.status === 'pending') {
      router.replace('/waiting-approval');
    } else if (user.role === 'admin') {
      router.replace('/admin/dashboard');
    } else {
      router.replace('/dashboard');
    }
  }, [user, isAuthenticated, router]);

  return <LoadingSpinner fullPage />;
}
