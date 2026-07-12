'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function Page() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!isAuthenticated || !user) {
      router.replace('/login');
    } else if (!user.isVerified) {
      router.replace('/waiting-approval');
    } else if (user.role === 'admin') {
      router.replace('/admin/dashboard');
    } else {
      router.replace('/dashboard');
    }
  }, [user, isAuthenticated, router, mounted]);

  return <LoadingSpinner fullPage />;
}
