'use client';

import React, { useState } from 'react';
import { TaskAttachment } from '@/lib/types';
import AttachmentCard from './AttachmentCard';
import AttachmentViewer from './AttachmentViewer';
import AttachmentUploader from './AttachmentUploader';
import { attachmentsApi } from '@/lib/api/tasks';
import { Paperclip } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';

interface AttachmentSectionProps {
  taskId: string;
  initialAttachments?: TaskAttachment[];
  canUpload?: boolean;  // admin only
  canDelete?: boolean;  // admin / task creator
}

export default function AttachmentSection({ taskId, initialAttachments = [], canUpload = false, canDelete = false }: AttachmentSectionProps) {
  const [attachments, setAttachments] = useState<TaskAttachment[]>(initialAttachments);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const handleUploadComplete = (updated: TaskAttachment[]) => {
    setAttachments(updated);
    toast.success(`تم رفع الملفات بنجاح (${updated.length} ملف)`);
  };

  const handleDelete = async (attachmentId: string) => {
    try {
      const updated = await attachmentsApi.deleteAttachment(taskId, attachmentId);
      setAttachments(updated);
      toast.success('تم حذف المرفق بنجاح');
    } catch (err: any) {
      toast.error(err.message || 'فشل حذف المرفق');
    }
  };

  const openViewer = (attachment: TaskAttachment) => {
    const idx = attachments.findIndex(a => a.id === attachment.id);
    setViewerIndex(idx >= 0 ? idx : 0);
  };

  return (
    <div className="space-y-3" dir="rtl">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <Paperclip className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-bold text-foreground">
          المرفقات {attachments.length > 0 && <span className="text-muted-foreground font-normal">({attachments.length})</span>}
        </h3>
      </div>

      {/* Uploader (admin only) */}
      {canUpload && (
        <AttachmentUploader
          taskId={taskId}
          onUploadComplete={handleUploadComplete}
          existingCount={attachments.length}
        />
      )}

      {/* Attachment Cards */}
      {attachments.length === 0 && !canUpload && (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/30 py-8 text-center">
          <Paperclip className="h-8 w-8 text-muted-foreground/30" />
          <p className="text-xs text-muted-foreground">لا توجد مرفقات لهذه المهمة</p>
        </div>
      )}

      <AnimatePresence mode="popLayout">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {attachments.map((att) => (
            <AttachmentCard
              key={att.id}
              attachment={att}
              taskId={taskId}
              canDelete={canDelete}
              onClick={openViewer}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </AnimatePresence>

      {/* Viewer Modal */}
      {viewerIndex !== null && (
        <AttachmentViewer
          attachments={attachments}
          initialIndex={viewerIndex}
          taskId={taskId}
          onClose={() => setViewerIndex(null)}
        />
      )}
    </div>
  );
}
