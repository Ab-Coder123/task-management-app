'use client';

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useTasks } from '@/lib/hooks/useTasks';
import { useUsers } from '@/lib/hooks/useUsers';
import { formatDate } from '@/lib/utils';
import { CheckCircle2, Search, Calendar, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAvatarFallback } from '@/lib/utils';

const AVATAR_COLORS = [
  { bg: 'rgba(99, 102, 241, 0.1)', border: 'rgba(99, 102, 241, 0.25)', text: '#4f46e5' }, // indigo
  { bg: 'rgba(236, 72, 153, 0.08)', border: 'rgba(236, 72, 153, 0.2)', text: '#db2777' }, // pink
  { bg: 'rgba(245, 158, 11, 0.08)', border: 'rgba(245, 158, 11, 0.2)', text: '#d97706' }, // amber
  { bg: 'rgba(16, 185, 129, 0.08)', border: 'rgba(16, 185, 129, 0.2)', text: '#059669' }, // emerald
  { bg: 'rgba(239, 68, 68, 0.08)', border: 'rgba(239, 68, 68, 0.2)', text: '#dc2626' }, // red
  { bg: 'rgba(59, 130, 246, 0.08)', border: 'rgba(59, 130, 246, 0.2)', text: '#2563eb' }, // blue
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

export default function AdminCompletedTasksPage() {
  const { tasks, isLoading: tasksLoading } = useTasks();
  const { users, isLoading: usersLoading } = useUsers();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [search, setSearch] = useState('');

  if (tasksLoading || usersLoading || !mounted) {
    return <LoadingSpinner size="lg" className="h-[50vh]" />;
  }

  // Filter completed tasks (excluding private tasks) and join with user profiles
  const completedTasks = tasks
    .filter((t) => !t.isPrivate && t.status === 'completed')
    .map((task) => {
      const assignedUsers = (task.assignedTo || []).map(id => {
        if (typeof id === 'string') {
          return users.find(u => u._id === id);
        }
        return id; // already User object
      }).filter((u): u is any => !!u);

      return {
        ...task,
        assignedUsers,
        primaryUser: assignedUsers[0]
      };
    })
    .filter((task) =>
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.assignedUsers.some((u) => u.username.toLowerCase().includes(search.toLowerCase()))
    );

  // Format standard date in Arabic
  const formatArabicDate = (dateStr?: string) => {
    if (!dateStr || dateStr === 'null' || dateStr === 'undefined' || dateStr.trim() === '') return 'تاريخ غير مسجل';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return 'تاريخ غير مسجل';
      return d.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return 'تاريخ غير مسجل';
    }
  };

  const formatArabicDateTime = (dateStr?: string) => {
    if (!dateStr || dateStr === 'null' || dateStr === 'undefined' || dateStr.trim() === '') return 'تاريخ غير مسجل';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return 'تاريخ غير مسجل';
      return d.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'تاريخ غير مسجل';
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
        title="المهام المنجزة"
        description="استعرض سجل المهام التي تم إنجازها بالكامل من قبل أعضاء الفريق بنجاح."
      />

      {/* Filter and Search Section */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث في عنوان المهمة أو العضو..."
            className="w-full pl-3 pr-9 py-2 rounded-xl bg-card text-foreground placeholder-muted-foreground/60 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-right transition-all shadow-100 border-0"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-muted-foreground/60">
            <Search className="h-4 w-4" />
          </div>
        </div>
      </div>

      {completedTasks.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl shadow-200">
          <p className="text-sm text-muted-foreground font-semibold">لا توجد مهام مكتملة مطابقة لخيارات البحث الحالية.</p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto rounded-2xl bg-card dark:bg-[#0f172a] dark:border-transparent shadow-300 dark:shadow-2xl p-2 sm:p-4">
          <table className="w-full min-w-[750px] text-right border-collapse">
            <thead>
              <tr className="bg-muted/30 text-xs font-bold text-muted-foreground/80 uppercase tracking-wider">
                <th className="px-6 py-4">اسم المهمة</th>
                <th className="px-6 py-4">العضو المنجز</th>
                <th className="px-6 py-4">تاريخ الإنشاء</th>
                <th className="px-6 py-4">تاريخ الإنجاز</th>
                <th className="px-6 py-4 text-left">حالة المهمة</th>
              </tr>
            </thead>
            <motion.tbody
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="divide-y divide-border/20 text-sm text-foreground"
            >
              {completedTasks.map((task) => {
                const primaryUser = task.primaryUser;
                const displayName = task.assignedUsers.map(u => u.username).join('، ') || 'غير معين';
                const ac = avatarColor(primaryUser?.username || 'غير معين');

                return (
                  <motion.tr
                    key={task._id}
                    variants={rowVariants}
                    className="border-r-4 border-r-emerald-400 bg-emerald-50/5 hover:bg-emerald-50/10 transition-colors duration-200"
                  >

                    {/* Task Name */}
                    <td className="px-6 py-4 font-bold text-foreground">
                      {task.title}
                    </td>

                    {/* Assigned User */}
                    <td className="px-6 py-4">
                      {primaryUser ? (
                        <div className="flex items-center gap-2">
                          {primaryUser.avatar ? (
                            <img
                              src={primaryUser.avatar}
                              alt="Avatar"
                              className="h-6 w-6 rounded-full object-cover shrink-0 shadow-200"
                            />
                          ) : (
                            <div
                              className="h-6 w-6 rounded-full flex items-center justify-center text-[9px] font-bold uppercase shrink-0"
                              style={{ background: ac.bg, border: `1px solid ${ac.border}`, color: ac.text }}
                            >
                              {getAvatarFallback(primaryUser.username)}
                            </div>
                          )}
                          <span className="font-semibold text-foreground text-xs flex items-center gap-1">
                            {displayName}
                            {primaryUser.role === 'admin' && (
                              <BadgeCheck className="h-4 w-4 text-blue-500 fill-blue-500/20" />
                            )}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground/60 font-semibold">غير معين</span>
                      )}
                    </td>

                    {/* Created Date */}
                    <td className="px-6 py-4 text-muted-foreground font-semibold text-xs">
                      {formatArabicDate(task.createdAt)}
                    </td>

                    {/* Completion Date */}
                    <td className="px-6 py-4 text-emerald-600 font-bold text-xs">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 opacity-80" />
                        {formatArabicDateTime(task.completedAt || task.createdAt)}
                      </span>
                    </td>

                    {/* Status Indicator */}
                    <td className="px-6 py-4 text-left">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-100">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        مكتملة
                      </span>
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
