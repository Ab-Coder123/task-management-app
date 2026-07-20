'use client';

import React from 'react';
import { TASK_PRIORITIES, TASK_STATUSES, TASK_TYPES } from '@/lib/constants';
import { Search, Filter, Layers, AlertCircle, CheckCircle2 } from 'lucide-react';

interface TaskFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  priorityFilter: string;
  setPriorityFilter: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
}

export default function TaskFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  typeFilter,
  setTypeFilter,
}: TaskFiltersProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl bg-card shadow-md  hover:shadow-200 transition-all text-right dir-rtl mb-6">

      {/* Search Input */}
      <div className="relative flex flex-col justify-end">
        <label className="block text-xs font-extrabold text-foreground mb-1.5 flex items-center gap-1.5">
          <Search className="h-3.5 w-3.5 text-primary" />
          <span>بحث عن مهمة</span>
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-muted-foreground/60">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالعنوان أو الوصف..."
            className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-background border border-border/80 text-foreground text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-right transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Filter Status */}
      <div className="flex flex-col justify-end">
        <label htmlFor="statusFilter" className="block text-xs font-extrabold text-foreground mb-1.5 flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          <span>حالة المهمة</span>
        </label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border/80 text-foreground text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all appearance-none cursor-pointer shadow-sm text-right"
        >
          <option value="" className="bg-card">⚡ جميع الحالات</option>
          {TASK_STATUSES.map((s) => (
            <option key={s.value} value={s.value} className="bg-card">
              {s.label === 'Pending' ? ' معلقة' : s.label === 'In Progress' ? ' قيد التنفيذ' : s.label === 'Completed' ? ' مكتملة' : ' متأخرة'}
            </option>
          ))}
        </select>
      </div>

      {/* Filter Priority */}
      <div className="flex flex-col justify-end">
        <label htmlFor="priorityFilter" className="block text-xs font-extrabold text-foreground mb-1.5 flex items-center gap-1.5">
          <AlertCircle className="h-3.5 w-3.5 text-rose-500" />
          <span>درجة الأهمية</span>
        </label>
        <select
          id="priorityFilter"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border/80 text-foreground text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all appearance-none cursor-pointer shadow-sm text-right"
        >
          <option value="" className="bg-card">🔥 جميع درجات الأهمية</option>
          {TASK_PRIORITIES.map((p) => (
            <option key={p.value} value={p.value} className="bg-card">
              {p.label === 'Low' ? 'منخفضة' : p.label === 'Medium' ? 'متوسطة' : p.label === 'High' ? 'عالية' : 'حرجة'}
            </option>
          ))}
        </select>
      </div>

      {/* Filter Type */}
      <div className="flex flex-col justify-end">
        <label htmlFor="typeFilter" className="block text-xs font-extrabold text-foreground mb-1.5 flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5 text-blue-500" />
          <span>نوع المهمة</span>
        </label>
        <select
          id="typeFilter"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border/80 text-foreground text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all appearance-none cursor-pointer shadow-sm text-right"
        >
          <option value="" className="bg-card">📌 جميع التصنيفات</option>
          {TASK_TYPES.map((t) => (
            <option key={t.value} value={t.value} className="bg-card">
              {t.label === 'Bug' ? 'إصلاح مشكلة (Bug)' : t.label === 'Feature' ? 'ميزة جديدة' : t.label === 'Improvement' ? 'تحسين أداء' : 'توثيق وملفات'}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
}
