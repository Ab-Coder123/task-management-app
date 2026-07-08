'use client';

import React, { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import TaskCommentSection from '@/components/tasks/TaskCommentSection';
import { useTasks } from '@/lib/hooks/useTasks';
import { useUsers } from '@/lib/hooks/useUsers';
import { useAuthStore } from '@/lib/store/authStore';
import { getPriorityColor, getStatusColor, getTypeLabel, formatDate, getAvatarFallback } from '@/lib/utils';
import { Calendar, User as UserIcon, Clock, CheckCircle2, ChevronRight, Tag, List, Check, X, FileText, Sparkles, MessageSquare } from 'lucide-react';
import { User, TaskStatus } from '@/lib/types';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const pageVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
};

export default function TaskDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;

  const { user: currentUser } = useAuthStore();
  const { 
    tasks, 
    isLoading: tasksLoading, 
    completeTask,
    addChecklistItem,
    toggleChecklistItem,
    deleteChecklistItem
  } = useTasks();
  const { users, isLoading: usersLoading } = useUsers();

  const [checklistItemText, setChecklistItemText] = useState('');

  if (tasksLoading || usersLoading) {
    return <LoadingSpinner size="lg" className="h-[60vh]" />;
  }

  // Find target task details
  const task = tasks.find((t) => t._id === taskId);

  if (!task) {
    return (
      <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border max-w-lg mx-auto mt-10 shadow-100" dir="rtl">
        <FileText className="h-14 w-14 text-muted-foreground/30 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-foreground">المهمة غير موجودة</h3>
        <p className="text-xs text-muted-foreground mt-1">عذراً، المهمة التي تحاول الوصول إليها غير متاحة أو تم حذفها.</p>
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-primary mt-6 hover:underline text-xs font-bold bg-primary/10 px-5 py-2.5 rounded-xl">
          <ChevronRight className="h-4 w-4" />
          <span>العودة إلى لوحة المهام</span>
        </Link>
      </div>
    );
  }

  // Find assignee user profiles
  const assignedUsers = (task.assignedTo || []).map(id => {
    if (typeof id === 'string') {
      return users.find(u => u._id === id);
    }
    return id;
  }).filter((u): u is User => !!u);

  const isCompleted = task.status === 'completed';
  const showChecklist = currentUser?.role !== 'admin';

  const handleComplete = async () => {
    try {
      await completeTask({ id: task._id, username: currentUser?.username || 'User' });
    } catch (err) {
      console.error('Task complete update failed', err);
    }
  };

  const handleAddChecklist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checklistItemText.trim()) return;
    try {
      await addChecklistItem({ taskId: task._id, text: checklistItemText.trim() });
      setChecklistItemText('');
    } catch (err) {
      console.error('Failed to add checklist item', err);
    }
  };

  const handleToggleChecklist = async (itemId: string) => {
    try {
      await toggleChecklistItem({ taskId: task._id, itemId });
    } catch (err) {
      console.error('Failed to toggle checklist item', err);
    }
  };

  const handleDeleteChecklist = async (itemId: string) => {
    try {
      await deleteChecklistItem({ taskId: task._id, itemId });
    } catch (err) {
      console.error('Failed to delete checklist item', err);
    }
  };

  const getStatusArabicLabel = (status: TaskStatus) => {
    switch (status) {
      case 'completed': return 'مكتملة';
      case 'in_progress': return 'قيد التنفيذ';
      case 'overdue': return 'متأخرة';
      case 'pending':
      default: return 'معلقة';
    }
  };

  const getPriorityArabicLabel = (priority: string) => {
    switch (priority) {
      case 'low': return 'منخفضة';
      case 'medium': return 'متوسطة';
      case 'high': return 'عالية';
      case 'critical': return 'حرجة';
      default: return priority;
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="space-y-6 text-right max-w-6xl mx-auto" 
      dir="rtl"
    >
      {/* Top Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border/60 shadow-100">
        <Link
          href={currentUser?.role === 'admin' ? '/admin/tasks' : '/dashboard'}
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-muted-foreground hover:text-primary transition-colors bg-muted/40 hover:bg-primary/10 px-4 py-2 rounded-xl w-fit"
        >
          <ChevronRight className="h-4 w-4" />
          <span>العودة إلى لوحة المهام</span>
        </Link>

        {!isCompleted && (
          <button
            onClick={handleComplete}
            className="flex items-center justify-center space-x-1.5 space-x-reverse px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/10 transition-all cursor-pointer w-full sm:w-auto"
          >
            <CheckCircle2 className="h-4.5 w-4.5" />
            <span>تحديد المهمة كمكتملة</span>
          </button>
        )}
      </div>

      {/* Task Header Title Box */}
      <div className="bg-card border border-border/80 rounded-3xl p-6 md:p-8 shadow-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm shrink-0 mt-1">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`text-[11px] font-extrabold px-3 py-0.5 rounded-full border ${getStatusColor(task.status)}`}>
                  • {getStatusArabicLabel(task.status)}
                </span>
                <span className={`text-[11px] font-extrabold px-3 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}>
                  أولوية: {getPriorityArabicLabel(task.priority)}
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight leading-snug">
                {task.title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Details (Right 2 cols) vs Parameters (Left 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Main Content Column (2 spans) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Main Description Panel */}
          <div className="bg-card border border-border/80 rounded-3xl p-6 md:p-8 space-y-4 shadow-200">
            <h3 className="text-base font-extrabold text-foreground flex items-center gap-2 border-b border-border/40 pb-3">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <span>نظرة عامة على المهمة والتفاصيل</span>
            </h3>
            <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap bg-muted/20 p-5 rounded-2xl border border-border/40">
              {task.description || 'لا توجد تفاصيل إضافية مضافة لهذه المهمة.'}
            </div>
          </div>

          {/* Private Checklist Panel */}
          {showChecklist && (
            <div className="bg-card border border-border/80 rounded-3xl p-6 md:p-8 space-y-4 shadow-200 text-right" dir="rtl">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
                  <List className="h-5 w-5 text-primary" />
                  <span>قائمة المهام الفرعية الخاصة بك (Checklist)</span>
                </h3>
                <span className="text-[10px] font-bold text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full border border-border/50">
                  خاصة بك فقط 🔒
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                هذه القائمة سرية وتساعدك على تتبع خطوات العمل الخاصة بك، ولا يمكن للمدير أو الأعضاء الآخرين رؤية عناصرها.
              </p>

              {/* Add checklist input */}
              <form onSubmit={handleAddChecklist} className="flex gap-2.5 pt-1">
                <input
                  type="text"
                  value={checklistItemText}
                  onChange={(e) => setChecklistItemText(e.target.value)}
                  placeholder="أضف خطوة عمل جديدة لقائمتك..."
                  className="grow px-4 py-3 rounded-xl bg-muted/30 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-right border border-border/60 shadow-inner"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-extrabold text-xs hover:bg-primary/95 transition-all shadow-md shrink-0 cursor-pointer active:scale-95"
                >
                  إضافة
                </button>
              </form>

              {/* Checklist items list */}
              <div className="space-y-2.5 mt-4">
                {task.privateChecklist && task.privateChecklist.length > 0 ? (
                  task.privateChecklist.map((item) => (
                    <div
                      key={item._id}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                        item.completed ? 'bg-muted/30 border-border/40 opacity-75' : 'bg-card border-border/80 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <button
                          type="button"
                          onClick={() => handleToggleChecklist(item._id)}
                          className={`h-6 w-6 rounded-lg border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                            item.completed
                              ? 'bg-primary border-primary text-primary-foreground shadow-sm'
                              : 'border-border hover:border-primary/60 bg-muted/20'
                          }`}
                        >
                          {item.completed && <Check className="h-4 w-4 stroke-[3]" />}
                        </button>
                        <span
                          className={`text-xs font-bold ${
                            item.completed
                              ? 'line-through text-muted-foreground'
                              : 'text-foreground'
                          }`}
                        >
                          {item.text}
                        </span>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => handleDeleteChecklist(item._id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-all cursor-pointer shrink-0"
                        title="حذف البند"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-muted/10 rounded-2xl border border-dashed border-border/60">
                    <p className="text-xs text-muted-foreground font-bold">
                      لا توجد بنود مضافة لقائمتك الخاصة حتى الآن.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Comment Section Panel */}
          <div className="bg-card border border-border/80 rounded-3xl p-6 md:p-8 shadow-200">
            <div className="border-b border-border/40 pb-4 mb-6">
              <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <span>المحادثة والتعليقات مع الإدارة</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                يمكنك هنا تبادل التعليقات، ورفع التحديثات، والتواصل المباشر مع المدير بخصوص هذه المهمة.
              </p>
            </div>
            <TaskCommentSection
              taskId={task._id}
              userId={currentUser?._id || ''}
              username={currentUser?.username || ''}
              taskTitle={task.title}
              isAdmin={currentUser?.role === 'admin'}
            />
          </div>

        </div>

        {/* Sidebar Parameters Column (1 span) */}
        <div className="space-y-6">
          <div className="bg-card border border-border/80 rounded-3xl p-6 md:p-8 shadow-200 space-y-6">
            <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2 border-b border-border/40 pb-3">
              <Tag className="h-4.5 w-4.5 text-primary" />
              <span>تفاصيل وبنود المهمة</span>
            </h3>

            <div className="space-y-5">
              {/* Status */}
              <div className="flex justify-between items-center text-xs font-bold border-b border-border/30 pb-3.5">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary/70" />
                  <span>الحالة الحالية</span>
                </span>
                <span className={`px-3 py-1 rounded-full border text-[11px] font-extrabold ${getStatusColor(task.status)}`}>
                  {getStatusArabicLabel(task.status)}
                </span>
              </div>

              {/* Priority */}
              <div className="flex justify-between items-center text-xs font-bold border-b border-border/30 pb-3.5">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Tag className="h-4 w-4 text-amber-500/80" />
                  <span>مستوى الأولوية</span>
                </span>
                <span className={`px-3 py-1 rounded-full border text-[11px] font-extrabold ${getPriorityColor(task.priority)}`}>
                  {getPriorityArabicLabel(task.priority)}
                </span>
              </div>

              {/* Type */}
              <div className="flex justify-between items-center text-xs font-bold border-b border-border/30 pb-3.5">
                <span className="text-muted-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500/80" />
                  <span>تصنيف المهمة</span>
                </span>
                <span className="text-[11px] font-extrabold text-foreground bg-muted/50 px-3 py-1 rounded-xl border border-border/60">
                  {getTypeLabel(task.type)}
                </span>
              </div>

              {/* Due Date */}
              <div className="flex justify-between items-center text-xs font-bold border-b border-border/30 pb-3.5">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-emerald-500/80" />
                  <span>تاريخ التسليم</span>
                </span>
                <span className="font-extrabold text-foreground text-xs bg-muted/30 px-3 py-1 rounded-xl border border-border/40">
                  {formatDate(task.dueDate)}
                </span>
              </div>

              {/* Created By Admin (Assigned by) */}
              {task.createdBy && (
                <div className="flex justify-between items-center text-xs font-bold border-b border-border/30 pb-3.5">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-primary/70" />
                    <span>تم التعيين بواسطة</span>
                  </span>
                  <div className="flex items-center gap-1.5 bg-primary/5 px-2.5 py-1 rounded-xl border border-primary/20">
                    {typeof task.createdBy === 'object' && (task.createdBy as any).avatar ? (
                      <img 
                        src={(task.createdBy as any).avatar} 
                        className="h-5 w-5 rounded-full object-cover shrink-0" 
                      />
                    ) : (
                      <div className="h-5 w-5 rounded-full bg-primary/10 text-[9px] font-bold text-primary flex items-center justify-center uppercase shrink-0">
                        {getAvatarFallback(typeof task.createdBy === 'object' ? (task.createdBy as any).username : 'Admin')}
                      </div>
                    )}
                    <span className="text-[11px] font-extrabold text-foreground">
                      {typeof task.createdBy === 'object' ? (task.createdBy as any).username : 'Admin'}
                    </span>
                  </div>
                </div>
              )}

              {/* Assignees list */}
              <div className="flex flex-col gap-3 pt-1">
                <span className="text-muted-foreground flex items-center gap-2 text-xs font-bold">
                  <UserIcon className="h-4 w-4 text-violet-500/80" />
                  <span>المعينون لتنفيذ المهمة</span>
                </span>
                <div className="flex flex-wrap gap-2 mt-0.5">
                  {assignedUsers.map((u) => (
                    <div key={u._id} className="flex items-center gap-2 bg-muted/40 px-3 py-1.5 rounded-xl border border-border/60 shadow-sm">
                      {u.avatar ? (
                        <img src={u.avatar} className="h-6 w-6 rounded-full object-cover shrink-0 shadow-sm" />
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-extrabold text-primary flex items-center justify-center uppercase shrink-0">
                          {u.username.substring(0, 2)}
                        </div>
                      )}
                      <span className="font-extrabold text-foreground text-xs">{u.username}</span>
                    </div>
                  ))}
                  {assignedUsers.length === 0 && (
                    <span className="text-xs text-muted-foreground font-bold bg-muted/20 px-3 py-1.5 rounded-xl border border-dashed border-border/50 w-full text-center">
                      غير معين لأحد
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
