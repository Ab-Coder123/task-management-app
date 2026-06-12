'use client';

import React, { useState } from 'react';
import { useComments } from '@/lib/hooks/useComments';
import { getAvatarFallback, formatDate } from '@/lib/utils';
import { Send, Trash2, ShieldAlert } from 'lucide-react';

interface TaskCommentSectionProps {
  taskId: string;
  userId: string;
  username: string;
  taskTitle: string;
  isAdmin?: boolean;
}

export default function TaskCommentSection({
  taskId,
  userId,
  username,
  taskTitle,
  isAdmin = false,
}: TaskCommentSectionProps) {
  const { comments, addComment, deleteComment, isLoading } = useComments(taskId);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      await addComment({
        taskId,
        userId,
        content: commentText.trim(),
        username,
        taskTitle,
      });
      setCommentText('');
    } catch (err) {
      console.error('Failed to add comment', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-foreground">Task Discussions</h3>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        <textarea
          rows={3}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Share your thoughts or update on this task..."
          className="w-full px-4 py-3 rounded-xl bg-card border border-border/80 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting || !commentText.trim()}
            className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 transition-all disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-primary/10"
          >
            <Send className="h-3.5 w-3.5" />
            <span>{submitting ? 'Sending...' : 'Post Comment'}</span>
          </button>
        </div>
      </form>

      {/* Comments Stream */}
      <div className="space-y-4">
        {isLoading ? (
          <p className="text-xs text-muted-foreground">Loading discussions...</p>
        ) : comments.length === 0 ? (
          <div className="text-center py-6 border rounded-xl border-dashed border-border/40">
            <p className="text-xs text-muted-foreground">No comments yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {comments.map((comment) => (
              <div key={comment._id} className="py-4 flex items-start justify-between group">
                <div className="flex space-x-3">
                  {/* Text avatar */}
                  <div className="h-8 w-8 shrink-0 rounded-full bg-primary/15 border border-primary/20 text-xs font-bold text-primary flex items-center justify-center uppercase">
                    {comment.user ? getAvatarFallback(comment.user.username) : '?'}
                  </div>
                  
                  {/* Comment context */}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-foreground">
                        {comment.user?.username || 'Unknown User'}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {formatDate(comment.createdAt, 'PPp')}
                      </span>
                      {comment.user?.role === 'admin' && (
                        <span className="flex items-center text-[9px] font-bold text-violet-400 bg-violet-400/10 border border-violet-400/20 px-1.5 py-0.5 rounded">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {comment.content}
                    </p>
                  </div>
                </div>

                {/* Actions: Admin deletion */}
                {isAdmin && (
                  <button
                    onClick={() => deleteComment(comment._id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
                    title="Delete Comment"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
