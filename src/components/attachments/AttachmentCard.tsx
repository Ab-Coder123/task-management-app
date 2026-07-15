'use client';

import React from 'react';
import { TaskAttachment } from '@/lib/types';
import { FileText, Image, Archive, File, Download, Trash2, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface FileIconProps { mimeType: string; size?: number }
function FileIconBadge({ mimeType, size = 24 }: FileIconProps) {
  const s = size / 24;
  const cls = `transition-transform`;
  if (mimeType.startsWith('image/'))
    return <div className="flex items-center justify-center rounded-xl bg-blue-500/15 border border-blue-500/25 p-2.5"><Image className={cls} style={{ width: size, height: size }} strokeWidth={1.5} color="#60a5fa" /></div>;
  if (mimeType === 'application/pdf')
    return <div className="flex items-center justify-center rounded-xl bg-rose-500/15 border border-rose-500/25 p-2.5"><FileText className={cls} style={{ width: size, height: size }} strokeWidth={1.5} color="#f87171" /></div>;
  if (mimeType.includes('zip'))
    return <div className="flex items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/25 p-2.5"><Archive className={cls} style={{ width: size, height: size }} strokeWidth={1.5} color="#fbbf24" /></div>;
  if (mimeType.includes('word') || mimeType.includes('document'))
    return <div className="flex items-center justify-center rounded-xl bg-blue-600/15 border border-blue-600/25 p-2.5"><FileText className={cls} style={{ width: size, height: size }} strokeWidth={1.5} color="#3b82f6" /></div>;
  if (mimeType.includes('excel') || mimeType.includes('sheet'))
    return <div className="flex items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/25 p-2.5"><FileText className={cls} style={{ width: size, height: size }} strokeWidth={1.5} color="#34d399" /></div>;
  if (mimeType.includes('powerpoint') || mimeType.includes('presentation'))
    return <div className="flex items-center justify-center rounded-xl bg-orange-500/15 border border-orange-500/25 p-2.5"><FileText className={cls} style={{ width: size, height: size }} strokeWidth={1.5} color="#fb923c" /></div>;
  return <div className="flex items-center justify-center rounded-xl bg-slate-500/15 border border-slate-500/25 p-2.5"><File className={cls} style={{ width: size, height: size }} strokeWidth={1.5} color="#94a3b8" /></div>;
}

interface AttachmentCardProps {
  attachment: TaskAttachment;
  taskId: string;
  canDelete?: boolean;
  onClick?: (attachment: TaskAttachment) => void;
  onDelete?: (attachmentId: string) => void;
}

export default function AttachmentCard({ attachment, canDelete = false, onClick, onDelete }: AttachmentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.18 }}
      className="group relative flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5 hover:border-primary/40 hover:bg-primary/3 cursor-pointer transition-all duration-200 shadow-sm"
      onClick={() => onClick?.(attachment)}
      dir="rtl"
    >
      {/* File Icon */}
      <FileIconBadge mimeType={attachment.mimeType} size={22} />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate leading-tight">
          {attachment.originalName}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground">{formatBytes(attachment.size)}</span>
          {attachment.uploadedAt && (
            <>
              <span className="text-muted-foreground/40">•</span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {formatDate(attachment.uploadedAt)}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          title="تحميل"
          onClick={e => {
            e.stopPropagation();
            window.open(attachment.url, '_blank');
          }}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition"
        >
          <Download className="h-3.5 w-3.5" />
        </button>
        {canDelete && (
          <button
            type="button"
            title="حذف"
            onClick={e => {
              e.stopPropagation();
              if (confirm(`هل تريد حذف "${attachment.originalName}"؟`)) {
                onDelete?.(attachment.id);
              }
            }}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
