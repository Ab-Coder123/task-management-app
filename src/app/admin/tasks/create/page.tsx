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
    await createTask(taskData);
    router.push('/admin/tasks');
  };

  if (usersLoading) {
    return <LoadingSpinner size="lg" className="h-[50vh]" />;
  }

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <PageHeader
        title="إنشاء مهمة جديدة وتعيينها"
        description="قم بتحديد عنوان المهمة وتفاصيلها، وتعيينها إلى أعضاء الفريق مع تحديد نوع المهمة والأهمية وتاريخ الاستحقاق."
      />

      <div className="w-full flex justify-start">
        <TaskForm
          users={users}
          onSubmit={handleFormSubmit}
          isLoading={isCreating}
        />
      </div>
    </div>
  );
}
