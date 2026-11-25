'use client';

import React, { useState, useEffect, Suspense } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useAdminComments } from '@/lib/hooks/useComments';
import { getAvatarFallback } from '@/lib/utils';
import {
  Trash2,
  MessageSquare,
  Search,
  Calendar,
  Link2,
  BadgeCheck,
  X,
  ArrowUpLeft,
  Clock,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const pageVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 120, damping: 16 },
  },
};

function AdminCommentsContent() {
  const searchParams = useSearchParams();
  const initialTaskId = searchParams.get('taskId') || '';

  const { comments, isLoading, deleteComment } = useAdminComments();
  const [mounted, setMounted] = useState(false);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [taskFilter, setTaskFilter] = useState(initialTaskId);
  const [userFilter, setUserFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (initialTaskId) {
      setTaskFilter(initialTaskId);
    }
  }, [initialTaskId]);

  if (isLoading || !mounted) {
    return <LoadingSpinner size="lg" className="h-[50vh]" />;
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteComment(id);
      toast.success('تم حذف التعليق بنجاح.');
    } catch (err) {
      console.error('Delete comment failed', err);
      toast.error('فشلت عملية حذف التعليق.');
    }
  };

  // Extract unique tasks & users for filters
  const uniqueTasks = Array.from(
    new Map(
      comments
        .map((c: any) => c.taskId)
        .filter(Boolean)
        .map((t: any) => [t._id || t, t])
    ).values()
  );

  const uniqueUsers = Array.from(
    new Map(
      comments
        .map((c: any) => {
          const userObj = c.userId && typeof c.userId === 'object' ? c.userId : null;
          return {
            _id: userObj?._id || c.authorId,
            username: c.authorName || userObj?.username || 'مستخدم مجهول',
            email: userObj?.email || '',
          };
        })
        .filter((u: any) => u._id)
        .map((u: any) => [u._id, u])
    ).values()
  );

  const filteredComments = comments.filter((comment: any) => {
    const taskObj = comment.taskId && typeof comment.taskId === 'object' ? comment.taskId : null;
    const userObj = comment.userId && typeof comment.userId === 'object' ? comment.userId : null;

    const taskTitle = taskObj?.Name_task || '';
    const authorName = comment.authorName || userObj?.username || '';
    const authorEmail = userObj?.email || '';
    const contentText = comment.content || '';
    const taskId = taskObj?._id || '';
    const authorId = userObj?._id || comment.authorId || '';

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      taskTitle.toLowerCase().includes(q) ||
      authorName.toLowerCase().includes(q) ||
      authorEmail.toLowerCase().includes(q) ||
      contentText.toLowerCase().includes(q);

    const matchesTask = !taskFilter || taskId === taskFilter;
    const matchesUser = !userFilter || authorId === userFilter;

    let matchesDate = true;
    if (dateFilter) {
      const commentDate = new Date(comment.createdAt).toISOString().split('T')[0];
      matchesDate = commentDate === dateFilter;
    }

    return matchesSearch && matchesTask && matchesUser && matchesDate;
  });

  const hasActiveFilters = Boolean(searchQuery || taskFilter || userFilter || dateFilter);

  const clearFilters = () => {
    setSearchQuery('');
    setTaskFilter('');
    setUserFilter('');
    setDateFilter('');
  };

  const formatArabicDateTime = (dateStr?: string) => {
    if (!dateStr || dateStr === 'null' || dateStr === 'undefined' || dateStr.trim() === '') {
      return 'تاريخ غير محدد';
    }
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return 'تاريخ غير محدد';
      return d.toLocaleDateString('ar-EG', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'تاريخ غير محدد';
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="space-y-6 text-right"
      dir="rtl"
    >
      <PageHeader
        title="سجل التعليقات والمناقشات"
        description="تابع جميع تعليقات أعضاء فريقك على المهام ورد عليها أو أدرها من مكان واحد."
        action={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-primary/10 px-3.5 py-2 text-xs font-extrabold text-primary">
              <MessageSquare className="h-4 w-4" />
              <span>{filteredComments.length} تعليق</span>
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1 rounded-xl bg-muted px-3 py-2 text-xs font-bold text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
                <span>مسح الفلاتر</span>
              </button>
            )}
          </div>
        }
      />

      {/* Search & Filters Panel */}
      <div className="bg-card dark:bg-[#101828] rounded-3xl p-5 md:p-6 shadow-200 dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative w-full">
          <label className="block text-[11px] font-bold text-muted-foreground mb-1.5 mr-1">البحث بالنص</label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في التعليق، المهمة، العضو..."
              className="w-full pl-3 pr-9 py-2.5 rounded-2xl text-xs bg-muted/30 dark:bg-[#0b1120] text-foreground placeholder-muted-foreground/50 border border-border/70 dark:border-transparent focus:outline-none focus:ring-2 focus:ring-primary/30 text-right transition-all"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Search className="h-3.5 w-3.5 text-muted-foreground/50" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-muted-foreground mb-1.5 mr-1">تصفية حسب المهمة</label>
          <select
            value={taskFilter}
            onChange={(e) => setTaskFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-2xl text-xs bg-muted/30 dark:bg-[#0b1120] text-foreground border border-border/70 dark:border-transparent focus:outline-none focus:ring-2 focus:ring-primary/30 text-right cursor-pointer"
          >
            <option value="">كل المهام المشتركة</option>
            {uniqueTasks.map((t: any) => (
              <option key={t._id} value={t._id}>
                {t.Name_task || 'مهمة مجهولة'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-muted-foreground mb-1.5 mr-1">تصفية حسب العضو</label>
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-2xl text-xs bg-muted/30 dark:bg-[#0b1120] text-foreground border border-border/70 dark:border-transparent focus:outline-none focus:ring-2 focus:ring-primary/30 text-right cursor-pointer"
          >
            <option value="">كل أعضاء الفريق</option>
            {uniqueUsers.map((u: any) => (
              <option key={u._id} value={u._id}>
                {u.username}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-muted-foreground mb-1.5 mr-1">تاريخ الإرسال المحدد</label>
          <div className="relative">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-3 pr-9 py-2.5 rounded-2xl text-xs bg-muted/30 dark:bg-[#0b1120] text-foreground border border-border/70 dark:border-transparent focus:outline-none focus:ring-2 focus:ring-primary/30 text-right cursor-pointer"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground/50" />
            </div>
          </div>
        </div>
      </div>

      {/* Comments Card Feed */}
      {filteredComments.length === 0 ? (
        <div className="text-center py-16 bg-card dark:bg-[#101828] rounded-3xl shadow-200 dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)]">
          <MessageSquare className="h-10 w-10 text-muted-foreground/45 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground font-semibold">
            لا توجد تعليقات مطابقة لخيارات التصفية الحالية.
          </p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-4"
        >
          {filteredComments.map((comment: any) => {
            const userObj = comment.userId && typeof comment.userId === 'object' ? comment.userId : null;
            const taskObj = comment.taskId && typeof comment.taskId === 'object' ? comment.taskId : null;
            const displayName = comment.authorName || userObj?.username || 'مستخدم غير معروف';
            const role = comment.authorRole || userObj?.role || 'user';

            return (
              <motion.div
                key={comment._id}
                variants={cardVariants}
                className="rounded-2xl bg-card dark:bg-[#101828] p-5 sm:p-6 shadow-200 dark:shadow-[0_18px_45px_-14px_rgba(0,0,0,0.6)] hover:shadow-300 transition-all space-y-4"
              >
                {/* Top Author & Meta Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {userObj?.avatar ? (
                      <img
                        src={userObj.avatar}
                        alt={displayName}
                        className="h-10 w-10 rounded-full object-cover shadow-100 shrink-0"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary/15 text-xs font-extrabold text-primary flex items-center justify-center uppercase shrink-0">
                        {getAvatarFallback(displayName)}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-foreground text-sm">
                          {displayName}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            role === 'admin'
                              ? 'bg-blue-500/15 text-blue-600 dark:text-blue-300'
                              : 'bg-slate-500/10 text-muted-foreground'
                          }`}
                        >
                          {role === 'admin' && <BadgeCheck className="h-3 w-3" />}
                          <span>{role === 'admin' ? 'قائد الفريق' : 'عضو فريق'}</span>
                        </span>
                      </div>
                      {userObj?.email && (
                        <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">
                          {userObj.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold">
                    <Clock className="h-3.5 w-3.5 opacity-70" />
                    <span>{formatArabicDateTime(comment.createdAt)}</span>
                  </div>
                </div>

                {/* Full Comment Body */}
                <div className="rounded-2xl bg-slate-50 dark:bg-[#0b1120]/90 px-4 py-3.5 text-sm text-foreground/95 leading-relaxed whitespace-pre-line break-words">
                  {comment.content}
                </div>

                {/* Bottom Task Link & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  {taskObj ? (
                    <Link
                      href={`/tasks/${taskObj._id}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/15 transition-colors"
                    >
                      <Link2 className="h-3.5 w-3.5 shrink-0" />
                      <span>المهمة: {taskObj.Name_task}</span>
                    </Link>
                  ) : (
                    <span className="text-xs text-muted-foreground font-semibold">مهمة غير متوفرة</span>
                  )}

                  <div className="flex items-center gap-2 mr-auto">
                    {taskObj && (
                      <Link
                        href={`/tasks/${taskObj._id}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600/10 px-3.5 py-2 text-xs font-bold text-blue-600 dark:text-blue-300 hover:bg-blue-600/20 transition-colors"
                      >
                        <span>الانتقال للمهمة والرد</span>
                        <ArrowUpLeft className="h-3.5 w-3.5" />
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(comment._id)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-rose-500/10 px-3.5 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                      title="حذف التعليق"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>حذف</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}

export default function AdminCommentsPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" className="h-[50vh]" />}>
      <AdminCommentsContent />
    </Suspense>
  );
}
