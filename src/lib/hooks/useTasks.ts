import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../api/tasks';
import { Task } from '../types';
import { notificationsApi } from '../api/notifications';
import { playSuccessSound } from '../utils/sound';

export function useTasks() {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ['tasks'],
    queryFn: tasksApi.getTasks,
  });

  const createTaskMutation = useMutation({
    mutationFn: tasksApi.addTask,
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      // Play a success sound
      playSuccessSound();
      // Notifications are now handled securely by the backend
    },
  });

  const editTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Task> }) =>
      tasksApi.editTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      playSuccessSound();
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: tasksApi.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      playSuccessSound();
    },
  });

  const completeTaskMutation = useMutation({
    mutationFn: ({ id, username }: { id: string; username: string }) =>
      tasksApi.editTask(id, { personalStatus: 'completed' } as any),
    onSuccess: (completedTask, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      // Play a success sound
      playSuccessSound();
      // Notifications are now handled securely by the backend
    },
  });

  // Private Checklist Mutations (Phase 11)
  const addChecklistItemMutation = useMutation({
    mutationFn: ({ taskId, text }: { taskId: string; text: string }) =>
      tasksApi.addChecklistItem(taskId, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const toggleChecklistItemMutation = useMutation({
    mutationFn: ({ taskId, itemId }: { taskId: string; itemId: string }) =>
      tasksApi.toggleChecklistItem(taskId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteChecklistItemMutation = useMutation({
    mutationFn: ({ taskId, itemId }: { taskId: string; itemId: string }) =>
      tasksApi.deleteChecklistItem(taskId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
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
    
    // Checklist actions
    addChecklistItem: addChecklistItemMutation.mutateAsync,
    isAddingChecklist: addChecklistItemMutation.isPending,
    toggleChecklistItem: toggleChecklistItemMutation.mutateAsync,
    isTogglingChecklist: toggleChecklistItemMutation.isPending,
    deleteChecklistItem: deleteChecklistItemMutation.mutateAsync,
    isDeletingChecklist: deleteChecklistItemMutation.isPending,
  };
}
