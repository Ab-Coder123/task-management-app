'use client';

import React from 'react';
import { useNotifications } from '@/lib/hooks/useNotifications';
import { Bell } from 'lucide-react';
import Link from 'next/link';

export default function NotificationBell({ role }: { role: 'admin' | 'user' }) {
  const { unreadCount } = useNotifications();

  return (
    <Link
      href={role === 'admin' ? '/admin/notifications' : '/dashboard/notifications'}
      className="relative rounded-full p-2 text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-all"
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-background animate-pulse">
          {unreadCount}
        </span>
      )}
    </Link>
  );
}
