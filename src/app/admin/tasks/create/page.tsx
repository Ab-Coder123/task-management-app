'use client';

import React from 'react';
import PageHeader from '@/components/shared/PageHeader';
import TaskForm from '@/components/tasks/TaskForm';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useTasks } from '@/lib/hooks/useTasks';
import { useUsers } from '@/lib/hooks/useUsers';
import { useRouter } from 'next/navigation';

export default function AdminCreateTaskPage() {
  const router = useRouter();
  const { createTask, isCreating } = useTasks();
  const { users, isLoading: usersLoading } = useUsers();

  const handleFormSubmit = async (taskData: any) => {
    try {
      await createTask(taskData);
      router.push('/admin/tasks');
    } catch (err) {
      console.error('Failed to create task', err);
    }
  };

  if (usersLoading) {
    return <LoadingSpinner size="lg" className="h-[50vh]" />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create New Task"
        description="Assign assignments to verified accounts, select categories, priorities, and deadlines."
      />

      <div className="flex justify-center md:justify-start">
        <TaskForm
          users={users}
          onSubmit={handleFormSubmit}
          isLoading={isCreating}
        />
      </div>
    </div>
  );
}
