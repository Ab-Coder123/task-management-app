'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer
      className="bg-white dark:bg-[#0b1120] border-t border-border/80 dark:border-slate-800 pt-14 pb-8 px-4 sm:px-6 lg:px-8"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Final CTA Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-l from-blue-600 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 text-white shadow-500 flex flex-col lg:flex-row items-center justify-between gap-6 text-right">
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              جاهز لتنظيم مهام شركتك بطريقة احترافية؟
            </h2>
            <p className="text-xs sm:text-sm text-blue-50 leading-relaxed">
              ابدأ الآن باختيار قسمك ومسمّاك الوظيفي في 3 خطوات سريعة، أو سجّل الدخول لمتابعة مشاريع فريقك.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-700 font-extrabold text-sm hover:bg-slate-100 transition-all shadow-lg"
            >
              <span>إنشاء حساب جديد</span>
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-800/60 hover:bg-blue-800/80 border border-white/25 dark:border-transparent text-white font-bold text-sm transition-all shadow-md"
            >
              تسجيل الدخول
            </Link>
          </div>
        </div>

        {/* Bottom Footer Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/60 dark:border-slate-800 text-xs text-muted-foreground">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 dark:bg-slate-800/90 shadow-100">
              <span className="text-base leading-none select-none" aria-hidden="true">
                ✔️
              </span>
            </div>
            <span className="font-extrabold text-foreground">مدير المهام — TaskSaaS</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 font-semibold">
            <a href="#how-it-works" className="hover:text-primary transition-colors">
              كيف يعمل
            </a>
            <a href="#features" className="hover:text-primary transition-colors">
              المميزات
            </a>
            <a href="#departments" className="hover:text-primary transition-colors">
              الأقسام
            </a>
            <Link href="/login" className="hover:text-primary transition-colors">
              تسجيل الدخول
            </Link>
            <Link href="/register" className="hover:text-primary transition-colors">
              التسجيل
            </Link>
          </div>

          <p className="font-medium">جميع الحقوق محفوظة &copy; 2026</p>
        </div>
      </div>
    </footer>
  );
}
