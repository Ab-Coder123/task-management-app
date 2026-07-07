'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function NotificationsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/notifications');
  }, [router]);

  return <LoadingSpinner size="lg" className="h-[60vh]" />;
}
