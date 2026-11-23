'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer
      className="bg-white dark:bg-[#0b1120] border-t border-border/80 dark:border-transparent pt-16 pb-10 px-4 sm:px-6 lg:px-8"
      dir="rtl"
    >
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Notion-Style Clean Centered Final CTA */}
        <div className="text-center max-w-2xl mx-auto space-y-5">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            انضم للطريقة الحديثة في إدارة عملك.
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            ابدأ في تنظيم فريقك الآن خلال دقائق: اختر قسمك ومسمّاك الوظيفي في 3 خطوات
            سريعة واستمتع ببيئة عمل واضحة وآمنة.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-foreground dark:bg-primary text-background dark:text-white font-extrabold text-sm hover:opacity-95 transition-all shadow-lg"
            >
              <span>إنشاء حساب جديد</span>
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-slate-100 dark:bg-[#101828] border border-border/70 dark:border-transparent text-foreground font-bold text-sm hover:text-primary transition-all shadow-100 dark:shadow-300"
            >
              تسجيل الدخول
            </Link>
          </div>
        </div>

        {/* Multi-Column Notion-Style Footer */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-8 pt-10 border-t border-border/60 dark:border-transparent text-right">
          {/* Brand Column */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 dark:bg-slate-800/90 shadow-100">
                <span className="text-lg leading-none select-none" aria-hidden="true">
                  ✔️
                </span>
              </div>
              <div>
                <span className="text-base font-extrabold text-foreground block leading-none">
                  مدير المهام
                </span>
                <span className="text-[10px] font-bold text-primary">TaskSaaS</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
              منصة عربية لإدارة مهام الفِرق والشركات بخصوصية عالية وتتبع تقدم مستقل لكل عضو.
            </p>
          </div>

          {/* Column 1 */}
          <div className="space-y-2.5">
            <p className="text-xs font-extrabold text-foreground">المنصة</p>
            <ul className="space-y-2 text-xs text-muted-foreground font-medium">
              <li>
                <a href="/#showcase" className="hover:text-primary transition-colors">
                  معاينة التطبيق
                </a>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-primary transition-colors">
                  كيف يعمل النظام
                </a>
              </li>
              <li>
                <a href="/#features" className="hover:text-primary transition-colors">
                  المميزات الهندسية
                </a>
              </li>
              <li>
                <a href="/#faq" className="hover:text-primary transition-colors">
                  الأسئلة الشائعة
                </a>
              </li>
              <li>
                <Link href="/download" className="hover:text-primary transition-colors">
                  تحميل التطبيق (Desktop & PWA)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="space-y-2.5">
            <p className="text-xs font-extrabold text-foreground">الأقسام</p>
            <ul className="space-y-2 text-xs text-muted-foreground font-medium">
              <li>
                <Link href="/register?team=engineering" className="hover:text-primary transition-colors">
                  التطوير والبرمجة
                </Link>
              </li>
              <li>
                <Link href="/register?team=design" className="hover:text-primary transition-colors">
                  التصميم و UI/UX
                </Link>
              </li>
              <li>
                <Link href="/register?team=product" className="hover:text-primary transition-colors">
                  إدارة المنتجات
                </Link>
              </li>
              <li>
                <Link href="/register?team=marketing" className="hover:text-primary transition-colors">
                  التسويق والنمو
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="space-y-2.5">
            <p className="text-xs font-extrabold text-foreground">الحساب</p>
            <ul className="space-y-2 text-xs text-muted-foreground font-medium">
              <li>
                <Link href="/register" className="hover:text-primary transition-colors">
                  إنشاء حساب جديد
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-primary transition-colors">
                  تسجيل الدخول
                </Link>
              </li>
              <li>
                <a href="/#roles" className="hover:text-primary transition-colors">
                  مقارنة الصلاحيات
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-border/50 dark:border-transparent flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-muted-foreground">
          <p className="font-semibold">TaskSaaS — منصة إدارة المهام الاحترافية</p>
          <p>جميع الحقوق محفوظة &copy; 2026</p>
        </div>
      </div>
    </footer>
  );
}
