'use client';

import React from 'react';
import Link from 'next/link';
import { Trello, ArrowLeft } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer
      className="bg-white dark:bg-[#0b1120] border-t border-border/80 dark:border-slate-800 pt-14 pb-8 px-4 sm:px-6 lg:px-8"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Final CTA Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-primary text-primary-foreground shadow-400 flex flex-col lg:flex-row items-center justify-between gap-6 text-right">
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              جاهز لتنظيم مهام شركتك بطريقة احترافية؟
            </h2>
            <p className="text-xs sm:text-sm text-primary-foreground/85 leading-relaxed">
              ابدأ الآن باختيار قسمك ومسمّاك الوظيفي في 3 خطوات سريعة، أو سجّل الدخول لمتابعة مشاريع فريقك.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-primary font-extrabold text-sm hover:bg-slate-100 transition-all shadow-md"
            >
              <span>إنشاء حساب جديد</span>
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary-foreground/15 border border-primary-foreground/30 text-white font-bold text-sm hover:bg-primary-foreground/25 transition-all"
            >
              تسجيل الدخول
            </Link>
          </div>
        </div>

        {/* Bottom Footer Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/60 dark:border-slate-800 text-xs text-muted-foreground">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Trello className="h-4 w-4" />
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
