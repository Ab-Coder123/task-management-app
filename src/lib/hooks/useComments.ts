import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsApi } from '../api/comments';

export function useComments(taskId?: string) {
  const queryClient = useQueryClient();

  const commentsQuery = useQuery({
    queryKey: ['comments', taskId],
    queryFn: () => commentsApi.getComments(taskId || ''),
    enabled: !!taskId,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });

  const addCommentMutation = useMutation({
    mutationFn: ({ taskId, userId, content }: { taskId: string; userId: string; content: string; username: string; taskTitle: string }) =>
      commentsApi.addComment(taskId, userId, content),
    onSuccess: (_newComment, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ['admin-comments'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({ id, content, isReviewed }: { id: string; content?: string; isReviewed?: boolean }) =>
      commentsApi.updateComment(id, { content, isReviewed }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['admin-comments'] });
      if (taskId) {
        queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
      }
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: commentsApi.deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['admin-comments'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
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

export function useAdminComments() {
  const queryClient = useQueryClient();

  const commentsQuery = useQuery({
    queryKey: ['admin-comments'],
    queryFn: commentsApi.getAdminComments,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });

  const deleteCommentMutation = useMutation({
    mutationFn: commentsApi.deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-comments'] });
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({ id, content, isReviewed }: { id: string; content?: string; isReviewed?: boolean }) =>
      commentsApi.updateComment(id, { content, isReviewed }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-comments'] });
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });

  return {
    comments: commentsQuery.data || [],
    isLoading: commentsQuery.isLoading,
    deleteComment: deleteCommentMutation.mutateAsync,
    isDeleting: deleteCommentMutation.isPending,
    updateComment: updateCommentMutation.mutateAsync,
    isUpdating: updateCommentMutation.isPending,
  };
}
