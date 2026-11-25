import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../api/tasks';
import { Task, TaskStatus } from '../types';
import { notificationsApi } from '../api/notifications';
import { playSuccessSound } from '../utils/sound';

export function useTasks() {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ['tasks'],
    queryFn: tasksApi.getTasks,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
    staleTime: 4000,
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
    mutationFn: async ({ id, username, isAdmin }: { id: string; username: string; isAdmin?: boolean }) => {
      const payload = isAdmin 
        ? { status: 'completed' as any } 
        : { personalStatus: 'completed' as any };
      return tasksApi.editTask(id, payload);
    },
    onSuccess: (completedTask, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      playSuccessSound();
    },
    onError: (error) => {
      console.error('completeTask error:', error);
    }
  });

  const updateTaskStatusMutation = useMutation({
    mutationFn: async ({ id, status, isAdmin }: { id: string; status: TaskStatus; isAdmin?: boolean }) => {
      const payload = isAdmin
        ? { status }
        : ({ personalStatus: status } as any);
      return tasksApi.editTask(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      playSuccessSound();
    },
    onError: (error) => {
      console.error('updateTaskStatus error:', error);
    }
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
    updateTaskStatus: updateTaskStatusMutation.mutateAsync,
    isUpdatingStatus: updateTaskStatusMutation.isPending,
    
    // Checklist actions
    addChecklistItem: addChecklistItemMutation.mutateAsync,
    isAddingChecklist: addChecklistItemMutation.isPending,
    toggleChecklistItem: toggleChecklistItemMutation.mutateAsync,
    isTogglingChecklist: toggleChecklistItemMutation.isPending,
    deleteChecklistItem: deleteChecklistItemMutation.mutateAsync,
    isDeletingChecklist: deleteChecklistItemMutation.isPending,
  };
}
