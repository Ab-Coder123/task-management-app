'use client';

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useNotifications } from '@/lib/hooks/useNotifications';
import { formatDate } from '@/lib/utils';
import { Bell, Check, UserCheck, MessageSquare, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const pageVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
};

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: 'spring', stiffness: 120, damping: 14 } 
  }
};

export default function AdminNotificationsPage() {
  const { notifications, unreadCount, markAllAsRead, markAsRead, isLoading } = useNotifications();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'new_user':
        return <UserCheck className="h-4.5 w-4.5 text-emerald-600" />;
      case 'task_completed':
        return <Check className="h-4.5 w-4.5 text-indigo-600" />;
      case 'new_comment':
        return <MessageSquare className="h-4.5 w-4.5 text-violet-600" />;
      default:
        return <Bell className="h-4.5 w-4.5 text-blue-600" />;
    }
  };

  const getThemeClasses = (type: string, isRead: boolean) => {
    if (isRead) return 'bg-card/75 text-muted-foreground shadow-100 hover:shadow-200 border-r-4 border-r-slate-300';
    switch (type) {
      case 'new_user':
        return 'bg-emerald-50/30 text-foreground shadow-200 hover:shadow-300 border-r-4 border-r-emerald-500';
      case 'task_completed':
        return 'bg-indigo-50/30 text-foreground shadow-200 hover:shadow-300 border-r-4 border-r-indigo-500';
      case 'new_comment':
        return 'bg-violet-50/30 text-foreground shadow-200 hover:shadow-300 border-r-4 border-r-violet-500';
      default:
        return 'bg-blue-50/30 text-foreground shadow-200 hover:shadow-300 border-r-4 border-r-blue-500';
    }
  };

  const getIconBg = (type: string, isRead: boolean) => {
    if (isRead) return 'bg-slate-100';
    switch (type) {
      case 'new_user':
        return 'bg-emerald-50';
      case 'task_completed':
        return 'bg-indigo-50';
      case 'new_comment':
        return 'bg-violet-50';
      default:
        return 'bg-blue-50';
    }
  };

  const formatArabicDateTime = (dateStr?: string) => {
    if (!dateStr || dateStr === 'null' || dateStr === 'undefined' || dateStr.trim() === '') return 'تاريخ غير محدد';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return 'تاريخ غير محدد';
      return d.toLocaleDateString('ar-EG', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'تاريخ غير محدد';
    }
  };

  if (isLoading || !mounted) {
    return <LoadingSpinner size="lg" className="h-[50vh]" />;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="space-y-6 text-right"
      dir="rtl"
    >
      <PageHeader
        title="الإشعارات والتنبيهات"
        description="استعرض إشعارات النظام، سجلات الأنشطة وتنبيهات المهام المكتملة أو المضافة حديثاً."
        action={
          unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead()}
              className="px-4.5 py-2.5 text-xs font-bold rounded-xl bg-primary/10 hover:bg-primary/15 text-primary transition-all shadow-100"
            >
              تحديد الكل كمقروء
            </button>
          )
        }
      />

      <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-blue-50/60 border border-blue-100 text-blue-800 text-xs font-semibold shadow-100">
        <Bell className="h-4 w-4 text-blue-600 shrink-0" />
        <span>تنبيه للنظام: يتم حفظ وعرض الإشعارات الخاصة بآخر يومين (48 ساعة) فقط، ويقوم السيرفر بحذف الإشعارات الأقدم تلقائياً للحفاظ على سرعة وكفاءة قاعدة البيانات.</span>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl shadow-200">
          <Bell className="h-10 w-10 text-muted-foreground/45 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground font-semibold">لا توجد لديك أي تنبيهات أو إشعارات حالياً.</p>
        </div>
      ) : (
        <motion.div 
          variants={listVariants}
          initial="hidden"
          animate="show"
          className="space-y-3.5"
        >
          {notifications.map((notification) => {
            const theme = getThemeClasses(notification.type, notification.isRead);
            const iconBg = getIconBg(notification.type, notification.isRead);

            return (
              <motion.div
                key={notification._id}
                variants={itemVariants}
                onClick={() => !notification.isRead && markAsRead(notification._id)}
                className={`flex items-center justify-between py-5 px-6 rounded-2xl transition-all duration-300 cursor-pointer ${theme}`}
                whileHover={{ scale: 1.01, x: -3 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-4">
                  {/* Visual Icon Box */}
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-100 transition-colors ${iconBg}`}>
                    {getIcon(notification.type)}
                  </div>
                  
                  {/* Msg text */}
                  <div>
                    <p className={`text-xs md:text-sm leading-relaxed ${!notification.isRead ? 'font-bold text-foreground' : 'font-semibold text-muted-foreground'}`}>
                      {notification.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground/80 font-semibold mt-1.5 flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      {formatArabicDateTime(notification.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Status Indicator circle */}
                {!notification.isRead && (
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">جديد</span>
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse shrink-0" title="غير مقروء" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}

// Simple Calendar Icon helper to avoid loading additional imports
function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
  );
}
