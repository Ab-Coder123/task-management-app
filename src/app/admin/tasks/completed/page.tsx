'use client';

import React, { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useTasks } from '@/lib/hooks/useTasks';
import { useUsers } from '@/lib/hooks/useUsers';
import { formatDate } from '@/lib/utils';
import { CheckCircle2, Search, Calendar } from 'lucide-react';

export default function AdminCompletedTasksPage() {
  const { tasks, isLoading: tasksLoading } = useTasks();
  const { users, isLoading: usersLoading } = useUsers();
  
  const [search, setSearch] = useState('');

  if (tasksLoading || usersLoading) {
    return <LoadingSpinner size="lg" className="h-[50vh]" />;
  }

  // Filter completed tasks and join with user profiles
  const completedTasks = tasks
    .filter((t) => t.status === 'completed')
    .map((task) => ({
      ...task,
      assignedUser: users.find((u) => u._id === task.assignedTo),
    }))
    .filter((task) =>
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      (task.assignedUser?.username || '').toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Completed Tasks Portfolio"
        description="Verify task deliverables, completion timestamps, and creator assignments."
      />

      {/* Search Input Bar */}
      <div className="relative max-w-md">
        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground/75">
          <Search className="h-4.5 w-4.5" />
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search task name or assignee..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border/80 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
        />
      </div>

      {completedTasks.length === 0 ? (
        <div className="text-center py-12 border rounded-2xl border-dashed border-border/80 bg-card/10">
          <p className="text-sm text-muted-foreground">No completed tasks match your search query.</p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-sm">
          <table className="w-full min-w-[700px] text-left border-collapse">
            <thead>
              <tr className="border-b border-border/80 bg-muted/20 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <th className="px-6 py-4">Task Name</th>
                <th className="px-6 py-4">User Name</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4">Completion Date</th>
                <th className="px-6 py-4">Task Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-sm text-foreground">
              {completedTasks.map((task) => (
                <tr key={task._id} className="hover:bg-muted/10 transition-colors">
                  
                  {/* Task Name */}
                  <td className="px-6 py-4 font-semibold text-foreground">
                    {task.title}
                  </td>
                  
                  {/* Assigned User */}
                  <td className="px-6 py-4">
                    {task.assignedUser ? (
                      <div className="flex items-center space-x-2">
                        <div className="h-6 w-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 flex items-center justify-center uppercase">
                          {task.assignedUser.username.substring(0, 2)}
                        </div>
                        <span className="font-medium text-foreground">{task.assignedUser.username}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Unassigned</span>
                    )}
                  </td>
                  
                  {/* Created Date */}
                  <td className="px-6 py-4 text-muted-foreground font-medium">
                    {formatDate(task.createdAt, 'PPP')}
                  </td>
                  
                  {/* Completion Date */}
                  <td className="px-6 py-4 text-emerald-500 font-semibold">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1.5 opacity-80" />
                      {formatDate(task.completedAt, 'PPp')}
                    </span>
                  </td>
                  
                  {/* Status Indicator */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      Completed
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
