'use client';

import React from 'react';
import PageHeader from '@/components/shared/PageHeader';
import TaskCard from '@/components/tasks/TaskCard';
import EmptyState from '@/components/shared/EmptyState';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import StatsCard from '@/components/dashboard/StatsCard';
import { useTasks } from '@/lib/hooks/useTasks';
import { useAuthStore } from '@/lib/store/authStore';

export default function UserDashboardPage() {
  const { user, token } = useAuthStore();
  const { tasks, isLoading, completeTask } = useTasks();
  console.log(user , token);
  if (isLoading) {
    return <LoadingSpinner size="lg" className="h-[60vh]" />;
  }

  // Filter tasks assigned to the logged-in user
  const myTasks = tasks;
  console.log('myTasks', myTasks);
  // Statistics summaries
  const totalMyTasks = myTasks.length;
  const completedMyTasks = myTasks.filter((t) => t.status === 'completed').length;
  const activeMyTasks = myTasks.filter((t) => t.status === 'in_progress').length;
  const pendingMyTasks = myTasks.filter((t) => t.status === 'pending').length;

  const handleComplete = async (id: string) => {
    try {
      await completeTask({ id, username: user?.username || 'User' });
    } catch (err) {
      console.error('Complete task operation failed', err);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${user?.username || 'User'}`}
        description="Here is the breakdown of your assigned tasks and current progress deliverables."
      />

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Assigned"
          value={totalMyTasks}
          icon="CheckSquare"
          color="primary"
        />
        <StatsCard
          title="Pending Start"
          value={pendingMyTasks}
          icon="Clock"
          color="warning"
        />
        <StatsCard
          title="Active Progress"
          value={activeMyTasks}
          icon="Play"
          color="info"
        />
        <StatsCard
          title="Completed"
          value={completedMyTasks}
          icon="FolderCheck"
          color="success"
          description={totalMyTasks > 0 ? `${Math.round((completedMyTasks / totalMyTasks) * 100)}% done` : 'No tasks'}
        />
      </div>

      {/* Task List Grid */}
      <div className="pt-4">
        <h3 className="text-lg font-bold text-foreground mb-4">My Task Board</h3>
        
        {myTasks.length === 0 ? (
          <EmptyState
            title="All Clear!"
            description="You have no tasks assigned to you right now. Grab a coffee or ask the admin for a new assignment!"
            icon="Compass"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {myTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onComplete={() => handleComplete(task._id)}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
