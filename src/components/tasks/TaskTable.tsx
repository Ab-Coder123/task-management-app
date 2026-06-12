'use client';

import React from 'react';
import { Task } from '@/lib/types';
import { getPriorityColor, getStatusColor, getTypeLabel, formatDate } from '@/lib/utils';
import { Edit2, Trash2, CheckCircle2, Eye } from 'lucide-react';

import Link from 'next/link';

interface TaskTableProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onComplete?: (id: string) => void;
}
export default function TaskTable({ tasks, onDelete, onComplete }: TaskTableProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 border rounded-2xl border-dashed border-border/80 bg-card/10">
        <p className="text-sm text-muted-foreground">No tasks matching your search.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-sm">
      <table className="w-full min-w-[800px] text-left border-collapse">
        <thead>
          <tr className="border-b border-border/80 bg-muted/20 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <th className="px-6 py-4">Task Name</th>
            <th className="px-6 py-4">Assigned To</th>
            <th className="px-6 py-4">Type</th>
            <th className="px-6 py-4">Priority</th>
            <th className="px-6 py-4">Due Date</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/40 text-sm text-foreground">
          {tasks.map((task) => (
            <tr key={task._id} className="hover:bg-muted/10 transition-colors">

              {/* Task Title & Details link */}
              <td className="px-6 py-4 font-semibold">
                <div>
                  <p className="text-foreground line-clamp-1">{task.title}</p>
                  <p className="text-xs text-muted-foreground font-normal line-clamp-1 mt-0.5">{task.description}</p>
                </div>
              </td>

              {/* Assigned User avatar badge */}
              <td className="px-6 py-4">
                {task.assignedTo ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary flex items-center justify-center uppercase">
                      {task.assignedTo.substring(0, 2)}
                    </div>
                    <span className="font-medium text-foreground">{task.assignedTo}</span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">Unassigned</span>
                )}
              </td>

              {/* Type tag */}
              <td className="px-6 py-4">
                <span className="text-xs text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-full border border-border/50">
                  {getTypeLabel(task.type)}
                </span>
              </td>

              {/* Priority tag */}
              <td className="px-6 py-4">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </td>

              {/* Due Date */}
              <td className="px-6 py-4 font-medium text-muted-foreground">
                {formatDate(task.dueDate)}
              </td>

              {/* Status badge */}
              <td className="px-6 py-4">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${getStatusColor(task.status)}`}>
                  {task.status.replace('_', ' ')}
                </span>
              </td>

              {/* Action buttons */}
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Link
                    href={`/admin/tasks/${task._id}/edit`}
                    className="p-2 rounded-lg text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-all"
                    title="Edit Task"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Link>
                  {task.status !== 'completed' && onComplete && (
                    <button
                      onClick={() => onComplete(task._id)}
                      className="p-2 rounded-lg text-emerald-500 hover:bg-emerald-500/10 transition-all"
                      title="Mark Complete"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(task._id)}
                    className="p-2 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-all"
                    title="Delete Task"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
