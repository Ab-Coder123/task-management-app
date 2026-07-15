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

        <div className="flex items-center gap-2">
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
          return (
            <div className="flex items-center gap-1">
              <div className="flex items-center -space-x-1.5 space-x-reverse">
                {assignedList.slice(0, 3).map((item, idx) => {
                  const name = typeof item === 'string' ? item : item?.username || 'User';
                  const avatar = typeof item === 'string' ? null : item?.avatar;
                  return (
                    <div key={idx} className="relative group/avatar shrink-0">
                      {avatar ? (
                        <img
                          src={avatar}
                          alt={name}
                          className="h-5 w-5 rounded-full object-cover border border-card shadow-sm"
                        />
                      ) : (
                        <div className="h-5 w-5 rounded-full bg-primary/10 border border-card text-primary text-[8px] font-bold flex items-center justify-center uppercase shadow-sm">
                          {name.substring(0, 2)}
                        </div>
                      )}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 rounded bg-black/85 text-white text-[9px] whitespace-nowrap opacity-0 group-hover/avatar:opacity-100 transition-opacity pointer-events-none z-[100] font-semibold">
                        {name}
                      </div>
                    </div>
                  );
                })}
                {assignedList.length > 3 && (
                  <div className="h-5 w-5 rounded-full bg-muted border border-card flex items-center justify-center text-[8px] font-bold text-muted-foreground shrink-0 z-0">
                    +{assignedList.length - 3}
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Hover action card buttons */}
      <div className="mt-4 flex items-center justify-end gap-2.5">
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
