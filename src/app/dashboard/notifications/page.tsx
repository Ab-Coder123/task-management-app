'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bell, 
  Check, 
  UserCheck, 
  MessageSquare, 
  Clock, 
  CheckCheck, 
  MessageSquareText, 
  ChevronLeft,
  Filter,
  Sparkles,
  Trash2,
  FileText
} from 'lucide-react';
import { useNotifications } from '@/lib/hooks/useNotifications';
import { useAuthStore } from '@/lib/store/authStore';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';

const pageVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
};

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
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

export default function UserNotificationsPage() {
  const { user } = useAuthStore();
  const { notifications, unreadCount, markAllAsRead, markAsRead, isLoading } = useNotifications();
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isLoading || !mounted) {
    return <LoadingSpinner size="lg" className="h-[60vh]" />;
  }

  // Filter notifications for this user
  const myNotifications = notifications.filter((n: any) => {
    const metaUser = n.metadata?.userId || n.userId || n.recipient;
    return !metaUser || metaUser === user?._id || metaUser === (user as any)?.id || user?.role === 'admin';
  });

  const filteredNotifications = myNotifications.filter((n: any) => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'read') return n.isRead;
    return true;
  });

  const getArabicRelativeTime = (dateStr?: string) => {
    if (!dateStr || dateStr === 'null' || dateStr === 'undefined' || dateStr.trim() === '') return 'الآن';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'الآن';
      const diffMs = date.getTime() - Date.now();
      const diffM  = Math.floor(Math.abs(diffMs) / 60000);
      const past   = diffMs < 0;

      if (past) {
        if (diffM < 1) return 'الآن';
        if (diffM < 60) return `منذ ${diffM} دقيقة`;
        
        const diffH = Math.floor(diffM / 60);
        if (diffH < 24) {
          if (diffH === 1) return 'منذ ساعة';
          if (diffH === 2) return 'منذ ساعتين';
          if (diffH <= 10) return `منذ ${diffH} ساعات`;
          return `منذ ${diffH} ساعة`;
        }
        
        const diffD = Math.floor(diffH / 24);
        if (diffD === 1) return 'منذ أمس';
        if (diffD === 2) return 'قبل يومين';
        if (diffD <= 10) return `قبل ${diffD} أيام`;
        return `قبل ${diffD} يوماً`;
      }
      return 'الآن';
    } catch { return 'الآن'; }
  };

  const getNotifIcon = (type: string, action?: string) => {
    const checkType = action || type;
    switch (checkType) {
      case 'new_user':
        return <UserCheck className="h-5 w-5 text-emerald-600" />;
      case 'task_completed':
        return <Check className="h-5 w-5 text-indigo-600" />;
      case 'new_comment':
      case 'comment_added':
        return <MessageSquare className="h-5 w-5 text-violet-600" />;
      case 'task_created':
      case 'task_assigned':
      case 'task_updated':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'task_deleted':
        return <Trash2 className="h-5 w-5 text-rose-600" />;
      default:
        return <Bell className="h-5 w-5 text-blue-600" />;
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="space-y-6 text-right max-w-5xl mx-auto" 
      dir="rtl"
    >
      {/* Header Banner */}
      <div className="bg-card border border-border/80 rounded-3xl p-6 md:p-8 shadow-300 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm shrink-0">
            <Bell className="h-7 w-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
                <span>صفحة الإشعارات والتوجيهات</span>
                <Sparkles className="h-5 w-5 text-amber-500" />
              </h1>
              {unreadCount > 0 && (
                <span className="px-3 py-0.5 rounded-full bg-rose-500 text-white text-xs font-extrabold animate-bounce shadow-sm">
                  {unreadCount} جديد
                </span>
              )}
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              تابع أحدث التنبيهات، والمهام المنسوبة إليك، وتعليقات وتوجيهات المدير في مكان واحد مستقل.
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead()}
            className="px-5 py-3 rounded-xl bg-primary text-primary-foreground text-xs font-extrabold flex items-center justify-center gap-2 hover:bg-primary/95 transition-all shadow-md active:scale-95 shrink-0 cursor-pointer"
          >
            <CheckCheck className="h-4.5 w-4.5" />
            <span>تحديد كافة الإشعارات كمقروءة</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              filter === 'all' 
                ? 'bg-primary text-primary-foreground shadow-md' 
                : 'bg-card text-muted-foreground hover:bg-muted/50 border border-border/50'
            }`}
          >
            الكل ({myNotifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              filter === 'unread' 
                ? 'bg-primary text-primary-foreground shadow-md' 
                : 'bg-card text-muted-foreground hover:bg-muted/50 border border-border/50'
            }`}
          >
            غير مقروءة ({myNotifications.filter((n: any) => !n.isRead).length})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              filter === 'read' 
                ? 'bg-primary text-primary-foreground shadow-md' 
                : 'bg-card text-muted-foreground hover:bg-muted/50 border border-border/50'
            }`}
          >
            مقروءة ({myNotifications.filter((n: any) => n.isRead).length})
          </button>
        </div>

        <Link
          href="/dashboard"
          className="text-xs font-extrabold text-primary hover:underline flex items-center gap-1 shrink-0"
        >
          <span>العودة للوحة المهام</span>
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-3xl border border-dashed border-border shadow-100">
          <MessageSquareText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-foreground">لا توجد إشعارات مطابقة</h3>
          <p className="text-xs text-muted-foreground mt-1">لم يتم العثور على أي إشعارات أو رسائل في هذا القسم حالياً.</p>
        </div>
      ) : (
        <motion.div 
          variants={listVariants}
          initial="hidden"
          animate="show"
          className="space-y-3.5"
        >
          {filteredNotifications.map((n: any) => {
            const isRead = n.isRead;
            const timeText = getArabicRelativeTime(n.createdAt);
            const targetTaskId = n.metadata?.taskId;

            return (
              <motion.div
                key={n._id}
                variants={itemVariants}
                onClick={() => !isRead && markAsRead(n._id)}
                className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isRead 
                    ? 'bg-card border-border/60 shadow-100 opacity-85 hover:opacity-100' 
                    : 'bg-primary/5 border-primary/30 shadow-200 hover:shadow-300 border-r-4 border-r-primary'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 shadow-sm ${
                    isRead ? 'bg-muted text-muted-foreground' : 'bg-primary/20 text-primary'
                  }`}>
                    {getNotifIcon(n.type, n.action)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground leading-relaxed">
                      {n.message}
                    </p>
                    <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 mt-1.5">
                      <Clock className="h-3.5 w-3.5 text-primary/70" />
                      {timeText}
                    </span>
                  </div>
                </div>

                {targetTaskId && (
                  <Link
                    href={`/tasks/${targetTaskId}`}
                    onClick={() => !isRead && markAsRead(n._id)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-extrabold text-xs hover:bg-primary/95 flex items-center justify-center gap-2 transition-all shadow-md shrink-0 group cursor-pointer"
                  >
                    <span>عرض المهمة ومراسلة المدير</span>
                    <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
                  </Link>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}
