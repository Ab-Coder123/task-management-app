import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsApi } from '../api/comments';
import { notificationsApi } from '../api/notifications';

export function useComments(taskId?: string) {
  const queryClient = useQueryClient();

  const commentsQuery = useQuery({
    queryKey: ['comments', taskId],
    queryFn: () => commentsApi.getComments(taskId || ''),
    enabled: !!taskId,
  });
  console.log("commentsQuery.data", commentsQuery.data);
  const addCommentMutation = useMutation({
    mutationFn: ({ taskId, userId, content, username, taskTitle }: { taskId: string; userId: string; content: string; username: string; taskTitle: string }) =>
      commentsApi.addComment(taskId, userId, content),
    onSuccess: (newComment, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.taskId] });
      // Notify Admin on new comment
      notificationsApi.addNotification({
        type: 'new_comment',
        message: `User "${variables.username}" commented on "${variables.taskTitle}": "${variables.content.substring(0, 30)}..."`,
        metadata: { taskId: variables.taskId, username: variables.username, taskTitle: variables.taskTitle }
      });
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({ id, content, isReviewed }: { id: string; content?: string; isReviewed?: boolean }) =>
      commentsApi.updateComment(id, { content, isReviewed }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      if (taskId) {
        queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
      }
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: commentsApi.deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      if (taskId) {
        queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
      }
    },
  });

  return {
    comments: commentsQuery.data || [],
    isLoading: commentsQuery.isLoading,
    addComment: addCommentMutation.mutateAsync,
    isAdding: addCommentMutation.isPending,
    updateComment: updateCommentMutation.mutateAsync,
    isUpdating: updateCommentMutation.isPending,
    deleteComment: deleteCommentMutation.mutateAsync,
    isDeleting: deleteCommentMutation.isPending,
  };
}
