'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Sparkles, Plus } from 'lucide-react';
import { COMPANY_TEAMS } from '@/lib/constants/departments';

export interface CreateTeamFormValues {
  name: string;
  description: string;
  departmentId: string;
  departmentName: string;
}

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  departmentId?: string;
  departmentName?: string;
  allowDepartmentPick?: boolean;
  isSubmitting?: boolean;
  initialName?: string;
  initialDescription?: string;
  onConfirm: (values: CreateTeamFormValues) => Promise<void> | void;
}

export default function CreateTeamModal({
  isOpen,
  onClose,
  departmentId = '',
  departmentName = '',
  allowDepartmentPick = false,
  isSubmitting = false,
  initialName = '',
  initialDescription = '',
  onConfirm,
}: CreateTeamModalProps) {
  const [selectedDeptId, setSelectedDeptId] = useState(
    departmentId || COMPANY_TEAMS[0].id
  );
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedDeptId(departmentId || COMPANY_TEAMS[0].id);
      setName(initialName);
      setDescription(initialDescription);
      setErrorMsg('');
    }
  }, [isOpen, departmentId, initialName, initialDescription]);

  const activeDept = COMPANY_TEAMS.find((t) => t.id === selectedDeptId);
  const resolvedDeptId = allowDepartmentPick
    ? selectedDeptId
    : departmentId || activeDept?.id || '';
  const resolvedDeptName = allowDepartmentPick
    ? activeDept?.name || departmentName
    : departmentName || activeDept?.name || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setErrorMsg('يرجى كتابة اسم فريق واضح لا يقل عن حرفين.');
      return;
    }
    if (!resolvedDeptId) {
      setErrorMsg('يرجى تحديد القسم التابع له الفريق.');
      return;
    }

    setErrorMsg('');
    try {
      await onConfirm({
        name: trimmed,
        description: description.trim(),
        departmentId: resolvedDeptId,
        departmentName: resolvedDeptName,
      });
    } catch (err: any) {
      setErrorMsg(err?.message || 'حدث خطأ أثناء إنشاء الفريق.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          dir="rtl"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: 'spring', duration: 0.38, bounce: 0.2 }}
            className="relative z-10 w-full max-w-md rounded-3xl bg-white dark:bg-[#101828] p-6 sm:p-7 shadow-[0_28px_70px_-15px_rgba(15,23,42,0.3)] dark:shadow-[0_32px_80px_-15px_rgba(0,0,0,0.85)] border border-border/70 dark:border-transparent text-right"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="إغلاق"
              className="absolute top-5 left-5 p-2 rounded-xl text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            <div className="flex items-center gap-3.5 mb-5">
              <div className="h-11 w-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Users className="h-5.5 w-5.5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-foreground">
                  إنشاء فريق جديد
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  سيتم حفظ الفريق باسمك وتعيينك قائداً له داخل المنصة
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 rounded-xl bg-rose-500/10 px-3.5 py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {allowDepartmentPick ? (
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1.5">
                    القسم التابع له الفريق
                  </label>
                  <select
                    value={selectedDeptId}
                    onChange={(e) => setSelectedDeptId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1120] border border-border/70 dark:border-transparent text-foreground text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/40 text-right"
                  >
                    {COMPANY_TEAMS.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-xl bg-primary/10 px-3.5 py-2.5 text-xs font-bold text-primary">
                  <Sparkles className="h-3.5 w-3.5 shrink-0" />
                  <span>القسم: {resolvedDeptName}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1.5">
                  اسم الفريق الجديد <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: فريق البشمهندس هشام للواجهات"
                  autoFocus
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0b1120] border border-border/80 dark:border-transparent text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-right transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1.5">
                  وصف مختصر (اختياري)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="تخصص الفريق أو نطاق المهام التي يديرها..."
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0b1120] border border-border/80 dark:border-transparent text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-right resize-none transition-all"
                />
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-xl bg-muted/60 dark:bg-slate-800 text-xs font-bold text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim()}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold transition-all shadow-md shadow-blue-600/20 disabled:opacity-50 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>{isSubmitting ? 'جاري الإنشاء...' : 'اعتماد وإنشاء الفريق'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
