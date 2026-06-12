import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../api/tasks';
import { Task } from '../types';
import { notificationsApi } from '../api/notifications';

export function useTasks() {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ['tasks'],
    queryFn: tasksApi.getTasks,
  });
  console.log('tasksQuery', tasksQuery);

  const createTaskMutation = useMutation({
    mutationFn: tasksApi.addTask,
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      // Notify Admin
      notificationsApi.addNotification({
        type: 'new_user', // standard notification category
        message: `New task "${newTask.title}" has been created.`,
        metadata: { taskId: newTask._id, taskTitle: newTask.title }
      });
    },
  });

  const editTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Task> }) =>
      tasksApi.editTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: tasksApi.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const completeTaskMutation = useMutation({
    mutationFn: ({ id, username }: { id: string; username: string }) =>
      tasksApi.editTask(id, { status: 'completed', completedAt: new Date().toISOString() }),
    onSuccess: (completedTask, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      // Notify Admin on task completion
      notificationsApi.addNotification({
        type: 'task_completed',
        message: `User "${variables.username}" completed the task "${completedTask.title}".`,
        metadata: { taskId: completedTask._id, username: variables.username, taskTitle: completedTask.title }
      });
    },
  });

  return {
    tasks: tasksQuery.data || [],
    isLoading: tasksQuery.isLoading,
    isError: tasksQuery.isError,
    error: tasksQuery.error,
    createTask: createTaskMutation.mutateAsync,
    isCreating: createTaskMutation.isPending,
    editTask: editTaskMutation.mutateAsync,
    isEditing: editTaskMutation.isPending,
    deleteTask: deleteTaskMutation.mutateAsync,
    isDeleting: deleteTaskMutation.isPending,
    completeTask: completeTaskMutation.mutateAsync,
    isCompleting: completeTaskMutation.isPending,
  };
}
