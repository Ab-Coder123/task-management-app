import { apiFetch } from './base';
import { Comment } from '../types';

export const commentsApi = {
  addComment: (taskId: string, userId: string, content: string) => {
    return apiFetch<Comment>('/api/comments/addcomment', {
      method: 'POST',
      bodyData: { taskId, userId, content },
    });
  },

  getComments: (taskId: string) => {
    return apiFetch<Comment[]>(`/api/comments/getcomments_id=${taskId}`, {
      method: 'GET',
    });
  },

  updateComment: (id: string, updateData: { content?: string; isReviewed?: boolean }) => {
    return apiFetch<Comment>(`/api/comments/updatecomments_id=${id}`, {
      method: 'PUT',
      bodyData: updateData,
    });
  },

  deleteComment: (id: string) => {
    return apiFetch<{ message: string }>(`/api/comments/deletecomments_id=${id}`, {
      method: 'DELETE',
    });
  },
};
