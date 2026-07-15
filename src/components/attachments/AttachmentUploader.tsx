'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, File, FileText, Image, Archive, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'application/zip',
  'application/x-zip-compressed',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/svg+xml',
  'image/webp',
];

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) return <Image className="h-5 w-5 text-blue-400" />;
  if (mimeType === 'application/pdf') return <FileText className="h-5 w-5 text-rose-400" />;
  if (mimeType.includes('zip')) return <Archive className="h-5 w-5 text-amber-400" />;
  return <File className="h-5 w-5 text-slate-400" />;
}

interface FileEntry {
  file: File;
  id: string;
  error?: string;
  uploading?: boolean;
  done?: boolean;
}

interface AttachmentUploaderProps {
  taskId?: string;                        // undefined = task not yet created (queue mode)
  onUploadComplete?: (attachments: any[]) => void;
  onFilesQueued?: (files: File[]) => void; // used when taskId is not yet known
  existingCount?: number;
}

export default function AttachmentUploader({ taskId, onUploadComplete, onFilesQueued, existingCount = 0 }: AttachmentUploaderProps) {
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | undefined => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `نوع الملف غير مدعوم (${file.type})`;
    }
    if (file.size > MAX_SIZE) {
      return `حجم الملف يتجاوز الحد الأقصى (10 MB)`;
    }
    return undefined;
  };

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const arr = Array.from(newFiles);
    const toAdd: FileEntry[] = arr.map(f => ({
      file: f,
      id: `${Date.now()}-${Math.random()}`,
      error: validateFile(f),
    }));
    setEntries(prev => [...prev, ...toAdd]);

    // If no taskId (queue mode), notify parent immediately
    if (!taskId && onFilesQueued) {
      const validFiles = toAdd.filter(e => !e.error).map(e => e.file);
      if (validFiles.length) onFilesQueued(validFiles);
    }
  }, [taskId, onFilesQueued]);

  const removeEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  const handleUpload = async () => {
    if (!taskId) return;
    const validEntries = entries.filter(e => !e.error && !e.done);
    if (!validEntries.length) return;

    setIsUploading(true);
    // Mark all as uploading
    setEntries(prev => prev.map(e =>
      validEntries.find(v => v.id === e.id) ? { ...e, uploading: true } : e
    ));

    try {
      const { attachmentsApi } = await import('@/lib/api/tasks');
      const files = validEntries.map(e => e.file);
      const result = await attachmentsApi.uploadFiles(taskId, files);

      setEntries(prev => prev.map(e =>
        validEntries.find(v => v.id === e.id) ? { ...e, uploading: false, done: true } : e
      ));

      onUploadComplete?.(result);
    } catch (err: any) {
      setEntries(prev => prev.map(e =>
        validEntries.find(v => v.id === e.id)
          ? { ...e, uploading: false, error: err.message || 'فشل الرفع' }
          : e
      ));
    } finally {
      setIsUploading(false);
    }
  };

  const validCount = entries.filter(e => !e.error).length;
  const totalAllowed = 10 - existingCount;

  return (
    <div className="space-y-3" dir="rtl">
      {/* Drop Zone */}
      <div
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 p-8 text-center
          ${isDragging
            ? 'border-primary bg-primary/5 scale-[1.01]'
            : 'border-border hover:border-primary/50 hover:bg-primary/3 bg-slate-900/40'
          }`}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
          <Upload className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">اسحب الملفات هنا أو انقر للاختيار</p>
          <p className="text-xs text-muted-foreground mt-1">
            PDF، Word، Excel، PowerPoint، TXT، ZIP، صور — حجم أقصى 10 MB لكل ملف
          </p>
          <p className="text-xs text-muted-foreground">الحد الأقصى {totalAllowed} ملف</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.png,.jpg,.jpeg,.svg,.webp"
          className="hidden"
          onChange={e => { if (e.target.files) addFiles(e.target.files); e.target.value = ''; }}
        />
      </div>

      {/* File List */}
      <AnimatePresence>
        {entries.map((entry) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm
              ${entry.error
                ? 'border-rose-500/30 bg-rose-500/5'
                : entry.done
                  ? 'border-emerald-500/30 bg-emerald-500/5'
                  : 'border-border bg-card'
              }`}
          >
            <div className="shrink-0">{getFileIcon(entry.file.type)}</div>
            <div className="flex-1 min-w-0">
              <p className="truncate font-medium text-foreground text-xs">{entry.file.name}</p>
              <p className="text-xs text-muted-foreground">{formatBytes(entry.file.size)}</p>
              {entry.error && (
                <p className="text-xs text-rose-400 mt-0.5">{entry.error}</p>
              )}
            </div>
            <div className="shrink-0 flex items-center gap-2">
              {entry.uploading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
              {entry.done && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
              {entry.error && !entry.uploading && <AlertCircle className="h-4 w-4 text-rose-400" />}
              {!entry.uploading && !entry.done && (
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); removeEntry(entry.id); }}
                  className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:text-rose-400 hover:bg-rose-400/10 transition"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Upload Button (only when taskId is known) */}
      {taskId && validCount > 0 && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={isUploading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-md hover:bg-primary/90 disabled:opacity-50 transition"
        >
          {isUploading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> جارٍ الرفع...</>
          ) : (
            <><Upload className="h-4 w-4" /> رفع {validCount} ملف</>
          )}
        </button>
      )}
    </div>
  );
}
