'use client';

import React, { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import TaskTable from '@/components/tasks/TaskTable';
import TaskFilters from '@/components/tasks/TaskFilters';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { useTasks } from '@/lib/hooks/useTasks';
import { useUsers } from '@/lib/hooks/useUsers';
import { Plus } from 'lucide-react';
import Link from 'next/link';



export default function AdminTasksPage() {
  const { tasks, isLoading: tasksLoading, deleteTask, completeTask } = useTasks();
  const { users, isLoading: usersLoading } = useUsers();
  console.log('tasks', tasks);
  // Search & filter state  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Target task for deletion dialog
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Loading indicator
  if (tasksLoading || usersLoading) {
    return <LoadingSpinner size="lg" className="h-[50vh]" />;
  }

  // Join tasks with user records for presentation
  const tasksWithUsers = tasks.map((task) => ({
    ...task,
    assignedUser: users.find((u) => u._id === task.assignedTo),
  }));

  // Filtering logic
  const filteredTasks = tasksWithUsers.filter((task) => {
    const matchesSearch =
      task.title
    task.description

    const matchesStatus = statusFilter ? task.status === statusFilter : true;
    const matchesPriority = priorityFilter ? task.priority === priorityFilter : true;
    const matchesType = typeFilter ? task.type === typeFilter : true;

    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteTask(deleteTargetId);
    } catch (err) {
      console.error('Delete task failed', err);
    } finally {
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks Portfolio"
        description="Inspect tasks across stages, execute filters, and update details."
        action={
          <Link
            href="/admin/tasks/create"
            className="flex items-center space-x-1.5 px-4.5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/95 transition-all shadow-lg shadow-primary/10"
          >
            <Plus className="h-4 w-4" />
            <span>Create Task</span>
          </Link>
        }
      />

      {/* Task Filters */}
      <TaskFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />

      {/* Task Table */}
      <TaskTable
        tasks={filteredTasks}
        onDelete={(id) => setDeleteTargetId(id)}
        onComplete={(id) => completeTask({ id, username: 'Admin' })}
      />

      {/* Delete Confirmation Dialogue */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        title="Delete Task Record"
        description="Are you sure you want to delete this task? This will erase all logs, history, and user comments associated with this task. This action cannot be reverted."
        confirmText="Confirm Delete"
        isDanger
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
