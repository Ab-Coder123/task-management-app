'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CheckSquare, 
  FolderCheck, 
  Clock, 
  AlertCircle,
  Search,
  Sparkles,
  BadgeCheck,
  MessageSquare
} from 'lucide-react';
import { useTasks } from '@/lib/hooks/useTasks';
import { useUsers } from '@/lib/hooks/useUsers';
import { useAuthStore } from '@/lib/store/authStore';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { getAvatarFallback } from '@/lib/utils';
import { TaskStatus, User } from '@/lib/types';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const pageVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
};

export default function UserDashboardPage() {
  const { user } = useAuthStore();
  const { tasks, isLoading: tasksLoading, createTask, isCreating } = useTasks();
  const { users, isLoading: usersLoading } = useUsers();
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all');

  if (tasksLoading || usersLoading || !mounted) {
    return <LoadingSpinner size="lg" className="h-[60vh]" />;
  }

  // Filter tasks assigned to the logged-in user
  const myTasks = tasks.filter((t) => {
    const isAssigned = Array.isArray(t.assignedTo)
      ? t.assignedTo.some(id => (typeof id === 'string' ? id === user?._id : id?._id === user?._id))
      : t.assignedTo === user?._id;
    return isAssigned || !t.assignedTo || t.assignedTo.length === 0 || user?.role === 'admin';
  });

  // Calculate statistics metrics
  const totalMyTasks = myTasks.length;
  const completedMyTasks = myTasks.filter((t) => t.status === 'completed').length;
  const activeMyTasks = myTasks.filter((t) => t.status === 'in_progress').length;
  const overdueMyTasks = myTasks.filter((t) => t.status === 'overdue').length;

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      await createTask({
        title: newTaskTitle.trim(),
        description: 'مهمة شخصية تم إنشاؤها من لوحة التحكم السريعة.',
        status: 'pending',
        type: 'feature',
        priority: 'medium',
        assignedTo: user?._id ? [user._id] : [],
        dueDate: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
      });
      toast.success('تمت عملية الإضافة بنجاح!');
      setNewTaskTitle('');
    } catch (err) {
      console.error('Failed to create task:', err);
      toast.error('فشلت عملية إضافة المهمة.');
    }
  };

  // Filter my tasks based on search and status tabs
  const filteredTasks = myTasks.filter((task) => {
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesSearch = 
      !searchTerm || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusArabicLabel = (status: TaskStatus) => {
    switch (status) {
      case 'completed': return 'مكتملة';
      case 'in_progress': return 'قيد التنفيذ';
      case 'overdue': return 'مهمة عاجلة';
      case 'pending':
      default: return 'مهمة جديدة';
    }
  };

  const getStatusBadgeColor = (status: TaskStatus) => {
    switch (status) {
      case 'completed': 
        return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'in_progress': 
        return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'overdue': 
        return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'pending':
      default: 
        return 'text-blue-600 bg-blue-50 border-blue-100';
    }
  };

  const getArabicRelativeTime = (dateStr?: string) => {
    if (!dateStr || dateStr === 'null' || dateStr === 'undefined' || dateStr.trim() === '') return 'غير محدد';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'غير محدد';
      const diffMs = date.getTime() - Date.now();
      const diffM  = Math.floor(Math.abs(diffMs) / 60000); // minutes
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
      } else {
        if (diffM < 1) return 'الآن';
        if (diffM < 60) return `خلال ${diffM} دقيقة`;
        
        const diffH = Math.floor(diffM / 60);
        if (diffH < 24) {
          if (diffH === 1) return 'خلال ساعة';
          if (diffH === 2) return 'خلال ساعتين';
          if (diffH <= 10) return `خلال ${diffH} ساعات`;
          return `خلال ${diffH} ساعة`;
        }
        
        const diffD = Math.floor(diffH / 24);
        if (diffD === 1) return 'غداً';
        if (diffD === 2) return 'بعد يومين';
        if (diffD <= 10) return `خلال ${diffD} أيام`;
        return `خلال ${diffD} يوماً`;
      }
    } catch { return dateStr; }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="space-y-8 text-right" 
      dir="rtl"
    >
      
      {/* Title & Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2 justify-start">
            <Sparkles className="h-6 w-6 text-primary" />
            <span>لوحة المهام الرئيسية</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1.5">
            مرحباً بك يا {user?.username || 'مستخدم'}، استعرض حالة مهامك الموكلة إليك وأنجز المطلوب منك اليوم.
          </p>
        </div>
      </div>

      {/* Analytics Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Tasks */}
        <div className="rounded-xl bg-card p-5 shadow-200 hover:shadow-300 hover:-translate-y-1.5 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">المهام الموكلة</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <CheckSquare className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">{totalMyTasks}</h3>
            <p className="text-[10px] text-muted-foreground mt-1">إجمالي المهام المنسوبة إليك</p>
          </div>
        </div>

        {/* In Progress */}
        <div className="rounded-xl bg-card p-5 shadow-200 hover:shadow-300 hover:-translate-y-1.5 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">قيد العمل</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <Clock className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-foreground group-hover:text-amber-500 transition-colors duration-300">{activeMyTasks}</h3>
            <p className="text-[10px] text-muted-foreground mt-1">المهام الجاري العمل عليها</p>
          </div>
        </div>

        {/* Completed */}
        <div className="rounded-xl bg-card p-5 shadow-200 hover:shadow-300 hover:-translate-y-1.5 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">المهام المكتملة</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <FolderCheck className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-foreground group-hover:text-emerald-500 transition-colors duration-300">{completedMyTasks}</h3>
            <p className="text-[10px] text-muted-foreground mt-1">
              {totalMyTasks > 0 ? `${Math.round((completedMyTasks / totalMyTasks) * 100)}% نسبة الإنجاز` : 'لا توجد مهام'}
            </p>
          </div>
        </div>

        {/* Overdue */}
        <div className="rounded-xl bg-card p-5 shadow-200 hover:shadow-300 hover:-translate-y-1.5 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">متأخرة</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <AlertCircle className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-foreground group-hover:text-rose-500 transition-colors duration-300">{overdueMyTasks}</h3>
            <p className="text-[10px] text-rose-500 font-semibold mt-1">تتجاوز الموعد المحدد</p>
          </div>
        </div>
      </div>

      {/* Quick Add Task Banner */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-primary to-blue-600 text-white shadow-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <h2 className="text-lg font-bold">إضافة مهمة شخصية</h2>
            <p className="text-xs text-white/80 mt-1">
              أضف مهمة جديدة إلى قائمة مهامك الخاصة بسرعة وسهولة.
            </p>
          </div>

          <form onSubmit={handleQuickAdd} className="flex w-full md:w-auto items-center gap-2">
            <input 
              type="text" 
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              disabled={isCreating}
              placeholder="ما هي المهمة الجديدة؟" 
              className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-white/10 text-white placeholder-white/50 border-0 focus:outline-none focus:ring-2 focus:ring-white/40 text-right text-sm w-full md:w-80 transition-all shadow-inner"
              required
            />
            <button 
              type="submit" 
              disabled={isCreating || !newTaskTitle.trim()}
              className="px-6 py-2.5 rounded-xl bg-white text-primary font-bold hover:bg-white/95 active:scale-[0.98] transition-all text-sm disabled:opacity-60 disabled:pointer-events-none shadow-200"
            >
              {isCreating ? 'جاري الإضافة...' : 'إضافة'}
            </button>
          </form>
        </div>
      </div>

      {/* Assigned Tasks Grid with Chat Capability */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-foreground flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-primary" />
            <span>قائمة المهام الموكلة إليك (مع المراسلة والتعليقات)</span>
          </h2>
        </div>

        {/* Filter and Search Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          {/* Status Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 justify-start">
            <button
              onClick={() => setStatusFilter('all')}
              className="px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              style={statusFilter === 'all'
                ? { background: '#2563eb', color: '#fff', boxShadow: '0 4px 12px rgba(37,99,235,0.2)' }
                : { background: 'var(--card)', color: 'var(--muted-foreground)', boxShadow: '0 2px 4px rgba(75,85,99,0.06)' }}
            >
              الكل
            </button>
            <button
              onClick={() => setStatusFilter('in_progress')}
              className="px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              style={statusFilter === 'in_progress'
                ? { background: '#2563eb', color: '#fff', boxShadow: '0 4px 12px rgba(37,99,235,0.2)' }
                : { background: 'var(--card)', color: 'var(--muted-foreground)', boxShadow: '0 2px 4px rgba(75,85,99,0.06)' }}
            >
              قيد التنفيذ
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className="px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              style={statusFilter === 'completed'
                ? { background: '#2563eb', color: '#fff', boxShadow: '0 4px 12px rgba(37,99,235,0.2)' }
                : { background: 'var(--card)', color: 'var(--muted-foreground)', boxShadow: '0 2px 4px rgba(75,85,99,0.06)' }}
            >
              مكتملة
            </button>
            <button
              onClick={() => setStatusFilter('overdue')}
              className="px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              style={statusFilter === 'overdue'
                ? { background: '#2563eb', color: '#fff', boxShadow: '0 4px 12px rgba(37,99,235,0.2)' }
                : { background: 'var(--card)', color: 'var(--muted-foreground)', boxShadow: '0 2px 4px rgba(75,85,99,0.06)' }}
            >
              متأخرة
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="بحث في عنوان المهمة..."
              className="w-full pl-3 pr-9 py-2 rounded-xl bg-card text-foreground placeholder-muted-foreground/60 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-right transition-all shadow-100 border-0"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-muted-foreground/60">
              <Search className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Task Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed';
            const timeText = isCompleted && task.completedAt
              ? getArabicRelativeTime(task.completedAt)
              : getArabicRelativeTime(task.createdAt || task.dueDate);

            // Resolve assignee names from the ID array
            const assignedUsers = (task.assignedTo || []).map(id => {
              if (typeof id === 'string') {
                return users.find(u => u._id === id);
              }
              return id; // populated user object
            }).filter((u): u is User => !!u);
            
            const displayName = assignedUsers.map(u => u.username).join('، ') || 'غير معين';
            const primaryUser = assignedUsers[0];

            return (
              <div 
                key={task._id}
                className="rounded-2xl bg-card p-5 shadow-200 hover:shadow-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between border border-border/40"
              >
                <div>
                  {/* Status tag */}
                  <div className="flex items-center justify-between mb-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadgeColor(task.status)}`}>
                      • {getStatusArabicLabel(task.status)}
                    </span>
                    {task.createdBy && typeof task.createdBy === 'object' && (
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full border border-border/40 shadow-sm">
                        <span>المدير:</span>
                        {(task.createdBy as any).avatar ? (
                          <img src={(task.createdBy as any).avatar} className="h-4 w-4 rounded-full object-cover shrink-0" />
                        ) : (
                          <div className="h-4 w-4 rounded-full bg-primary/10 text-primary text-[8px] flex items-center justify-center font-extrabold uppercase shrink-0">
                            {getAvatarFallback((task.createdBy as any).username).substring(0, 1)}
                          </div>
                        )}
                        <span>{(task.createdBy as any).username}</span>
                      </div>
                    )}
                  </div>

                  {/* Task Title Link */}
                  <Link href={`/tasks/${task._id}`}>
                    <h4 className="text-[16px] font-extrabold text-foreground hover:text-primary transition-colors mb-4 line-clamp-2 leading-snug cursor-pointer">
                      {task.title}
                    </h4>
                  </Link>
                </div>

                <div>
                  {/* Footer with Assignee & Relative Time */}
                  <div className="flex items-center justify-between pt-3.5 border-t border-border/30 mt-2">
                    {/* Assignee (Stacked Avatar Group) */}
                    <div className="flex items-center gap-2 justify-start">
                      {assignedUsers.length > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center -space-x-1.5 space-x-reverse">
                            {assignedUsers.slice(0, 3).map((u) => (
                              <div key={u._id} className="relative group/avatar shrink-0">
                                {u.avatar ? (
                                  <img
                                    src={u.avatar}
                                    alt={u.username}
                                    className="h-6 w-6 rounded-full object-cover border border-card shadow-100"
                                  />
                                ) : (
                                  <div className="h-6 w-6 rounded-full bg-primary/10 border border-card text-primary text-[9px] font-bold flex items-center justify-center uppercase shadow-100">
                                    {u.username.substring(0, 2)}
                                  </div>
                                )}
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 rounded bg-black/85 text-white text-[9px] whitespace-nowrap opacity-0 group-hover/avatar:opacity-100 transition-opacity pointer-events-none z-[100] font-semibold">
                                  {u.username}
                                </div>
                              </div>
                            ))}
                            {assignedUsers.length > 3 && (
                              <div className="h-6 w-6 rounded-full bg-muted border border-card flex items-center justify-center text-[9px] font-bold text-muted-foreground shrink-0 z-0">
                                +{assignedUsers.length - 3}
                              </div>
                            )}
                          </div>
                          {/* Display username text (hidden on small mobile screens for responsive optimization) */}
                          <span className="text-xs font-semibold text-muted-foreground truncate max-w-[100px] hidden xs:inline-block">
                            {assignedUsers.map(u => u.username).join('، ')}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground/60 font-semibold">غير معين</span>
                      )}
                    </div>

                    {/* Time Indicator */}
                    <div 
                      className="flex items-center gap-1"
                      style={{ color: isCompleted ? '#10b981' : 'var(--muted-foreground)' }}
                    >
                      <Clock className="h-3.5 w-3.5" />
                      <span className="text-[11px] font-semibold">{timeText}</span>
                    </div>
                  </div>

                  {/* Action Button: View Details & Message Manager */}
                  <Link
                    href={`/tasks/${task._id}`}
                    className="w-full mt-3.5 py-2.5 px-3 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground transition-all duration-200 text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm group cursor-pointer"
                  >
                    <span>عرض التفاصيل ومراسلة المدير</span>
                    <MessageSquare className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-10 rounded-xl border border-dashed border-border bg-card/10">
            <p className="text-xs text-muted-foreground font-semibold">لا توجد مهام مطابقة لخيارات البحث الحالية.</p>
          </div>
        )}
      </div>

    </motion.div>
  );
}
