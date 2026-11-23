'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  ListChecks,
  LayoutDashboard,
} from 'lucide-react';
import { motion } from 'framer-motion';

const HERO_STATS = [
  {
    value: '6 أقسام',
    label: 'هيكل تنظيمي جاهز',
    color: 'text-primary',
  },
  {
    value: 'تقدم مستقل',
    label: 'لكل عضو في المهمة',
    color: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    value: '15 دقيقة',
    label: 'روابط مرفقات مشفرة',
    color: 'text-violet-600 dark:text-violet-400',
  },
  {
    value: '48 ساعة',
    label: 'تنظيف ذاتي للتنبيهات',
    color: 'text-amber-600 dark:text-amber-400',
  },
];

export default function LandingHero() {
  const { user, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const primaryHref =
    mounted && isAuthenticated && user
      ? !user.isVerified
        ? '/waiting-approval'
        : user.role === 'admin'
        ? '/admin/dashboard'
        : '/dashboard'
      : '/register';

  const primaryLabel =
    mounted && isAuthenticated && user
      ? !user.isVerified
        ? 'متابعة حالة تفعيل الحساب'
        : 'الانتقال إلى لوحة التحكم'
      : 'ابدأ رحلتك مع فريقك الآن';

  return (
    <section
      className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-6 lg:px-8"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Right Column (RTL): Copy & CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="lg:col-span-6 text-right space-y-6"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-[1.25] tracking-tight">
            نظّم شغل شركتك، وتابع إنجاز{' '}
            <span className="text-primary">كل فرد في فريقك</span> بدقة ووضوح
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
            نظام متكامل لإدارة المهام المشتركة والشخصية مصمم خصيصاً للفرق العربية. حدّد
            القسم والمسمى الوظيفي لكل عضو، وزّع المهام مع تتبع تقدم مستقل لكل موظف،
            وشارك المرفقات بأمان تام وروابط مشفرة مؤقتة.
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
            <Link
              href={primaryHref}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/95 active:scale-[0.99] transition-all shadow-lg shadow-primary/25"
            >
              {mounted && isAuthenticated && user ? (
                <LayoutDashboard className="h-4 w-4" />
              ) : null}
              <span>{primaryLabel}</span>
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-[#101828] border border-border dark:border-transparent text-foreground text-sm font-bold hover:border-primary/50 hover:text-primary transition-all shadow-100 dark:shadow-300"
            >
              <span>شاهد مراحل العمل</span>
            </a>
          </div>

          {/* Trust & Capability Highlights (Compact + Floating Animation) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-border/60 dark:border-transparent">
            {HERO_STATS.map((stat, idx) => (
              <motion.div
                key={stat.value}
                animate={{ y: [0, -5, 0] }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: idx * 0.4,
                }}
                whileHover={{ y: -4, scale: 1.03 }}
                className="p-2.5 rounded-xl bg-white dark:bg-[#101828] border border-border/60 dark:border-transparent shadow-100 dark:shadow-300 text-center sm:text-right cursor-default"
              >
                <p className={`text-sm sm:text-base font-extrabold ${stat.color} leading-tight`}>
                  {stat.value}
                </p>
                <p className="text-[10px] font-semibold text-muted-foreground mt-0.5 leading-snug">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Left Column (RTL): Clean, Scannable Workspace Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: 'easeOut' }}
          className="lg:col-span-6"
        >
          <div className="rounded-3xl bg-white dark:bg-[#101828] border border-border/60 dark:border-transparent shadow-400 p-6 sm:p-8 space-y-6">
            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="text-sm font-extrabold text-foreground">
                  مساحة عمل الفريق
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-extrabold">
                50% مكتمل
              </span>
            </div>

            {/* Task Title & Progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-muted-foreground">
                  فريق التطوير والبرمجة
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold">
                  أولوية عالية
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-extrabold text-foreground leading-snug">
                إطلاق بوابة تسجيل الموظفين الجديدة
              </h3>

              <div className="h-2 w-full rounded-full bg-muted dark:bg-slate-800 overflow-hidden">
                <div className="h-full w-1/2 rounded-full bg-primary transition-all" />
              </div>
            </div>

            {/* Clean Assignee Progress Rows */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 bg-slate-50 dark:bg-[#0b1120] p-3.5 rounded-2xl border border-border/50 dark:border-transparent shadow-100">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-extrabold shrink-0">
                    أح
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground leading-none">
                      أحمد محمد
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Backend Developer
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>مكتملة</span>
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 bg-slate-50 dark:bg-[#0b1120] p-3.5 rounded-2xl border border-border/50 dark:border-transparent shadow-100">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-extrabold shrink-0">
                    سا
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground leading-none">
                      سارة علي
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Frontend Developer
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold shrink-0">
                  <ListChecks className="h-3.5 w-3.5" />
                  <span>3 / 4 مهام</span>
                </span>
              </div>
            </div>

            {/* Simple Footer Note */}
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground pt-1">
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>تكتمل المهمة كلياً عند إنهاء كل الأعضاء لأدوارهم</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
