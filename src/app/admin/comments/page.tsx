'use client';

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useAdminComments } from '@/lib/hooks/useComments';
import { formatDate } from '@/lib/utils';
import { Trash2, MessageSquare, Search, Calendar, Link2, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAvatarFallback } from '@/lib/utils';
import { toast } from 'sonner';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const pageVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
};

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
            email: userObj?.email || ''
          };
        })
        .filter((u: any) => u._id)
        .map((u: any) => [u._id, u])
    ).values()
  );

  // Filter Comments
  const filteredComments = comments.filter((comment: any) => {
    const taskObj = comment.taskId && typeof comment.taskId === 'object' ? comment.taskId : null;
    const userObj = comment.userId && typeof comment.userId === 'object' ? comment.userId : null;

    const taskTitle = taskObj?.Name_task || '';
    const authorName = comment.authorName || userObj?.username || '';
    const authorEmail = userObj?.email || '';
    const taskId = taskObj?._id || '';
    const authorId = userObj?._id || comment.authorId || '';

    // Search Query (Task Title, User Name, User Email)
    const matchesSearch =
      taskTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      authorEmail.toLowerCase().includes(searchQuery.toLowerCase());

    // Task Filter
    const matchesTask = !taskFilter || taskId === taskFilter;

    // User Filter
    const matchesUser = !userFilter || authorId === userFilter;

    // Date Filter (YYYY-MM-DD comparison)
    let matchesDate = true;
    if (dateFilter) {
      const commentDate = new Date(comment.createdAt).toISOString().split('T')[0];
      matchesDate = commentDate === dateFilter;
    }

    return matchesSearch && matchesTask && matchesUser && matchesDate;
  });

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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="space-y-6 text-right"
      dir="rtl"
    >
      <PageHeader
        title="إدارة ورقابة التعليقات"
        description="استعرض نقاشات المهام وقنوات التواصل للمشاريع المشتركة التي قمت بإنشائها، وقم بالتحكم وإدارة التعليقات."
      />

      {/* ── Search & Filters Panel ── */}
      <div className="bg-card  rounded-3xl p-5 md:p-6 shadow-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative w-full">
          <label className="block text-[11px] font-bold text-muted-foreground mb-1.5 mr-1">البحث بالنص</label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="ابحث بعنوان المهمة، العضو، الإيميل..."
              className="w-full pl-3 pr-9 py-2.5 rounded-2xl text-xs bg-muted/20 text-foreground placeholder-muted-foreground/50 border border-border/80 focus:outline-none focus:ring-2 focus:ring-primary/25 text-right transition-all"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Search className="h-3.5 w-3.5 text-muted-foreground/50" />
            </div>
          </div>
        </div>

        {/* Task Filter */}
        <div>
          <label className="block text-[11px] font-bold text-muted-foreground mb-1.5 mr-1">تصفية حسب المهمة</label>
          <div className="relative">
            <select
              value={taskFilter}
              onChange={e => setTaskFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-2xl text-xs bg-muted/20 text-foreground border border-border/80 focus:outline-none focus:ring-2 focus:ring-primary/25 text-right cursor-pointer"
            >
              <option value="">كل المهام المشتركة</option>
              {uniqueTasks.map((t: any) => (
                <option key={t._id} value={t._id}>{t.Name_task || 'مهمة مجهولة'}</option>
              ))}
            </select>
          </div>
        </div>

        {/* User Filter */}
        <div>
          <label className="block text-[11px] font-bold text-muted-foreground mb-1.5 mr-1">تصفية حسب العضو</label>
          <div className="relative">
            <select
              value={userFilter}
              onChange={e => setUserFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-2xl text-xs bg-muted/20 text-foreground border border-border/80 focus:outline-none focus:ring-2 focus:ring-primary/25 text-right cursor-pointer"
            >
              <option value="">كل أعضاء الفريق</option>
              {uniqueUsers.map((u: any) => (
                <option key={u._id} value={u._id}>{u.username}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Filter */}
        <div>
          <label className="block text-[11px] font-bold text-muted-foreground mb-1.5 mr-1">تاريخ الإرسال المحدد</label>
          <div className="relative">
            <input
              type="date"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="w-full pl-3 pr-9 py-2.5 rounded-2xl text-xs bg-muted/20 text-foreground border border-border/80 focus:outline-none focus:ring-2 focus:ring-primary/25 text-right cursor-pointer"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground/50" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Table/Logs Stream ── */}
      {filteredComments.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-3xl shadow-200 border border-border/50">
          <MessageSquare className="h-10 w-10 text-muted-foreground/45 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground font-semibold">لا توجد تعليقات مطابقة لخيارات التصفية الحالية.</p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto rounded-3xl bg-card dark:bg-[#0f172a] shadow-300 dark:shadow-2xl border border-border/60 dark:border-transparent">
          <table className="w-full min-w-[800px] text-right border-collapse">
            <thead>
              <tr className="bg-muted/30 text-xs font-bold text-muted-foreground/80 uppercase tracking-wider border-b border-border/40">
                <th className="px-6 py-4.5">كاتب التعليق</th>
                <th className="px-6 py-4.5">سياق المهمة</th>
                <th className="px-6 py-4.5">محتوى التعليق</th>
                <th className="px-6 py-4.5">منشئ المهمة (المدير)</th>
                <th className="px-6 py-4.5">تاريخ الإرسال</th>
                <th className="px-6 py-4.5 text-left">الإجراءات</th>
              </tr>
            </thead>
            <motion.tbody
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="divide-y divide-border/20 text-sm text-foreground"
            >
              {filteredComments.map((comment: any) => {
                const userObj = comment.userId && typeof comment.userId === 'object' ? comment.userId : null;
                const taskObj = comment.taskId && typeof comment.taskId === 'object' ? comment.taskId : null;

                const displayName = comment.authorName || userObj?.username || 'مستخدم غير معروف';
                const role = comment.authorRole || userObj?.role || 'user';

                const taskCreator = taskObj?.createdBy && typeof taskObj.createdBy === 'object' ? taskObj.createdBy.username : 'المدير';

                return (
                  <motion.tr
                    key={comment._id}
                    variants={rowVariants}
                    className="hover:bg-muted/10 transition-colors duration-200"
                  >
                    {/* User profile */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {userObj?.avatar ? (
                          <img
                            src={userObj.avatar}
                            alt="Avatar"
                            className="h-8 w-8 rounded-full object-cover shadow-100"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-primary/15 border border-primary/20 text-xs font-bold text-primary flex items-center justify-center uppercase shrink-0">
                            {getAvatarFallback(displayName)}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground text-xs flex items-center gap-1">
                            {displayName}
                            {role === 'admin' && (
                              <BadgeCheck className="h-4 w-4 text-blue-500 fill-blue-500/20" />
                            )}
                          </span>
                          <span className="text-[10px] text-muted-foreground/75 font-semibold mt-0.5">{userObj?.email || ''}</span>
                        </div>
                      </div>
                    </td>

                    {/* Task context */}
                    <td className="px-6 py-4">
                      {taskObj ? (
                        <Link
                          href={`/tasks/${taskObj._id}`}
                          className="font-bold text-primary text-xs hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Link2 className="h-3 w-3 shrink-0" />
                          <span>{taskObj.Name_task}</span>
                        </Link>
                      ) : (
                        <span className="text-xs text-muted-foreground font-semibold">مهمة غير متوفرة</span>
                      )}
                    </td>

                    {/* Comment Content */}
                    <td className="px-6 py-4 max-w-xs truncate text-muted-foreground text-xs font-semibold leading-relaxed">
                      {comment.content}
                    </td>

                    {/* Task Creator (Admin) */}
                    <td className="px-6 py-4 font-semibold text-foreground/80 text-xs">
                      {taskCreator}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-xs font-semibold text-muted-foreground">
                      {formatArabicDateTime(comment.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-left">
                      <button
                        onClick={() => handleDelete(comment._id)}
                        className="p-2 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all shadow-100"
                        title="حذف التعليق"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </td>

                  </motion.tr>
                );
              })}
            </motion.tbody>
          </table>
        </div>
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
