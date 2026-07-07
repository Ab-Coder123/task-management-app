import React from 'react';
import { Task } from '@/lib/types';
import { getPriorityColor, getStatusColor, getTypeLabel, formatDate } from '@/lib/utils';
import { Calendar, AlertCircle, CheckCircle2, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

interface TaskCardProps {
  task: Task;
  onComplete?: () => void;
  isAdmin?: boolean;
}

export default function TaskCard({ task, onComplete, isAdmin = false }: TaskCardProps) {
  const isCompleted = task.status === 'completed';

  return (
    <div className="relative group rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-300 hover:border-border hover:shadow-md">

      {/* Top Header Priority Badge & Type */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-full border border-border/50">
          {getTypeLabel(task.type)}
        </span>

        <div className="flex items-center space-x-2">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusColor(task.status)}`}>
            {task.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Task Content */}
      <div className="mb-6">
        <h4 className="text-base font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {task.title}
        </h4>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      </div>

      {/* Meta Specs: Due date and user assignment */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-border/40 gap-3">
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="h-4 w-4 mr-1.5 text-muted-foreground/80" />
          <span>Due: {formatDate(task.dueDate)}</span>
        </div>

        {(() => {
          const assignedList = Array.isArray(task.assignedTo) ? task.assignedTo : task.assignedTo ? [task.assignedTo] : [];
          if (assignedList.length === 0) return null;
          const first = assignedList[0];
          const name = typeof first === 'string' ? first : first?.username || '';
          if (!name) return null;
          return (
            <div className="flex items-center space-x-1.5">
              <div className="h-5 w-5 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-bold text-primary flex items-center justify-center uppercase">
                {name.substring(0, 2)}
              </div>
              <span className="text-xs text-muted-foreground font-medium truncate max-w-[80px]">
                {name}
              </span>
            </div>
          );
        })()}
      </div>

      {/* Hover action card buttons */}
      <div className="mt-4 flex items-center justify-end space-x-2.5">
        <Link
          href={isAdmin ? `/admin/tasks/${task._id}/edit` : `/tasks/${task._id}`}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border/80 text-muted-foreground hover:bg-muted/40 transition-all"
        >
          {isAdmin ? 'Edit Details' : 'View / Comments'}
        </Link>

        {!isCompleted && onComplete && (
          <button
            onClick={onComplete}
            className="flex items-center text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/10 transition-all"
          >
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
            <span>Complete</span>
          </button>
        )}
      </div>
    </div>
  );
}
