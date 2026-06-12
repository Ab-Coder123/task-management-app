'use client';

import React from 'react';
import PageHeader from '@/components/shared/PageHeader';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useComments } from '@/lib/hooks/useComments';
import { useTasks } from '@/lib/hooks/useTasks';
import { useUsers } from '@/lib/hooks/useUsers';
import { formatDate } from '@/lib/utils';
import { Trash2, CheckCircle, MessageSquare } from 'lucide-react';

export default function AdminCommentsPage() {
  const { tasks, isLoading: tasksLoading } = useTasks();
  const { users, isLoading: usersLoading } = useUsers();
  // Fetch comments for all tasks or use comments hook. Since useComments takes taskId, 
  // we can fetch task discussions for each task, or join them together.
  // To get all comments across tasks, we can aggregate comments from each task.
  // Let's create an aggregator that loops over tasks and gathers their comments.
  
  const { deleteComment, updateComment } = useComments();

  if (tasksLoading || usersLoading) {
    return <LoadingSpinner size="lg" className="h-[50vh]" />;
  }

  // Aggregate comments from all tasks
  // In a real API, /api/comments gets all comments, but since we are mocking, we can aggregate comments 
  // from our tasks list or fetch task detail comments.
  // Let's mock a nice listing that reads comments joined with tasks.
  const allComments = tasks.flatMap((task) => {
    // In our model structure, task has a comments array or we map them.
    // Let's check if task.comments exists or generate some default comments for visual validation.
    const commentsList = (task as any).comments || [];
    return commentsList.map((comment: any) => ({
      ...comment,
      task,
      user: users.find((u) => u._id === comment.userId),
    }));
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteComment(id);
    } catch (err) {
      console.error('Delete comment failed', err);
    }
  };

  const handleMarkReviewed = async (id: string) => {
    try {
      await updateComment({ id, isReviewed: true });
    } catch (err) {
      console.error('Review update failed', err);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Comments & Messages Moderation"
        description="Inspect discussions across all active tasks, review logs, and moderate comments."
      />

      {allComments.length === 0 ? (
        <div className="text-center py-12 border rounded-2xl border-dashed border-border/80 bg-card/10">
          <MessageSquare className="h-10 w-10 text-muted-foreground/60 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No user comments submitted yet.</p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-sm">
          <table className="w-full min-w-[700px] text-left border-collapse">
            <thead>
              <tr className="border-b border-border/80 bg-muted/20 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Task Context</th>
                <th className="px-6 py-4">Comment</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-sm text-foreground">
              {allComments.map((comment) => (
                <tr key={comment._id} className="hover:bg-muted/10 transition-colors">
                  
                  {/* User profile */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2.5">
                      <div className="h-6.5 w-6.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary flex items-center justify-center uppercase">
                        {comment.user?.username.substring(0, 2) || '?'}
                      </div>
                      <span className="font-semibold">{comment.user?.username || 'Unknown'}</span>
                    </div>
                  </td>
                  
                  {/* Task context */}
                  <td className="px-6 py-4 font-semibold text-primary">
                    {comment.task?.title || 'Unknown Task'}
                  </td>
                  
                  {/* Comment Content */}
                  <td className="px-6 py-4 max-w-xs truncate text-muted-foreground">
                    {comment.content}
                  </td>
                  
                  {/* Date */}
                  <td className="px-6 py-4 text-xs font-medium text-muted-foreground">
                    {formatDate(comment.createdAt, 'PPp')}
                  </td>
                  
                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      comment.isReviewed 
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    }`}>
                      {comment.isReviewed ? 'Reviewed' : 'Pending Review'}
                    </span>
                  </td>
                  
                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {!comment.isReviewed && (
                        <button
                          onClick={() => handleMarkReviewed(comment._id)}
                          className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-500/10 transition-all"
                          title="Mark Reviewed"
                        >
                          <CheckCircle className="h-4.5 w-4.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(comment._id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-all"
                        title="Delete Comment"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
