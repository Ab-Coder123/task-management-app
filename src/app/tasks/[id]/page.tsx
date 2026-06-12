'use client';

import React from 'react';
import PageHeader from '@/components/shared/PageHeader';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import TaskCommentSection from '@/components/tasks/TaskCommentSection';
import { useTasks } from '@/lib/hooks/useTasks';
import { useUsers } from '@/lib/hooks/useUsers';
import { useAuthStore } from '@/lib/store/authStore';
import { getPriorityColor, getStatusColor, getTypeLabel, formatDate } from '@/lib/utils';
import { Calendar, User, Clock, CheckCircle2, ChevronLeft, Tag } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function TaskDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;

  const { user: currentUser } = useAuthStore();
  const { tasks, isLoading: tasksLoading, completeTask } = useTasks();
  const { users, isLoading: usersLoading } = useUsers();

  if (tasksLoading || usersLoading) {
    return <LoadingSpinner size="lg" className="h-[60vh]" />;
  }

  // Find target task details
  const task = tasks.find((t) => t._id === taskId);

  if (!task) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-bold text-foreground">Task Not Found</h3>
        <p className="text-sm text-muted-foreground mt-2">The task you are looking for doesn't exist.</p>
        <Link href="/dashboard" className="inline-flex items-center text-primary mt-6 hover:underline text-sm font-semibold">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  // Find assignee user profile
  const assignedUser = users.find((u) => u._id === task.assignedTo);
  const isCompleted = task.status === 'completed';

  const handleComplete = async () => {
    try {
      await completeTask({ id: task._id, username: currentUser?.username || 'User' });
    } catch (err) {
      console.error('Task complete update failed', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          href={currentUser?.role === 'admin' ? '/admin/tasks' : '/dashboard'}
          className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4.5 w-4.5 mr-1" />
          <span>Back to Board</span>
        </Link>
      </div>

      <PageHeader
        title={task.title}
        action={
          !isCompleted && (
            <button
              onClick={handleComplete}
              className="flex items-center space-x-1.5 px-4.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/10 transition-all"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Mark as Completed</span>
            </button>
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Task Specifications & Details */}
        <div className="lg:col-span-2 space-y-6">

          {/* Main Description */}
          <div className="bg-card border border-border/80 rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
            <h3 className="text-base font-bold text-foreground">Task Overview</h3>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {task.description}
            </p>
          </div>

          {/* Comment Section Panel */}
          <div className="bg-card border border-border/80 rounded-2xl p-6 md:p-8 shadow-sm">
            <TaskCommentSection
              taskId={task._id}
              userId={currentUser?._id || ''}
              username={currentUser?.username || ''}
              taskTitle={task.title}
              isAdmin={currentUser?.role === 'admin'}
            />
          </div>

        </div>

        {/* Right Side: Parameters Metadata box */}
        <div className="space-y-6">
          <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Parameters Details</h3>

            <div className="space-y-4.5">
              {/* Status */}
              <div className="flex justify-between items-center text-sm border-b border-border/30 pb-3">
                <span className="text-muted-foreground flex items-center">
                  <Clock className="h-4 w-4 mr-2 opacity-80" />
                  Status
                </span>
                <span className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-full border ${getStatusColor(task.status)}`}>
                </span>
              </div>

              {/* Priority */}
              <div className="flex justify-between items-center text-sm border-b border-border/30 pb-3">
                <span className="text-muted-foreground flex items-center">
                  <Tag className="h-4 w-4 mr-2 opacity-80" />
                  Priority
                </span>
                <span className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>

              {/* Type */}
              <div className="flex justify-between items-center text-sm border-b border-border/30 pb-3">
                <span className="text-muted-foreground flex items-center">
                  <Tag className="h-4 w-4 mr-2 opacity-80" />
                  Task Category
                </span>
                <span className="text-xs font-bold uppercase text-slate-300 bg-muted/40 px-2.5 py-0.5 rounded border border-border/50">
                  {getTypeLabel(task.type)}
                </span>
              </div>

              {/* Due Date */}
              <div className="flex justify-between items-center text-sm border-b border-border/30 pb-3">
                <span className="text-muted-foreground flex items-center">
                  <Calendar className="h-4 w-4 mr-2 opacity-80" />
                  Due Date
                </span>
                <span className="font-semibold text-foreground text-xs">{formatDate(task.dueDate)}</span>
              </div>

              {/* Assignee */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground flex items-center">
                  <User className="h-4 w-4 mr-2 opacity-80" />
                  Assignee
                </span>
                {assignedUser ? (
                  <div className="flex items-center space-x-1.5">
                    <div className="h-5.5 w-5.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary flex items-center justify-center uppercase">
                      {assignedUser.username.substring(0, 2)}
                    </div>
                    <span className="font-semibold text-foreground text-xs">{assignedUser.username}</span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground font-medium">Unassigned</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
