import React from 'react';
import { UserStatus } from '@/lib/types';

interface UserStatusBadgeProps {
  status: UserStatus;
}

export default function UserStatusBadge({ status }: UserStatusBadgeProps) {
  const styles = {
    pending: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
    approved: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
    rejected: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20',
  };

  const dots = {
    pending: '#f59e0b',
    approved: '#10b981',
    rejected: '#ef4444',
  };

  const labels = {
    pending: 'في انتظار الموافقة',
    approved: 'نشط (تمت الموافقة)',
    rejected: 'مرفوض',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border shadow-100 ${styles[status]}`}>
      <span 
        className="h-1.5 w-1.5 rounded-full animate-pulse" 
        style={{ backgroundColor: dots[status] }} 
      />
      {labels[status]}
    </span>
  );
}
