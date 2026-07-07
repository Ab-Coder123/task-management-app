'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CheckSquare, 
  FolderCheck, 
  AlertCircle,
  Plus,
  Search,
  Clock,
  Sparkles,
  BarChart2,
  MoreVertical,
  Edit3,
  RotateCcw,
  CheckCircle2,
  BadgeCheck,
} from 'lucide-react';
import { useUsers } from '@/lib/hooks/useUsers';
import { useTasks } from '@/lib/hooks/useTasks';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { getAvatarFallback } from '@/lib/utils';
import { TaskStatus, User } from '@/lib/types';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/store/authStore';
import { useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '@/lib/api/notifications';
import { motion } from 'framer-motion';
import { playSuccessSound } from '@/lib/utils/sound';

/* ─── Avatar palette: each user gets a consistent light color scheme ─── */
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

export default function AdminDashboardPage() {
  const queryClient = useQueryClient();
  const { users, isLoading: usersLoading } = useUsers();
  const { tasks, isLoading: tasksLoading } = useTasks();
  const { user: currentUser } = useAuthStore();
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [announcementText, setAnnouncementText] = useState('');
  const [isSendingAnnouncement, setIsSendingAnnouncement] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all');

  if (usersLoading || tasksLoading || !mounted) {
    return <LoadingSpinner size="lg" className="h-[60vh]" />;
  }

  const totalTasks     = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const activeTasks    = tasks.filter(t => t.status === 'in_progress').length;
  const overdueTasks   = tasks.filter(t => t.status === 'overdue').length;

  const handleSendAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    setIsSendingAnnouncement(true);
    try {
      await notificationsApi.addNotification({
        type: 'new_user',
        message: announcementText.trim(),
        metadata: { username: currentUser?.username || 'مدير النظام' }
      });
      
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('تم إرسال الرسالة العامة لجميع الأعضاء!');
      playSuccessSound();
      setAnnouncementText('');
    } catch (err) { 
      console.error(err); 
      toast.error('فشلت عملية إرسال الرسالة العامة.');
    } finally {
      setIsSendingAnnouncement(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchStatus = statusFilter === 'all' || task.status === statusFilter;
    
    // Resolve assignee names for search
    const assignedUserNames = (task.assignedTo || []).map(id => {
      if (typeof id === 'string') {
        const u = users.find(user => user._id === id);
        return u ? u.username : '';
      }
      return id?.username || '';
    }).filter(Boolean);

    const matchSearch = !searchTerm
      || task.title.toLowerCase().includes(searchTerm.toLowerCase())
      || assignedUserNames.some(name => name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchStatus && matchSearch;
  });

  const statusLabel = (s: TaskStatus) =>
    ({ completed: 'مكتملة', in_progress: 'قيد التنفيذ', overdue: 'متأخرة', pending: 'جديدة' }[s] ?? 'جديدة');

  const statusStyle = (s: TaskStatus) => ({
    completed:  { dot: '#10b981', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    in_progress:{ dot: '#f59e0b', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
    overdue:    { dot: '#ef4444', badge: 'bg-rose-50 text-rose-700 border-rose-200' },
    pending:    { dot: '#3b82f6', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  }[s] ?? { dot: '#3b82f6', badge: 'bg-blue-50 text-blue-700 border-blue-200' });

  const relativeTime = (dateStr: string) => {
    if (!dateStr) return 'غير محدد';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
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

  const stats = [
    { label: 'إجمالي المهام', value: totalTasks,     sub: 'المسجلة في النظام حالياً', Icon: CheckSquare, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { label: 'قيد التنفيذ',   value: activeTasks,    sub: 'يعمل عليها الفريق الآن',       Icon: BarChart2,   iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
    { label: 'مكتملة',        value: completedTasks, sub: totalTasks > 0 ? `${Math.round(completedTasks/totalTasks*100)}% من المهام الكلية` : 'لا توجد مهام', Icon: FolderCheck, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
    { label: 'متأخرة',        value: overdueTasks,   sub: 'تطلب إجراءً فورياً',           Icon: AlertCircle, iconBg: 'bg-rose-50', iconColor: 'text-rose-600', subColor: 'text-rose-500 font-semibold' },
  ];

  const filterTabs: { label: string; value: 'all' | TaskStatus }[] = [
    { label: 'الكل', value: 'all' },
    { label: 'قيد التنفيذ', value: 'in_progress' },
    { label: 'مكتملة', value: 'completed' },
    { label: 'متأخرة', value: 'overdue' },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="space-y-6 text-right"
      dir="rtl"
    >

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2.5">
          <Sparkles className="h-6 w-6 text-primary" />
          لوحة تحكم المسؤول
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          مرحباً بك، استعرض حالة المهام والتقارير وأضف تحديثات جديدة لفريقك.
        </p>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div
            key={s.label}
            className="rounded-2xl bg-card p-5 shadow-200 hover:shadow-300 hover:-translate-y-1.5 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 cursor-default group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground">{s.label}</span>
              <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${s.iconBg} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                <s.Icon className={`h-4.5 w-4.5 ${s.iconColor}`} />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors duration-300">{s.value}</p>
              <p className={`text-[10px] ${s.subColor || 'text-muted-foreground'} mt-1`}>{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Quick Add Banner (General Message Broadcast) ── */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden shadow-300"
        style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 60%, #3b82f6 100%)' }}
      >
        <div className="absolute -left-8 -top-8 h-36 w-36 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute right-0 bottom-0 h-28 w-28 rounded-full bg-white/5 pointer-events-none translate-x-1/3 translate-y-1/3" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <h2 className="text-lg font-bold text-white">إرسال رسالة عامة للجميع</h2>
            <p className="text-sm text-white/75 mt-1 max-w-sm">
              أرسل تنبيهاً أو تحديثاً سريعاً يظهر لجميع أعضاء الفريق في الإشعارات الخاصة بهم.
            </p>
          </div>
          <form onSubmit={handleSendAnnouncement} className="flex w-full md:w-auto items-center gap-2">
            <input
              type="text" 
              value={announcementText} 
              disabled={isSendingAnnouncement}
              onChange={e => setAnnouncementText(e.target.value)}
              placeholder="اكتب رسالتك العامة هنا..."
              className="flex-1 md:w-80 px-4 py-2.5 rounded-xl text-sm bg-white/10 text-white placeholder-white/50 border-0 focus:outline-none focus:ring-2 focus:ring-white/25 text-right transition-all shadow-inner"
              required
            />
            <button
              type="submit" 
              disabled={isSendingAnnouncement || !announcementText.trim()}
              className="px-5 py-2.5 rounded-xl bg-white text-blue-600 text-sm font-bold hover:bg-white/95 active:scale-95 transition-all disabled:opacity-50 shadow-200 whitespace-nowrap"
            >
              {isSendingAnnouncement ? 'جاري الإرسال...' : 'إرسال'}
            </button>
          </form>
        </div>
      </div>

      {/* ── Filter Row ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">

        {/* Filter pills – RIGHT side */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {filterTabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className="px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200"
              style={statusFilter === tab.value
                ? { background: '#2563eb', color: '#fff', boxShadow: '0 4px 12px rgba(37,99,235,0.2)' }
                : { background: 'var(--card)', color: 'var(--muted-foreground)', boxShadow: '0 2px 4px rgba(75,85,99,0.06)' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search – LEFT side */}
        <div className="relative w-full sm:w-64">
          <input
            type="text" 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="بحث باسم المستخدم أو المهمة..."
            className="w-full pl-3 pr-9 py-2 rounded-xl text-xs bg-card text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/25 text-right transition-all shadow-100 border-0"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Search className="h-3.5 w-3.5 text-muted-foreground/50" />
          </div>
        </div>
      </div>

      {/* ── Task Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTasks.map(task => {
          const ss          = statusStyle(task.status);
          const isCompleted = task.status === 'completed';
          const isOverdue   = task.status === 'overdue';
          const CardIcon    = isCompleted ? CheckCircle2 : isOverdue ? RotateCcw : Edit3;
          const iconColor   = isCompleted ? 'text-emerald-500' : isOverdue ? 'text-amber-500' : 'text-blue-500';
          
          // Resolve assignee names from the ID array
          const assignedUsers = (task.assignedTo || []).map(id => {
            if (typeof id === 'string') {
              return users.find(u => u._id === id);
            }
            return id; // populated User object
          }).filter((u): u is User => !!u);
          
          const displayName = assignedUsers.map(u => u.username).join('، ') || 'غير معين';
          const primaryUser = assignedUsers[0];
          const ac = avatarColor(primaryUser?.username || 'غير معين');
          
          // Display the time ago since creation or completion, instead of due date
          const timeText    = isCompleted && task.completedAt
            ? relativeTime(task.completedAt) 
            : relativeTime(task.createdAt || task.dueDate);

          return (
            <div
              key={task._id}
              className="rounded-2xl p-5 flex flex-col gap-3.5 group bg-card shadow-200 hover:shadow-300 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 cursor-default"
            >
              {/* ── Top: badge (right) + icon (left) ── */}
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${ss.badge}`}>
                  <span
                    className="h-1.5 w-1.5 rounded-full animate-pulse"
                    style={{ background: ss.dot }}
                  />
                  {statusLabel(task.status)}
                </span>

                <div
                  className="h-7 w-7 rounded-lg flex items-center justify-center bg-muted/40 opacity-60 group-hover:opacity-100 transition-all"
                >
                  {isOverdue
                    ? <MoreVertical className="h-4 w-4 text-muted-foreground" />
                    : <CardIcon className={`h-4 w-4 ${iconColor}`} />}
                </div>
              </div>

              {/* ── Title ── */}
              <h4 className="text-[15px] font-bold text-foreground/90 line-clamp-2 leading-snug">
                {task.title}
              </h4>

              {/* ── Footer ── */}
              <div
                className="flex items-center justify-between pt-3 mt-auto"
              >
                {/* Assignee */}
                <div className="flex items-center gap-2">
                  {primaryUser?.avatar ? (
                    <img
                      src={primaryUser.avatar}
                      alt="Avatar"
                      className="h-7 w-7 rounded-full object-cover shadow-200"
                    />
                  ) : (
                    <div
                      className="h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold uppercase shrink-0"
                      style={{ background: ac.bg, border: `1.5px solid ${ac.border}`, color: ac.text }}
                    >
                      {getAvatarFallback(displayName)}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    {displayName}
                    {primaryUser?.role === 'admin' && (
                      <BadgeCheck className="h-4 w-4 text-blue-500 fill-blue-500/20" />
                    )}
                  </span>
                </div>

                {/* Time */}
                <div
                  className="flex items-center gap-1"
                  style={{ color: isCompleted ? '#10b981' : 'var(--muted-foreground)' }}
                >
                  {isCompleted
                    ? <CheckCircle2 className="h-3.5 w-3.5" />
                    : <Clock className="h-3.5 w-3.5" />}
                  <span className="text-[11px] font-semibold">{timeText}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTasks.length === 0 && (
        <div
          className="text-center py-16 rounded-2xl"
        >
          <p className="text-sm text-muted-foreground font-semibold">لا توجد مهام مطابقة للبحث الحالي.</p>
        </div>
      )}
    </motion.div>
  );
}
