'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Users,
  Lock,
  Bell,
  ListChecks,
  LayoutDashboard,
} from 'lucide-react';
import { motion } from 'framer-motion';

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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-extrabold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>منصة TaskSaaS لإدارة مهام الفرق والشركات</span>
          </div>

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
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-[#101828] border border-border dark:border-slate-700 text-foreground text-sm font-bold hover:border-primary/50 hover:text-primary transition-all shadow-100"
            >
              <span>شاهد مراحل العمل</span>
            </a>
          </div>

          {/* Trust & Capability Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border/60 dark:border-slate-800">
            <div className="p-3 rounded-xl bg-white dark:bg-[#101828] border border-border/60 dark:border-slate-800 shadow-100">
              <p className="text-lg font-extrabold text-primary">6 أقسام</p>
              <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">
                هيكل تنظيمي جاهز
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-[#101828] border border-border/60 dark:border-slate-800 shadow-100">
              <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                تقدم مستقل
              </p>
              <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">
                لكل عضو في المهمة
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-[#101828] border border-border/60 dark:border-slate-800 shadow-100">
              <p className="text-lg font-extrabold text-violet-600 dark:text-violet-400">
                15 دقيقة
              </p>
              <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">
                روابط مرفقات مشفرة
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-[#101828] border border-border/60 dark:border-slate-800 shadow-100">
              <p className="text-lg font-extrabold text-amber-600 dark:text-amber-400">
                48 ساعة
              </p>
              <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">
                تنظيف ذاتي للتنبيهات
              </p>
            </div>
          </div>
        </motion.div>

        {/* Left Column (RTL): Interactive Dashboard Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: 'easeOut' }}
          className="lg:col-span-6"
        >
          <div className="rounded-3xl bg-white dark:bg-[#101828] border border-border/90 dark:border-slate-800 shadow-500 p-4 sm:p-6 space-y-4">
            {/* Mockup Top Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-border/60 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-extrabold text-foreground">
                  معاينة حيّة لمساحة عمل الفريق
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-bold">
                تتبع مستقل لكل عضو
              </span>
            </div>

            {/* Mock Shared Task Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-border/70 dark:border-slate-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold border border-rose-500/20">
                    أولوية عالية
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold border border-amber-500/20">
                    قيد التنفيذ (50%)
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-muted-foreground">
                  فريق التطوير والبرمجة
                </span>
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-foreground">
                  إطلاق بوابة تسجيل الموظفين متعددة الخطوات
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  ربط اختيار القسم والمسمى الوظيفي مع لوحة اعتماد الإدارة.
                </p>
              </div>

              {/* Per-Assignee Progress Preview */}
              <div className="space-y-2 pt-2 border-t border-border/50 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs bg-white dark:bg-[#0b1120] p-2.5 rounded-xl border border-border/60 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                      أح
                    </div>
                    <div>
                      <p className="font-bold text-foreground leading-none">أحمد محمد</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Backend Developer
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                    <CheckCircle2 className="h-3 w-3" />
                    مكتملة لديه
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs bg-white dark:bg-[#0b1120] p-2.5 rounded-xl border border-border/60 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/15 text-primary flex items-center justify-center text-[10px] font-bold">
                      سا
                    </div>
                    <div>
                      <p className="font-bold text-foreground leading-none">سارة علي</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Frontend Developer
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                    <ListChecks className="h-3 w-3" />
                    3 / 4 مهام فرعية
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Mini Feature Strip */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border/60 dark:border-slate-800">
                <Users className="h-4 w-4 text-primary mx-auto mb-1" />
                <p className="text-[10px] font-bold text-foreground">توزيع حسب القسم</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border/60 dark:border-slate-800">
                <Lock className="h-4 w-4 text-emerald-500 mx-auto mb-1" />
                <p className="text-[10px] font-bold text-foreground">مهام خاصة محمية</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border/60 dark:border-slate-800">
                <Bell className="h-4 w-4 text-amber-500 mx-auto mb-1" />
                <p className="text-[10px] font-bold text-foreground">تنبيهات فورية</p>
              </div>
            </div>

            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                <span>المهمة تكتمل كلياً عند إنهاء كل الأعضاء أدوارهم</span>
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
