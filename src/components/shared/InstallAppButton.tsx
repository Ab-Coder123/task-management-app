'use client';

import { useEffect, useState } from 'react';
import { Download, CheckCircle2, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface InstallAppButtonProps {
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function InstallAppButton({ variant = 'primary', className = '' }: InstallAppButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as { standalone?: boolean }).standalone === true;
    if (checkStandalone) {
      setIsInstalled(true);
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      setShowInstructions((prev) => !prev);
      return;
    }

    setIsInstalling(true);
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } finally {
      setIsInstalling(false);
    }
  };

  if (isInstalled) {
    return (
      <div
        className={`inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 ${className}`}
      >
        <CheckCircle2 className="h-4 w-4" />
        <span>التطبيق مثبت وجاهز على جهازك</span>
      </div>
    );
  }

  const buttonClasses =
    variant === 'primary'
      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20'
      : 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700';

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleInstallClick}
        disabled={isInstalling}
        className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all disabled:opacity-60 ${buttonClasses} ${className}`}
      >
        {deferredPrompt ? <Download className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
        <span>
          {isInstalling
            ? 'جاري التثبيت...'
            : deferredPrompt
            ? 'تثبيت كتطبيق على الجهاز'
            : 'طريقة التثبيت من المتصفح'}
        </span>
      </button>

      {showInstructions && !deferredPrompt && (
        <p className="rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs leading-relaxed text-slate-600 shadow-sm dark:bg-[#0f172a] dark:text-slate-300">
          افتح قائمة المتصفح (أو زر المشاركة في Safari) واختر{' '}
          <strong className="font-semibold text-slate-900 dark:text-white">تثبيت التطبيق</strong> أو{' '}
          <strong className="font-semibold text-slate-900 dark:text-white">Add to Home Screen</strong>.
        </p>
      )}
    </div>
  );
}
