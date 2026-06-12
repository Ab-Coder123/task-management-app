'use client';

import React, { useState } from 'react';
import { Task, User } from '@/lib/types';
import { TASK_PRIORITIES, TASK_STATUSES, TASK_TYPES } from '@/lib/constants';
import { useRouter } from 'next/navigation';

interface TaskFormProps {
  initialValues?: Partial<Task>;
  onSubmit: (data: Partial<Task>) => void;
  users: User[];
  isLoading?: boolean;
}

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
  const [assignedTo, setAssignedTo] = useState(initialValues?.assignedTo || '');
  // Format standard date input YYYY-MM-DD
  const [dueDate, setDueDate] = useState(() => {
    if (initialValues?.dueDate) {
      return initialValues.dueDate.substring(0, 10);
    }
    return '';
  });

  const handleSubmit = (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (!title || !description || !assignedTo || !dueDate) {
        alert('Please fill in all required fields.');
        return;
      }
      onSubmit({
        title,
        description,
        type,
        priority,
        status,
        assignedTo,
        dueDate: new Date(dueDate).toISOString(),
      });
      alert('Task created successfully');
    } catch (error) {
      alert('Failed to create task');
      console.error('Failed to create task', error);
    }
    router.push('/admin/tasks');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-card border border-border/80 rounded-2xl p-6 md:p-8 shadow-sm">

      {/* Title */}
      <div>
        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
          Task Title <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl bg-card/50 border border-border/80 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          placeholder="Implement auth logic..."
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
          Description <span className="text-rose-500">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className="w-full px-4 py-3 rounded-xl bg-card/50 border border-border/80 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          placeholder="Provide detailed steps of the task..."
        />
      </div>

      {/* Select Grids: Type, Priority, Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="taskType" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Task Type
          </label>
          <select
            id="taskType"
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full px-4 py-3 rounded-xl bg-card border border-border/80 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none"
          >
            {TASK_TYPES.map((t) => (
              <option key={t.value} value={t.value} className="bg-card">
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="taskPriority" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Priority
          </label>
          <select 
            id="taskPriority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
            className="w-full px-4 py-3 rounded-xl bg-card border border-border/80 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none"
          >
            {TASK_PRIORITIES.map((p) => (
              <option key={p.value} value={p.value} className="bg-card">
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="taskStatus" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Status
          </label>
          <select
            id="taskStatus"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="w-full px-4 py-3 rounded-xl bg-card border border-border/80 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none"
          >
            {TASK_STATUSES.map((s) => (
              <option key={s.value} value={s.value} className="bg-card">
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Assignments and Due date Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Assignee select */}
        <div>
          <label htmlFor="assignee" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Assign To <span className="text-rose-500">*</span>
          </label>
          <select
            id="assignee"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-card border border-border/80 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none"
          >
            <option value="" className="bg-card">Select a user</option>
            {users
              .filter((u) => u.role === 'admin' || u.role === 'user' || u.status === 'approved')
              .map((u) => (
                <option key={u._id} value={u._id} className="bg-card">
                  ({u.email}){u.role === 'admin' ? ' — Admin' : ''}
                </option>
              ))}
            {users.filter((u) => u.role === 'admin' || u.role === 'user' || u.status === 'approved').length === 0 && (
              <option value="" disabled className="bg-card text-muted-foreground">
                No approved users available
              </option>
            )}
          </select>
        </div>

        {/* Due date input */}
        <div>
          <label htmlFor="dueDate" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Due Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-card border border-border/80 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Submission CTA */}
      <div className="flex items-center justify-end space-x-4 pt-4 border-t border-border/40">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:pointer-events-none"
        >
          {isLoading ? 'Submitting...' : 'Save Task'}
        </button>
      </div>

    </form>
  );
}
