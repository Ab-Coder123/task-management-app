'use client';

import React from 'react';
import { Task, User } from '@/lib/types';
import { getPriorityColor, getStatusColor, getTypeLabel, formatDate } from '@/lib/utils';
import { Edit2, Trash2, CheckCircle2, BadgeCheck } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface TaskTableProps {
  tasks: (Task & { assignedUsers?: User[] })[];
  onDelete: (id: string) => void;
  onComplete?: (id: string) => void;
}

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

const getAvatarFallback = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 }
  }
};

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 120, damping: 14 } 
  }
};

export default function TaskTable({ tasks, onDelete, onComplete }: TaskTableProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 bg-card rounded-2xl shadow-200">
        <p className="text-sm text-muted-foreground font-semibold">لا توجد مهام مطابقة لخيارات البحث.</p>
      </div>
    );
  }

  // Format standard date in Arabic
  const formatArabicDate = (dateStr?: string) => {
    if (!dateStr || dateStr === 'null' || dateStr === 'undefined' || dateStr.trim() === '') return 'تاريخ غير محدد';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return 'تاريخ غير حدد';
      return d.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return 'تاريخ غير محدد';
    }
  };

  const getPriorityLabelArabic = (p: string) => {
    return { low: 'منخفضة', medium: 'متوسطة', high: 'عالية', critical: 'حرجة' }[p] ?? 'متوسطة';
  };

  const getStatusLabelArabic = (s: string) => {
    return { pending: 'معلقة', in_progress: 'قيد التنفيذ', completed: 'مكتملة', overdue: 'متأخرة' }[s] ?? 'معلقة';
  };

  // Get color accent and light tint according to Task Type
  const getTypeTheme = (type: string) => {
    switch (type) {
      case 'bug':
        return { accent: 'border-r-4 border-r-rose-400 bg-rose-50/10 hover:bg-rose-50/20', labelBg: 'bg-rose-50 text-rose-700 border-rose-100' };
      case 'improvement':
        return { accent: 'border-r-4 border-r-amber-400 bg-amber-50/10 hover:bg-amber-50/20', labelBg: 'bg-amber-50 text-amber-700 border-amber-100' };
      case 'documentation':
        return { accent: 'border-r-4 border-r-slate-400 bg-slate-50/10 hover:bg-slate-50/20', labelBg: 'bg-slate-50 text-slate-700 border-slate-100' };
      case 'feature':
      default:
        return { accent: 'border-r-4 border-r-blue-400 bg-blue-50/10 hover:bg-blue-50/20', labelBg: 'bg-blue-50 text-blue-700 border-blue-100' };
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-2xl bg-card shadow-300">
      <table className="w-full min-w-[850px] text-right border-collapse">
        <thead>
          <tr className="bg-muted/30 text-xs font-bold text-muted-foreground/80 uppercase tracking-wider">
            <th className="px-6 py-4.5">المهمة</th>
            <th className="px-6 py-4.5">الموكل إليهم</th>
            <th className="px-6 py-4.5">النوع</th>
            <th className="px-6 py-4.5">الأهمية</th>
            <th className="px-6 py-4.5">تاريخ الاستحقاق</th>
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
          {tasks.map((task) => {
            const theme = getTypeTheme(task.type);
            const assignedUsers = task.assignedUsers || [];

            return (
              <motion.tr 
                key={task._id} 
                variants={rowVariants}
                className={`transition-all duration-200 ${theme.accent}`}
              >

                {/* Task Title & Details */}
                <td className="px-6 py-4">
                  <div className="min-w-[180px]">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-foreground line-clamp-1">{task.title}</p>
                      {task.isPrivate && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground border">خاص</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground font-semibold line-clamp-1 mt-1">{task.description}</p>
                  </div>
                </td>

                {/* Stacked avatar list of assignees */}
                <td className="px-6 py-4">
                  {assignedUsers.length > 0 ? (
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center -space-x-2 space-x-reverse">
                        {assignedUsers.slice(0, 3).map((user) => {
                          const displayName = user.username;
                          const ac = avatarColor(displayName);
                          return (
                            <div key={user._id} className="relative group shrink-0">
                              {user.avatar ? (
                                <img
                                  src={user.avatar}
                                  alt={displayName}
                                  className="h-7 w-7 rounded-full object-cover border-2 border-card shadow-200"
                                />
                              ) : (
                                <div 
                                  className="h-7 w-7 rounded-full flex items-center justify-center text-[9px] font-bold uppercase border-2 border-card"
                                  style={{ background: ac.bg, border: `1px solid ${ac.border}`, color: ac.text }}
                                >
                                  {getAvatarFallback(displayName)}
                                </div>
                              )}
                              {/* Tooltip */}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded bg-black/80 text-white text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[100] font-semibold">
                                {displayName}
                              </div>
                            </div>
                          );
                        })}
                        {assignedUsers.length > 3 && (
                          <div className="h-7 w-7 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[9px] font-bold text-muted-foreground shrink-0 z-0">
                            +{assignedUsers.length - 3}
                          </div>
                        )}
                      </div>
                      <span className="font-semibold text-foreground text-xs max-w-[150px] truncate line-clamp-1 hidden md:inline-block">
                        {assignedUsers.map(u => u.username).join('، ')}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground/60 font-semibold">غير معين</span>
                  )}
                </td>

                {/* Type tag */}
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-100 ${theme.labelBg}`}>
                    {getTypeLabel(task.type)}
                  </span>
                </td>

                {/* Priority tag */}
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border shadow-100 ${getPriorityColor(task.priority)}`}>
                    {getPriorityLabelArabic(task.priority)}
                  </span>
                </td>

                {/* Due Date */}
                <td className="px-6 py-4 font-semibold text-muted-foreground text-xs">
                  {formatArabicDate(task.dueDate)}
                </td>

                {/* Status badge */}
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border shadow-100 ${getStatusColor(task.status)}`}>
                    {getStatusLabelArabic(task.status)}
                  </span>
                </td>

                {/* Action buttons */}
                <td className="px-6 py-4 text-left">
                  <div className="flex items-center justify-start gap-1.5">
                    <Link
                      href={`/admin/tasks/${task._id}/edit`}
                      className="p-2 rounded-xl text-muted-foreground bg-muted/40 hover:bg-muted hover:text-foreground transition-all shadow-100"
                      title="تعديل المهمة"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Link>
                    {task.status !== 'completed' && onComplete && (
                      <button
                        onClick={() => onComplete(task._id)}
                        className="p-2 rounded-xl text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-all shadow-100"
                        title="إكمال المهمة"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(task._id)}
                      className="p-2 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all shadow-100"
                      title="حذف المهمة"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>

              </motion.tr>
            );
          })}
        </motion.tbody>
      </table>
    </div>
  );
}
