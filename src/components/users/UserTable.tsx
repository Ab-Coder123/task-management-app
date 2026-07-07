'use client';

import React from 'react';
import { User } from '@/lib/types';
import UserStatusBadge from './UserStatusBadge';
import { formatDate } from '@/lib/utils';
import { Check, X, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface UserTableProps {
  users: User[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
}

const AVATAR_COLORS = [
  { bg: 'rgba(99, 102, 241, 0.1)',  border: 'rgba(99, 102, 241, 0.25)',  text: '#4f46e5' }, // indigo
  { bg: 'rgba(236, 72, 153, 0.08)',  border: 'rgba(236, 72, 153, 0.2)', text: '#db2777' }, // pink
  { bg: 'rgba(245, 158, 11, 0.08)',  border: 'rgba(245, 158, 11, 0.2)', text: '#d97706' }, // amber
  { bg: 'rgba(16, 185, 129, 0.08)',  border: 'rgba(16, 185, 129, 0.2)', text: '#059669' }, // emerald
  { bg: 'rgba(239, 68, 68, 0.08)',   border: 'rgba(239, 68, 68, 0.2)',  text: '#dc2626' }, // red
  { bg: 'rgba(59, 130, 246, 0.08)',  border: 'rgba(59, 130, 246, 0.2)', text: '#2563eb' }, // blue
];

function avatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 }
  }
};

const rowVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 110, damping: 14 } 
  }
};

export default function UserTable({ users, onApprove, onReject, onDelete }: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="text-center py-16 rounded-2xl bg-card shadow-200">
        <p className="text-sm text-muted-foreground font-semibold">لا يوجد مستخدمون مسجلون بعد.</p>
      </div>
    );
  }

  // Format standard date in Arabic
  const formatArabicDate = (dateStr?: string) => {
    if (!dateStr || dateStr === 'null' || dateStr === 'undefined' || dateStr.trim() === '') return 'تاريخ غير محدد';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return 'تاريخ غير محدد';
      return d.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return 'تاريخ غير محدد';
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-2xl bg-card shadow-300">
      <table className="w-full min-w-[700px] text-right border-collapse">
        <thead>
          <tr className="bg-muted/30 text-xs font-bold text-muted-foreground/80 uppercase tracking-wider">
            <th className="px-6 py-4.5">المستخدم</th>
            <th className="px-6 py-4.5">تاريخ التسجيل</th>
            <th className="px-6 py-4.5">الصلاحية</th>
            <th className="px-6 py-4.5">الحالة</th>
            <th className="px-6 py-4.5 text-left">الإجراءات</th>
          </tr>
        </thead>
        <motion.tbody 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="divide-y divide-border/20 text-sm text-foreground"
        >
          {users.map((user) => {
            const ac = avatarColor(user.username || 'غ م');
            
            return (
              <motion.tr 
                key={user._id} 
                variants={rowVariants}
                className="hover:bg-muted/20 transition-colors duration-200"
              >
                
                {/* User Identity */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold uppercase"
                      style={{ background: ac.bg, border: `1.5px solid ${ac.border}`, color: ac.text }}
                    >
                      {user.username.substring(0, 2)}
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{user.username}</p>
                      <p className="text-xs text-muted-foreground font-semibold mt-0.5">{user.email}</p>
                    </div>
                  </div>
                </td>
                
                {/* Registration Date */}
                <td className="px-6 py-4 text-muted-foreground font-semibold">
                  {formatArabicDate(user.createdAt)}
                </td>

                {/* Role */}
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border shadow-100 ${
                    user.role === 'admin' 
                      ? 'bg-violet-50 text-violet-700 border-violet-100' 
                      : 'bg-slate-50 text-slate-600 border-slate-100'
                  }`}>
                    {user.role === 'admin' ? 'مدير النظام' : 'عضو فريق'}
                  </span>
                </td>
                
                {/* Status Badge */}
                <td className="px-6 py-4">
                  <UserStatusBadge status={user.status} />
                </td>
                
                {/* Action Operations */}
                <td className="px-6 py-4 text-left">
                  <div className="flex items-center justify-start gap-1.5">
                    {user.status === 'pending' && (
                      <>
                        <button
                          onClick={() => onApprove(user._id)}
                          className="p-2 rounded-xl text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-all shadow-100"
                          title="موافقة"
                        >
                          <Check className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={() => onReject(user._id)}
                          className="p-2 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all shadow-100"
                          title="رفض"
                        >
                          <X className="h-4.5 w-4.5" />
                        </button>
                      </>
                    )}
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => onDelete(user._id)}
                        className="p-2 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all shadow-100"
                        title="حذف المستخدم"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    )}
                  </div>
                </td>

              </motion.tr>
            );
          })}
        </motion.tbody>
      </table>
    </div>
  );
}
