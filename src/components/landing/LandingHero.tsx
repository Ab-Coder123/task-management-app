'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/lib/store/authStore';
import {
  ArrowLeft,
  LayoutDashboard,
  Lock,
  PanelRight,
  CheckCircle2,
  Monitor,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SHOWCASE_VIEWS = [
  {
    id: 'dashboard',
    label: 'لوحة المهام (ليلي)',
    url: 'tasksaas.app/dashboard',
    image: '/images/landing/dashboard-dark.jpg',
    alt: 'لوحة المهام الرئيسية في الوضع الليلي',
    icon: LayoutDashboard,
    backdrop: 'from-slate-900 via-blue-950 to-indigo-950',
  },
  {
    id: 'personal',
    label: 'المهام الشخصية (مضيء)',
    url: 'tasksaas.app/dashboard/personal-tasks',
    image: '/images/landing/personal-tasks-light.png',
    alt: 'صفحة مهامي الشخصية الخاصة في الوضع المضيء',
    icon: Lock,
    backdrop: 'from-blue-600 via-indigo-600 to-violet-700',
  },
  {
    id: 'sidebar',
    label: 'التنقل السريع (Sidebar)',
    url: 'tasksaas.app/workspace',
    image: '/images/landing/sidebar-dark.png',
    alt: 'القائمة الجانبية والتنقل السريع بين الأقسام',
    icon: PanelRight,
    backdrop: 'from-emerald-950 via-teal-900 to-slate-900',
  },
] as const;

const HERO_STATS = [
  { value: '6 أقسام', label: 'هيكل تنظيمي جاهز', color: 'text-primary' },
  { value: 'تقدم مستقل', label: 'لكل عضو في المهمة', color: 'text-emerald-600 dark:text-emerald-400' },
  { value: '15 دقيقة', label: 'روابط مرفقات مشفرة', color: 'text-violet-600 dark:text-violet-400' },
  { value: '48 ساعة', label: 'تنظيف ذاتي للتنبيهات', color: 'text-amber-600 dark:text-amber-400' },
];

export default function LandingHero() {
  const { user, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'personal' | 'sidebar'>('dashboard');

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
        ? 'متابعة حالة الحساب'
        : 'الانتقال إلى لوحة التحكم'
      : 'ابدأ مع فريقك مجاناً';

  const currentView =
    SHOWCASE_VIEWS.find((v) => v.id === activeView) || SHOWCASE_VIEWS[0];

  return (
    <section
      id="showcase"
      className="pt-10 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-6 lg:px-8"
      dir="rtl"
    >
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Centered Notion-Style Hero Headline */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="text-center max-w-3xl mx-auto space-y-5"
        >
          <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-foreground leading-[1.2] tracking-tight">
            مساحة عمل واحدة{' '}
            <span className="text-primary">تنظّم فريقك</span> ومهام شركتك.
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
            نظام إدارة مهام عربي مصمم للفرق والشركات: مهام مشتركة بتقدم مستقل لكل
            موظف، مساحة خاصة معزولة، واعتماد إداري منظم من اللحظة الأولى.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
            <Link
              href={primaryHref}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-foreground dark:bg-primary text-background dark:text-white text-sm font-extrabold hover:opacity-95 active:scale-[0.99] transition-all shadow-lg"
            >
              <span>{primaryLabel}</span>
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-[#101828] border border-border/80 dark:border-transparent text-foreground text-sm font-bold hover:text-primary transition-all shadow-100 dark:shadow-300"
            >
              <span>استكشف رحلة العمل</span>
            </a>
          </div>
        </motion.div>

        {/* Centered Atmospheric Stage with Real App Screenshots & Dock */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: 'easeOut' }}
          className={`relative rounded-3xl p-4 sm:p-8 lg:p-10 bg-gradient-to-br ${currentView.backdrop} shadow-500 overflow-hidden transition-colors duration-500`}
        >
          {/* Ambient soft light mesh */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />

          {/* Floating App Browser/Desktop Window */}
          <div className="relative z-10 max-w-5xl mx-auto rounded-2xl bg-white dark:bg-[#0b1120] shadow-600 overflow-hidden border border-black/10 dark:border-transparent">
            {/* macOS Window Chrome */}
            <div className="h-10 px-4 bg-slate-100 dark:bg-[#101828] flex items-center justify-between border-b border-slate-200 dark:border-transparent">
              <div className="flex items-center gap-1.5" dir="ltr">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="px-3 py-1 rounded-md bg-white dark:bg-slate-900 text-[10px] font-mono text-muted-foreground shadow-sm truncate max-w-[200px] sm:max-w-xs">
                {currentView.url}
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-primary">
                <Monitor className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">معاينة حقيقية</span>
              </div>
            </div>

            {/* Real Screenshot Display */}
            <div className="relative w-full bg-[#0b1120]">
              <AnimatePresence mode="wait">
                {activeView === 'sidebar' ? (
                  <motion.div
                    key="sidebar-composite"
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.28 }}
                    className="grid grid-cols-12 bg-[#0b1120]"
                  >
                    <div className="col-span-4 sm:col-span-3 relative aspect-[9/14] sm:aspect-auto sm:min-h-[380px] bg-[#0b1120]">
                      <Image
                        src="/images/landing/sidebar-dark.png"
                        alt="القائمة الجانبية للتنقل بين المهام"
                        fill
                        className="object-cover object-top"
                        priority
                      />
                    </div>
                    <div className="col-span-8 sm:col-span-9 relative aspect-[16/10] sm:min-h-[380px]">
                      <Image
                        src="/images/landing/dashboard-dark.jpg"
                        alt="لوحة المهام الرئيسية في الوضع الليلي"
                        fill
                        className="object-cover object-top"
                        priority
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={currentView.id}
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.28 }}
                    className="relative w-full aspect-[16/9]"
                  >
                    <Image
                      src={currentView.image}
                      alt={currentView.alt}
                      fill
                      className="object-cover object-top"
                      priority
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Notion-Style Floating Bottom Dock Switcher */}
          <div className="relative z-20 mt-5 flex justify-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-white/95 dark:bg-[#101828]/95 shadow-400 border border-white/40 dark:border-transparent">
              {SHOWCASE_VIEWS.map((view) => {
                const Icon = view.icon;
                const isActive = activeView === view.id;
                return (
                  <button
                    key={view.id}
                    type="button"
                    onClick={() => setActiveView(view.id)}
                    className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                        : 'text-foreground/80 hover:bg-muted dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{view.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Compact Floating Stat Pills Underneath */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-4xl mx-auto">
          {HERO_STATS.map((stat, idx) => (
            <motion.div
              key={stat.value}
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: 3.2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: idx * 0.4,
              }}
              whileHover={{ y: -4, scale: 1.03 }}
              className="p-3 rounded-xl bg-white dark:bg-[#101828] border border-border/60 dark:border-transparent shadow-100 dark:shadow-300 text-center cursor-default"
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
      </div>
    </section>
  );
}
