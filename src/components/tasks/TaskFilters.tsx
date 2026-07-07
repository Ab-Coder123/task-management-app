'use client';

import React from 'react';
import { TASK_PRIORITIES, TASK_STATUSES, TASK_TYPES } from '@/lib/constants';
import { Search } from 'lucide-react';

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl bg-card shadow-200 text-right dir-rtl mb-6">
      
      {/* Search Input */}
      <div className="relative flex flex-col justify-end">
        <label className="block text-xs font-bold text-muted-foreground mb-1.5">
          بحث
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-muted-foreground/60">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن عنوان المهمة..."
            className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-card text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/25 text-right transition-all shadow-100 border-0"
          />
        </div>
      </div>

      {/* Filter Status */}
      <div className="flex flex-col justify-end">
        <label htmlFor="statusFilter" className="block text-xs font-bold text-muted-foreground mb-1.5">
          الحالة
        </label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl bg-card text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/25 transition-all appearance-none cursor-pointer shadow-100 border-0 text-right"
        >
          <option value="">جميع الحالات</option>
          {TASK_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filter Priority */}
      <div className="flex flex-col justify-end">
        <label htmlFor="priorityFilter" className="block text-xs font-bold text-muted-foreground mb-1.5">
          الأهمية
        </label>
        <select
          id="priorityFilter"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl bg-card text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/25 transition-all appearance-none cursor-pointer shadow-100 border-0 text-right"
        >
          <option value="">جميع درجات الأهمية</option>
          {TASK_PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filter Type */}
      <div className="flex flex-col justify-end">
        <label htmlFor="typeFilter" className="block text-xs font-bold text-muted-foreground mb-1.5">
          نوع المهمة
        </label>
        <select
          id="typeFilter"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl bg-card text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/25 transition-all appearance-none cursor-pointer shadow-100 border-0 text-right"
        >
          <option value="">جميع الأنواع</option>
          {TASK_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
}
