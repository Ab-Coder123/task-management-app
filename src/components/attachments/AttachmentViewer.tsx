'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TaskAttachment } from '@/lib/types';
import { X, Download, ChevronLeft, ChevronRight, Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCw, Loader2, Archive, FileText, File } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { attachmentsApi } from '@/lib/api/tasks';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isImage(mimeType: string) { return mimeType.startsWith('image/'); }
function isPdf(mimeType: string) { return mimeType === 'application/pdf'; }
function isText(mimeType: string) { return mimeType === 'text/plain'; }
function isZip(mimeType: string) { return mimeType.includes('zip'); }
function isOffice(mimeType: string) {
  return mimeType.includes('word') || mimeType.includes('excel') || mimeType.includes('sheet') ||
    mimeType.includes('powerpoint') || mimeType.includes('presentation') || mimeType.includes('document');
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface AttachmentViewerProps {
  attachments: TaskAttachment[];
  initialIndex?: number;
  taskId: string;
  onClose: () => void;
}

export default function AttachmentViewer({ attachments, initialIndex = 0, taskId, onClose }: AttachmentViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [textContent, setTextContent] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const current = attachments[currentIndex];

  // ── Fetch signed URL whenever attachment changes ──────────────────────────
  useEffect(() => {
    if (!current) return;
    setLoading(true);
    setError(null);
    setSignedUrl(null);
    setTextContent(null);
    setZoom(1);

    attachmentsApi.getSignedUrl(taskId, current.id)
      .then(async ({ signedUrl: url }) => {
        setSignedUrl(url);
        // For text files, fetch content directly
        if (isText(current.mimeType)) {
          try {
            const txt = await fetch(url).then(r => r.text());
            setTextContent(txt);
          } catch {
            setTextContent('تعذّر تحميل محتوى الملف.');
          }
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'تعذّر تحميل الملف.');
        setLoading(false);
      });
  }, [current?.id, taskId]);

  // ── Keyboard navigation ───────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goNext();
      if (e.key === 'ArrowRight') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentIndex, attachments.length]);

  // ── Fullscreen ────────────────────────────────────────────────────────────
  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const goPrev = () => { if (currentIndex > 0) setCurrentIndex(i => i - 1); };
  const goNext = () => { if (currentIndex < attachments.length - 1) setCurrentIndex(i => i + 1); };

  // ── Render file content ───────────────────────────────────────────────────
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center gap-3 h-full text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm">جارٍ تحميل الملف...</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center gap-3 h-full text-rose-400">
          <FileText className="h-12 w-12 opacity-40" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      );
    }
    if (!signedUrl) return null;

    const mime = current.mimeType;

    // Image
    if (isImage(mime)) {
      return (
        <div className="flex items-center justify-center h-full overflow-auto p-4">
          <img
            src={signedUrl}
            alt={current.originalName}
            style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s ease', transformOrigin: 'center center', maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            draggable={false}
          />
        </div>
      );
    }

    // PDF
    if (isPdf(mime)) {
      return (
        <iframe
          src={`${signedUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
          className="w-full h-full border-0 rounded-b-2xl"
          title={current.originalName}
          allow="fullscreen"
        />
      );
    }

    // Text
    if (isText(mime)) {
      return (
        <div className="h-full overflow-auto p-6">
          <pre className="text-xs text-foreground font-mono whitespace-pre-wrap leading-relaxed break-words bg-slate-900/60 p-4 rounded-xl border border-border">
            {textContent || 'جارٍ التحميل...'}
          </pre>
        </div>
      );
    }

    // Office — Google Docs Viewer
    if (isOffice(mime)) {
      return (
        <iframe
          src={`https://docs.google.com/gview?url=${encodeURIComponent(signedUrl)}&embedded=true`}
          className="w-full h-full border-0 rounded-b-2xl"
          title={current.originalName}
          allow="fullscreen"
        />
      );
    }

    // ZIP / unknown
    return (
      <div className="flex flex-col items-center justify-center gap-4 h-full text-muted-foreground">
        <Archive className="h-16 w-16 opacity-30" />
        <div className="text-center">
          <p className="font-semibold text-foreground text-sm">{current.originalName}</p>
          <p className="text-xs mt-1">{formatBytes(current.size)}</p>
          <p className="text-xs mt-0.5 text-muted-foreground">لا يمكن معاينة هذا النوع من الملفات — يرجى تنزيله.</p>
        </div>
        <a
          href={signedUrl}
          download={current.originalName}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-primary/90 transition"
        >
          <Download className="h-4 w-4" />
          تنزيل الملف
        </a>
      </div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          ref={containerRef}
          initial={{ scale: 0.93, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.93, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          className={`relative flex flex-col bg-slate-950 border border-slate-800 shadow-2xl rounded-2xl overflow-hidden
            ${isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-4xl h-[88vh]'}`}
          dir="rtl"
        >
          {/* ── Header ──────────────────────────────────────────────────────── */}
          <div className="flex items-center gap-3 border-b border-slate-800 bg-slate-900/80 px-4 py-3 shrink-0">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground truncate">{current?.originalName}</p>
              <p className="text-xs text-muted-foreground">{current && formatBytes(current.size)}</p>
            </div>

            {/* Attachment thumbnails / counter */}
            {attachments.length > 1 && (
              <div className="flex items-center gap-1.5 flex-wrap max-w-xs">
                {attachments.map((a, i) => (
                  <button
                    key={a.id}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-6 px-2 rounded-lg text-xs font-semibold transition ${i === currentIndex ? 'bg-primary text-white' : 'bg-slate-800 text-muted-foreground hover:bg-slate-700'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Zoom (images only) */}
              {current && isImage(current.mimeType) && !loading && (
                <>
                  <button onClick={() => setZoom(z => Math.max(0.25, z - 0.25))} className="viewer-btn" title="تصغير"><ZoomOut className="h-4 w-4" /></button>
                  <span className="text-xs text-muted-foreground w-8 text-center">{Math.round(zoom * 100)}%</span>
                  <button onClick={() => setZoom(z => Math.min(4, z + 0.25))} className="viewer-btn" title="تكبير"><ZoomIn className="h-4 w-4" /></button>
                  <button onClick={() => setZoom(1)} className="viewer-btn" title="إعادة ضبط"><RotateCw className="h-4 w-4" /></button>
                </>
              )}

              {/* Download */}
              {signedUrl && (
                <a href={signedUrl} download={current?.originalName} className="viewer-btn" title="تنزيل">
                  <Download className="h-4 w-4" />
                </a>
              )}

              {/* Fullscreen */}
              <button onClick={toggleFullscreen} className="viewer-btn" title="ملء الشاشة">
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>

              {/* Close */}
              <button onClick={onClose} className="viewer-btn text-rose-400 hover:bg-rose-500/15" title="إغلاق">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* ── Content ─────────────────────────────────────────────────────── */}
          <div className="flex-1 overflow-hidden relative">
            {renderContent()}
          </div>

          {/* ── Navigation arrows ───────────────────────────────────────────── */}
          {attachments.length > 1 && (
            <>
              <button
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 disabled:opacity-20 transition z-10"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <button
                onClick={goNext}
                disabled={currentIndex === attachments.length - 1}
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 disabled:opacity-20 transition z-10"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
