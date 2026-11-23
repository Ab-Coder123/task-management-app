'use client';

import Link from 'next/link';
import { WifiOff, RefreshCw, Home } from 'lucide-react';

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <main
      dir="rtl"
      className="relative flex min-h-screen items-center justify-center bg-[#f3f5f9] px-4 py-12 dark:bg-[#0b1120]"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-[0_18px_50px_-15px_rgba(15,23,42,0.12)] dark:bg-[#101828] dark:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.6)]">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
          <WifiOff className="h-8 w-8" />
        </div>

        <h1 className="mb-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          أنت غير متصل بالإنترنت حالياً
        </h1>
        <p className="mb-6 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          تعذر الوصول إلى خادم TaskSaaS. تأكد من اتصالك بالشبكة ثم أعد المحاولة لاستئناف العمل ومتابعة مهام فريقك.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={handleRetry}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <RefreshCw className="h-4 w-4" />
            <span>إعادة المحاولة</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <Home className="h-4 w-4" />
            <span>الرئيسية</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
