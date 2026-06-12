'use client';

import React from 'react';
import PageHeader from '@/components/shared/PageHeader';
import TaskForm from '@/components/tasks/TaskForm';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useTasks } from '@/lib/hooks/useTasks';
import { useUsers } from '@/lib/hooks/useUsers';
import { useRouter, useParams } from 'next/navigation';

export default function AdminEditTaskPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;

  const { tasks, editTask, isEditing, isLoading: tasksLoading } = useTasks();
  const { users, isLoading: usersLoading } = useUsers();

  if (tasksLoading || usersLoading) {
    return <LoadingSpinner size="lg" className="h-[50vh]" />;
  }

  // Retrieve current task details
  const taskToEdit = tasks.find((t) => t._id === taskId);

  if (!taskToEdit) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-foreground">Task Not Found</h3>
        <p className="text-sm text-muted-foreground mt-2">The task you are trying to edit does not exist.</p>
      </div>
    );
  }

  const handleFormSubmit = async (taskData: any) => {
    try {
      await editTask({ id: taskId, data: taskData });
      router.push('/admin/tasks');
    } catch (err) {
      console.error('Failed to update task', err);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit Task: ${taskToEdit.title}`}
        description="Modify assignment description, re-assign, or shift deadlines."
      />

      <div className="flex justify-center md:justify-start">
        <TaskForm
          initialValues={taskToEdit}
          users={users}
          onSubmit={handleFormSubmit}
          isLoading={isEditing}
        />
      </div>
    </div>
  );
}
