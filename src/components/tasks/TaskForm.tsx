'use client';

import React, { useState } from 'react';
import { Task, User } from '@/lib/types';
import { TASK_PRIORITIES, TASK_STATUSES, TASK_TYPES } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { Check, BadgeCheck, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';

interface TaskFormProps {
  initialValues?: Partial<Task>;
  onSubmit: (data: Partial<Task>) => void;
  users: User[];
  isLoading?: boolean;
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

export default function TaskForm({
  initialValues,
  onSubmit,
  users,
  isLoading = false,
}: TaskFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [type, setType] = useState(initialValues?.type || 'feature');
  const [priority, setPriority] = useState(initialValues?.priority || 'medium');
  const [status, setStatus] = useState(initialValues?.status || 'pending');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPrivate, setIsPrivate] = useState(initialValues?.isPrivate || false);

  // Normalize initial values for assignedTo as an array
  const [assignedTo, setAssignedTo] = useState<string[]>(() => {
    if (Array.isArray(initialValues?.assignedTo)) {
      return initialValues.assignedTo.map(item => (typeof item === 'string' ? item : item._id));
    } else if (initialValues?.assignedTo && typeof initialValues.assignedTo === 'string') {
      return [initialValues.assignedTo];
    }
    return [];
  });

  // Format standard date input YYYY-MM-DD
  const [dueDate, setDueDate] = useState(() => {
    if (initialValues?.dueDate) {
      return initialValues.dueDate.substring(0, 10);
    }
    return '';
  });

  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setFormError(null);
      if (!title || !description || assignedTo.length === 0 || !dueDate) {
        setFormError('من فضلك املأ جميع الحقول المطلوبة واختر منفذاً على الأقل.');
        return;
      }
      await onSubmit({
        title,
        description,
        type,
        priority,
        status,
        assignedTo,
        isPrivate,
        dueDate: new Date(dueDate).toISOString(),
      });
    } catch (error: any) {
      const msg = error?.message || 'فشل حفظ المهمة. حاول مرة أخرى.';
      setFormError(msg);
      console.error('Failed to save task', error);
    }
  };

  const approvedUsers = users;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-5xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl text-right" dir="rtl">
      
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h3 className="text-lg font-extrabold text-foreground flex items-center gap-2">
          📋 إعداد تفاصيل وتعيين المهمة
        </h3>
        <p className="text-xs text-muted-foreground font-semibold mt-1">
          أدخل عنوان ووصف المهمة بدقة، ثم حدد المسؤولين من الفريق وتاريخ التسليم المحدد.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <div className="lg:col-span-7 bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 space-y-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-extrabold text-foreground border-b border-slate-200 dark:border-slate-700/60 pb-3">
            <span className="w-2 h-2 rounded-full bg-primary inline-block" />
            <span>البيانات الأساسية للمهمة</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              اسم المهمة <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-right shadow-sm"
              placeholder="مثال: تطوير صفحة تسجيل الدخول الجديدة..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              وصف المهمة والخطوات المطلوبة <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={8}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-right resize-none shadow-sm min-h-[230px]"
              placeholder="أدخل تفاصيل المهمة، قائمة التحقق، أو أي تعليمات خاصة بالفريق..."
            />
          </div>
        </div>

        <div className="lg:col-span-5 bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 space-y-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-extrabold text-foreground border-b border-slate-200 dark:border-slate-700/60 pb-3">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            <span>التصنيف وتعيين المسؤولين</span>
          </div>

          <div className="relative">
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              الموكل إليهم (أعضاء الفريق) <span className="text-rose-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 text-foreground text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-right cursor-pointer min-h-[46px] shadow-sm"
            >
              <span>
                {assignedTo.length === 0
                  ? '🔍 اضغط لاختيار أعضاء الفريق...'
                  : `✅ تم اختيار ${assignedTo.length} أعضاء`}
              </span>
              {assignedTo.length > 0 && (
                <div className="flex items-center -space-x-1.5 space-x-reverse">
                  {assignedTo.slice(0, 3).map((id) => {
                    const user = approvedUsers.find(u => u._id === id);
                    if (!user) return null;
                    const ac = avatarColor(user.username);
                    return user.avatar ? (
                      <img key={user._id} src={user.avatar} className="h-5 w-5 rounded-full border border-card object-cover shrink-0 shadow-sm" />
                    ) : (
                      <div key={user._id} className="h-5 w-5 rounded-full flex items-center justify-center text-[7px] font-bold border border-card uppercase shrink-0" style={{ background: ac.bg, color: ac.text }}>
                        {getAvatarFallback(user.username)}
                      </div>
                    );
                  })}
                  {assignedTo.length > 3 && (
                    <div className="h-5 w-5 rounded-full bg-muted border border-card flex items-center justify-center text-[7px] font-bold text-muted-foreground shrink-0">
                      +{assignedTo.length - 3}
                    </div>
                  )}
                </div>
              )}
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsDropdownOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-40 left-0 right-0 mt-2 p-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl max-h-60 overflow-y-auto space-y-1 text-right"
                  >
                    {approvedUsers.map((user) => {
                      const isSelected = assignedTo.includes(user._id);
                      const ac = avatarColor(user.username);
                      return (
                        <button
                          key={user._id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setAssignedTo(assignedTo.filter(id => id !== user._id));
                            } else {
                              setAssignedTo([...assignedTo, user._id]);
                            }
                          }}
                          className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold text-right transition-all hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ${
                            isSelected ? 'bg-primary/10 text-primary font-bold' : 'text-foreground'
                          }`}
                        >
                          <div className={`h-4.5 w-4.5 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                            isSelected ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/30'
                          }`}>
                            {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                          </div>
                          
                          {user.avatar ? (
                            <img src={user.avatar} className="h-7 w-7 rounded-full object-cover shrink-0 shadow-sm" />
                          ) : (
                            <div className="h-7 w-7 rounded-full flex items-center justify-center text-[9px] font-bold uppercase shrink-0" style={{ background: ac.bg, border: `1px solid ${ac.border}`, color: ac.text }}>
                              {getAvatarFallback(user.username)}
                            </div>
                          )}
                          
                          <div className="flex flex-col grow select-none text-right">
                            <span className="font-bold text-foreground flex items-center gap-1.5 justify-start">
                              {user.username}
                              {user.role === 'admin' && (
                                <BadgeCheck className="h-4 w-4 text-blue-500 fill-blue-500/10 shrink-0" />
                              )}
                            </span>
                            <span className="text-[10px] text-muted-foreground/80">{user.email}</span>
                          </div>
                        </button>
                      );
                    })}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="w-full">
            <label htmlFor="taskType" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
              نوع المهمة
            </label>
            <select
              id="taskType"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 text-foreground text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all appearance-none text-right cursor-pointer shadow-sm"
            >
              {TASK_TYPES.map((t) => (
                <option key={t.value} value={t.value} className="bg-white dark:bg-[#0f172a] text-foreground">
                  {t.label === 'Bug' ? 'إصلاح مشكلة (Bug)' : t.label === 'Feature' ? 'ميزة جديدة' : t.label === 'Improvement' ? 'تحسين أداء' : 'توثيق وملفات'}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label htmlFor="taskPriority" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                الأهمية
              </label>
              <select 
                id="taskPriority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 text-foreground text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all appearance-none text-right cursor-pointer shadow-sm"
              >
                {TASK_PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value} className="bg-white dark:bg-[#0f172a] text-foreground">
                    {p.label === 'Low' ? 'منخفضة' : p.label === 'Medium' ? 'متوسطة' : p.label === 'High' ? 'عالية' : 'حرجة'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="taskStatus" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                حالة المهمة الحالية
              </label>
              <select
                id="taskStatus"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 text-foreground text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all appearance-none text-right cursor-pointer shadow-sm"
              >
                {TASK_STATUSES.map((s) => (
                  <option key={s.value} value={s.value} className="bg-white dark:bg-[#0f172a] text-foreground">
                    {s.label === 'Pending' ? ' معلقة' : s.label === 'In Progress' ? ' قيد التنفيذ' : s.label === 'Completed' ? ' مكتملة' : ' متأخرة'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
              تاريخ الاستحقاق <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 text-foreground text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-right cursor-pointer shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2.5 pt-2 justify-start bg-white dark:bg-[#0f172a] p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <input 
              type="checkbox"
              id="isPrivate"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20 shrink-0 cursor-pointer"
            />
            <label htmlFor="isPrivate" className="text-xs font-bold text-foreground select-none cursor-pointer">
              مهمة خاصة <span className="text-[10px] text-muted-foreground font-normal">(تظهر للمسؤول والمنشئ فقط)</span>
            </label>
          </div>
        </div>

      </div>

      {formError && (
        <div className="mx-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm font-semibold text-right">
          ⚠️ {formError}
        </div>
      )}

      <div className="flex items-center justify-end space-x-4 space-x-reverse pt-6 border-t border-slate-200 dark:border-slate-800 mt-4">
        <button
          type="button"
          onClick={() => router.push('/admin/tasks')}
          className="px-6 py-3 rounded-xl text-muted-foreground bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold transition-all cursor-pointer"
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-extrabold text-xs hover:bg-primary/95 transition-all shadow-lg shadow-primary/25 disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center gap-2"
        >
          {isLoading ? 'جاري الحفظ...' : 'حفظ ونشر المهمة'}
        </button>
      </div>

    </form>
  );
}
