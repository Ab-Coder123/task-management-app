import React from 'react';
import { UserStatus } from '@/lib/types';

interface UserStatusBadgeProps {
  status: UserStatus;
}

export default function UserStatusBadge({ status }: UserStatusBadgeProps) {
  const styles = {
    pending: 'bg-amber-50 text-amber-700 border-amber-100',
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    rejected: 'bg-rose-50 text-rose-700 border-rose-100',
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
