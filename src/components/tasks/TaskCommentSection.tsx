'use client';

import React, { useState } from 'react';
import { useComments } from '@/lib/hooks/useComments';
import { getAvatarFallback, formatDate } from '@/lib/utils';
import { Send, Trash2, BadgeCheck, MessageSquareText, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface TaskCommentSectionProps {
  taskId: string;
  userId: string;
  username: string;
  taskTitle: string;
  isAdmin?: boolean;
}

const AVATAR_TONES = [
  'bg-blue-500/15 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300',
  'bg-violet-500/15 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300',
  'bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300',
  'bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  'bg-rose-500/15 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300',
];

function getTone(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_TONES[Math.abs(hash) % AVATAR_TONES.length];
}

function formatRelativeCommentTime(dateStr?: string) {
  if (!dateStr) return 'الآن';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'الآن';
    const diffMin = Math.floor((Date.now() - date.getTime()) / 60000);
    if (diffMin < 1) return 'الآن';
    if (diffMin < 60) return `منذ ${diffMin} د`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `منذ ${diffH} س`;
    return formatDate(dateStr, 'dd MMM • hh:mm a');
  } catch {
    return 'الآن';
  }
}

export default function TaskCommentSection({
  taskId,
  userId,
  username,
  taskTitle,
  isAdmin = false,
}: TaskCommentSectionProps) {
  const { comments, addComment, deleteComment, isLoading } = useComments(taskId);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submitComment = async () => {
    if (!commentText.trim() || submitting) return;
    setSubmitting(true);
    try {
      await addComment({
        taskId,
        userId,
        content: commentText.trim(),
        username,
        taskTitle,
      });
      setCommentText('');
      toast.success('تمت إضافة تعليقك.');
    } catch (err) {
      console.error('Failed to add comment', err);
      toast.error('تعذر إرسال التعليق. حاول مرة أخرى.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitComment();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      submitComment();
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      toast.success('تم حذف التعليق.');
    } catch {
      toast.error('تعذر حذف التعليق.');
    }
  };

  return (
    <div className="space-y-5 text-right" dir="rtl">
      {/* Header Status Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            <MessageSquareText className="h-3.5 w-3.5" />
            <span>{comments.length} {comments.length === 1 ? 'تعليق' : 'تعليقات'}</span>
          </span>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>مزامنة تلقائية للمحادثة</span>
        </span>
      </div>

      {/* Messages Feed */}
      <div className="rounded-2xl bg-slate-50/90 dark:bg-[#0b1120]/80 p-4 sm:p-5 space-y-4 max-h-[460px] overflow-y-auto shadow-inner">
        {isLoading ? (
          <div className="space-y-3 py-4">
            <div className="h-16 rounded-2xl bg-muted/50 animate-pulse w-3/4" />
            <div className="h-16 rounded-2xl bg-muted/40 animate-pulse w-2/3 mr-auto" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-10">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <MessageSquareText className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-foreground">لا توجد تعليقات حتى الآن</p>
            <p className="mt-1 text-xs text-muted-foreground">
              ابدأ النقاش حول هذه المهمة مع قائد الفريق والأعضاء.
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            <div className="space-y-4">
              {comments.map((comment) => {
                const userObj = comment.userId && typeof comment.userId === 'object' ? comment.userId : null;
                const authorId = userObj?._id || comment.authorId || (typeof comment.userId === 'string' ? comment.userId : '');
                const name = comment.authorName || userObj?.username || 'مستخدم غير معروف';
                const role = comment.authorRole || userObj?.role || 'user';
                const avatar = userObj?.avatar;
                const isOwn = Boolean(userId && authorId && authorId.toString() === userId.toString());
                const isLeader = role === 'admin';
                const canDelete = isAdmin || isOwn;

                return (
                  <motion.div
                    key={comment._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-start gap-3 group ${isOwn ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    {/* Avatar */}
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={name}
                        className="h-9 w-9 shrink-0 rounded-full object-cover shadow-sm"
                      />
                    ) : (
                      <div
                        className={`h-9 w-9 shrink-0 rounded-full text-xs font-extrabold flex items-center justify-center uppercase shadow-sm ${getTone(name)}`}
                      >
                        {getAvatarFallback(name)}
                      </div>
                    )}

                    {/* Bubble */}
                    <div
                      className={`max-w-[84%] sm:max-w-[78%] rounded-2xl px-4 py-3 transition-all ${
                        isOwn
                          ? 'bg-blue-600/10 dark:bg-blue-600/20 text-foreground rounded-tr-sm shadow-sm'
                          : isLeader
                          ? 'bg-violet-500/10 dark:bg-violet-500/15 text-foreground rounded-tl-sm shadow-sm'
                          : 'bg-white dark:bg-[#101828] text-foreground rounded-tl-sm shadow-[0_6px_20px_-6px_rgba(15,23,42,0.08)] dark:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.6)]'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-extrabold text-foreground">
                            {name}
                          </span>
                          {isLeader && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-300">
                              <BadgeCheck className="h-3 w-3" />
                              <span>قائد الفريق</span>
                            </span>
                          )}
                          {isOwn && !isLeader && (
                            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                              أنت
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            title={formatDate(comment.createdAt, 'PPp')}
                            className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground"
                          >
                            <Clock className="h-3 w-3 opacity-70" />
                            <span>{formatRelativeCommentTime(comment.createdAt)}</span>
                          </span>

                          {canDelete && (
                            <button
                              type="button"
                              onClick={() => handleDelete(comment._id)}
                              className="p-1 rounded-lg text-rose-500/80 hover:text-rose-600 hover:bg-rose-500/15 sm:opacity-0 sm:group-hover:opacity-100 transition-all cursor-pointer"
                              title="حذف التعليق"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line break-words">
                        {comment.content}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}
      </div>

      {/* Add Comment Composer */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-slate-50 dark:bg-[#0b1120] p-3 sm:p-4 shadow-sm space-y-3"
      >
        <textarea
          rows={3}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="اكتب تعليقك أو تحديث العمل هنا..."
          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#101828] border border-border/60 dark:border-transparent text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-right resize-none shadow-sm"
        />
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-medium text-muted-foreground hidden sm:inline">
            اضغط Ctrl + Enter للإرسال السريع
          </span>
          <button
            type="submit"
            disabled={submitting || !commentText.trim()}
            className="mr-auto flex items-center gap-2 px-5 py-2.5 text-xs font-extrabold rounded-xl bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-blue-600/20 cursor-pointer"
          >
            <Send className="h-3.5 w-3.5" />
            <span>{submitting ? 'جاري الإرسال...' : 'إرسال التعليق'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
