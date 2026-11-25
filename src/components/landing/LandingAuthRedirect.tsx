'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { getHomeRoute } from '@/lib/auth/permissions';

export default function LandingAuthRedirect() {
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuthStore();

  useEffect(() => {
    useAuthStore.persist.rehydrate();
    const state = useAuthStore.getState();
    const activeUser = state.user || user;
    const activeToken = state.token || token;

    if ((state.isAuthenticated || isAuthenticated) && activeToken && activeUser) {
      if (activeUser.status === 'rejected') return;
      router.replace(getHomeRoute(activeUser.role));
    }
  }, [router, user, token, isAuthenticated]);

  return null;
}
