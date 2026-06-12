'use client';

import React from 'react';
import PageHeader from '@/components/shared/PageHeader';
import StatsCard from '@/components/dashboard/StatsCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import TaskChart from '@/components/dashboard/TaskChart';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useUsers } from '@/lib/hooks/useUsers';
import { useTasks } from '@/lib/hooks/useTasks';
import { useNotifications } from '@/lib/hooks/useNotifications';

export default function AdminDashboardPage() {
  const { users, isLoading: usersLoading } = useUsers();
  const { tasks, isLoading: tasksLoading } = useTasks();
  const { notifications } = useNotifications();

  if (usersLoading || tasksLoading) {
    return <LoadingSpinner size="lg" className="h-[60vh]" />;
  }

  // Calculate statistics metrics
  const totalUsers = users.length;
  const pendingUsers = users.filter((u) => u.status === 'pending').length;
  const approvedUsers = users.filter((u) => u.status === 'approved').length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const activeTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const pendingTasks = tasks.filter((t) => t.status === 'pending').length;
  const overdueTasks = tasks.filter((t) => t.status === 'overdue').length;

  // Chart data formatting
  const chartData = [
    { name: 'Completed', value: completedTasks, color: '#10b981' },
    { name: 'In Progress', value: activeTasks, color: '#6366f1' },
    { name: 'Pending', value: pendingTasks, color: '#94a3b8' },
    { name: 'Overdue', value: overdueTasks, color: '#f43f5e' },
  ];

  // Activities mapping: compile notification alerts to readable recent logs
  const activities = notifications.slice(0, 5).map((n) => {
    let type: 'register' | 'complete' | 'comment' | 'approve' = 'comment';
    if (n.type === 'new_user') {
      type = n.message.includes('approved') ? 'approve' : 'register';
    } else if (n.type === 'task_completed') {
      type = 'complete';
    }

    return {
      id: n._id,
      type,
      user: n.metadata?.username || 'System',
      target: n.metadata?.taskTitle || n.metadata?.username || 'Action details',
      timestamp: n.createdAt,
    };
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Control Dashboard"
        description="Monitor system analytics, pending approvals, and progress status updates."
      />

      {/* Analytics stats row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <StatsCard
          title="Total Users"
          value={totalUsers}
          icon="Users"
          color="info"
        />
        <StatsCard
          title="Pending Approvals"
          value={pendingUsers}
          icon="UserPlus"
          color="warning"
          description={pendingUsers > 0 ? 'Verification needed' : 'All approved'}
        />
        <StatsCard
          title="Approved Users"
          value={approvedUsers}
          icon="ShieldCheck"
          color="success"
        />
        <StatsCard
          title="Total Tasks"
          value={totalTasks}
          icon="CheckSquare"
          color="primary"
        />
        <StatsCard
          title="Completed Tasks"
          value={completedTasks}
          icon="FolderCheck"
          color="success"
          description={totalTasks > 0 ? `${Math.round((completedTasks / totalTasks) * 100)}% completion` : 'No tasks'}
        />
      </div>

      {/* Chart and Activities grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        <div className="lg:col-span-1">
          <TaskChart
            data={chartData}
            title="Task Status Breakdown"
          />
        </div>
        <div className="lg:col-span-2">
          <RecentActivity
            activities={activities}
          />
        </div>
      </div>

    </div>
  );
}
