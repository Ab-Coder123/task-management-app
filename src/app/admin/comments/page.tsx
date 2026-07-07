'use client';

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useComments } from '@/lib/hooks/useComments';
import { useTasks } from '@/lib/hooks/useTasks';
import { useUsers } from '@/lib/hooks/useUsers';
import { formatDate } from '@/lib/utils';
import { Trash2, CheckCircle, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAvatarFallback } from '@/lib/utils';
import { toast } from 'sonner';

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

export default function AdminCommentsPage() {
  const { tasks, isLoading: tasksLoading } = useTasks();
  const { users, isLoading: usersLoading } = useUsers();
  const { deleteComment, updateComment } = useComments();
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (tasksLoading || usersLoading || !mounted) {
    return <LoadingSpinner size="lg" className="h-[50vh]" />;
  }

  // Aggregate comments from all tasks
  const allComments = tasks.flatMap((task) => {
    const commentsList = (task as any).comments || [];
    return commentsList.map((comment: any) => ({
      ...comment,
      task,
      user: users.find((u) => u._id === comment.userId),
    }));
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteComment(id);
      toast.success('تم حذف التعليق بنجاح.');
    } catch (err) {
      console.error('Delete comment failed', err);
      toast.error('فشلت عملية حذف التعليق.');
    }
  };

  const handleMarkReviewed = async (id: string) => {
    try {
      await updateComment({ id, isReviewed: true });
      toast.success('تمت مراجعة واعتماد التعليق بنجاح!');
    } catch (err) {
      console.error('Review update failed', err);
      toast.error('فشلت عملية اعتماد مراجعة التعليق.');
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
        description="استعرض نقاشات المهام وقنوات التواصل بين أعضاء الفريق، راجع السجلات، وتحكم في صلاحيات ظهور التعليقات."
      />

      {allComments.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl shadow-200">
          <MessageSquare className="h-10 w-10 text-muted-foreground/45 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground font-semibold">لا توجد تعليقات مرسلة من قبل أعضاء الفريق بعد.</p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto rounded-2xl bg-card shadow-300">
          <table className="w-full min-w-[750px] text-right border-collapse">
            <thead>
              <tr className="bg-muted/30 text-xs font-bold text-muted-foreground/80 uppercase tracking-wider">
                <th className="px-6 py-4.5">العضو</th>
                <th className="px-6 py-4.5">سياق المهمة</th>
                <th className="px-6 py-4.5">محتوى التعليق</th>
                <th className="px-6 py-4.5">تاريخ الإرسال</th>
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
              {allComments.map((comment) => {
                const displayName = comment.user?.username || 'مستحدم غير معروف';
                const ac = avatarColor(displayName);

                return (
                  <motion.tr 
                    key={comment._id} 
                    variants={rowVariants}
                    className="hover:bg-muted/20 transition-colors duration-200"
                  >
                    
                    {/* User profile */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold uppercase shrink-0"
                          style={{ background: ac.bg, border: `1.5px solid ${ac.border}`, color: ac.text }}
                        >
                          {getAvatarFallback(displayName)}
                        </div>
                        <span className="font-bold text-foreground text-xs">{displayName}</span>
                      </div>
                    </td>
                    
                    {/* Task context */}
                    <td className="px-6 py-4 font-bold text-primary text-xs">
                      {comment.task?.title || 'مهمة مجهولة'}
                    </td>
                    
                    {/* Comment Content */}
                    <td className="px-6 py-4 max-w-xs truncate text-muted-foreground text-xs font-semibold">
                      {comment.content}
                    </td>
                    
                    {/* Date */}
                    <td className="px-6 py-4 text-xs font-semibold text-muted-foreground">
                      {formatArabicDateTime(comment.createdAt)}
                    </td>
                    
                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-100 ${
                        comment.isReviewed 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                          : 'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        {comment.isReviewed ? 'تمت مراجعتها' : 'قيد الانتظار'}
                      </span>
                    </td>
                    
                    {/* Actions */}
                    <td className="px-6 py-4 text-left">
                      <div className="flex items-center justify-start gap-1.5">
                        {!comment.isReviewed && (
                          <button
                            onClick={() => handleMarkReviewed(comment._id)}
                            className="p-2 rounded-xl text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-all shadow-100"
                            title="تأكيد المراجعة"
                          >
                            <CheckCircle className="h-4.5 w-4.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(comment._id)}
                          className="p-2 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all shadow-100"
                          title="حذف التعليق"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
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
