'use client';

import React from 'react';
import Link from 'next/link';
import { COMPANY_TEAMS, CompanyTeam } from '@/lib/constants/departments';
import {
  GitMerge,
  FileKey2,
  BellRing,
  ShieldCheck,
  Code2,
  Palette,
  Kanban,
  Megaphone,
  Briefcase,
  Settings2,
  Lock,
  MessageSquare,
  ArrowLeft,
} from 'lucide-react';
import { motion } from 'framer-motion';

const TEAM_ICONS: Record<CompanyTeam['iconName'], React.ComponentType<{ className?: string }>> = {
  Code2,
  Palette,
  Kanban,
  Megaphone,
  Briefcase,
  Settings2,
};

const CONTEXT_PILLARS = [
  {
    title: 'ربط فوري بين الأقسام',
    description:
      'يعمل قسم التطوير والتصميم والمنتجات في منظومة واحدة دون فقدان سياق المهام.',
  },
  {
    title: 'تأمين على مستوى الـ Edge',
    description:
      'التحقق من الهوية والدور عبر Next.js Middleware قبل تحميل الصفحات الحساسة.',
  },
  {
    title: 'دعم حقيقي لخصوصية العمل',
    description:
      'مرفقات بروابط موقعة تنتهي خلال 15 دقيقة وتنبيهات ذاتية التنظيف كل 48 ساعة.',
  },
];

const HUB_MODULES = [
  {
    name: 'التقدم المستقل',
    subtitle: 'Assignee Progress',
    icon: GitMerge,
    color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10',
  },
  {
    name: 'المهام الشخصية',
    subtitle: 'Private Checklist',
    icon: Lock,
    color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
  },
  {
    name: 'المرفقات المؤمنة',
    subtitle: 'Signed URLs • 15m',
    icon: FileKey2,
    color: 'text-violet-600 dark:text-violet-400 bg-violet-500/10',
  },
  {
    name: 'التنبيهات الذكية',
    subtitle: 'Auto-TTL • 48h',
    icon: BellRing,
    color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10',
  },
  {
    name: 'المناقشات والتعليقات',
    subtitle: 'Team Discussions',
    icon: MessageSquare,
    color: 'text-rose-600 dark:text-rose-400 bg-rose-500/10',
  },
];

export default function LandingFeatures() {
  return (
    <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Heading + 3 Pillars (Notion Context Section) */}
        <div className="space-y-8">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight text-right">
            كل سياق عمل شركتك، في مكان واحد.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CONTEXT_PILLARS.map((pillar) => (
              <div key={pillar.title} className="space-y-1.5 text-right">
                <h3 className="text-sm sm:text-base font-extrabold text-foreground">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 2-Sided Notion Hub + Company OS Grid */}
        <div
          id="company-os"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
        >
          {/* Start Column (RTL): Connected Modules List */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-4 space-y-2.5"
          >
            {HUB_MODULES.map((mod) => {
              const Icon = mod.icon;
              return (
                <div
                  key={mod.name}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#101828] border border-border/70 dark:border-transparent shadow-100 dark:shadow-300"
                >
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${mod.color}`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-extrabold text-foreground leading-none">
                      {mod.name}
                    </p>
                    <p className="text-[10px] font-semibold text-muted-foreground mt-1">
                      {mod.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Center Connector Node (Desktop) */}
          <div className="lg:col-span-1 flex items-center justify-center py-2">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white dark:bg-[#101828] border border-border/80 dark:border-transparent shadow-400">
              <span className="text-2xl leading-none select-none" aria-hidden="true">
                ✔️
              </span>
              <span className="hidden lg:block absolute -right-6 top-1/2 w-6 h-px bg-border dark:bg-slate-700" />
              <span className="hidden lg:block absolute -left-6 top-1/2 w-6 h-px bg-border dark:bg-slate-700" />
            </div>
          </div>

          {/* End Column (RTL): Company OS Organization Card */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-7 p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#101828] border border-border/80 dark:border-transparent shadow-400 space-y-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-border/50 dark:border-transparent">
              <div>
                <p className="text-xs font-bold text-primary">الهيكل التنظيمي الموحد</p>
                <h3 className="text-lg font-extrabold text-foreground">
                  Company OS — منظومة الأقسام
                </h3>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>جاهز للتسجيل المباشر</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COMPANY_TEAMS.map((team) => {
                const Icon = TEAM_ICONS[team.iconName];
                return (
                  <Link
                    key={team.id}
                    href={`/register?team=${team.id}`}
                    className="group p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0b1120] border border-border/60 dark:border-transparent shadow-100 hover:border-primary/40 transition-all flex items-start gap-3"
                  >
                    <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-extrabold text-foreground truncate">
                          {team.name}
                        </p>
                        <ArrowLeft className="h-3 w-3 text-muted-foreground group-hover:text-primary shrink-0 transition-transform group-hover:-translate-x-0.5" />
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1 truncate">
                        {team.jobs.slice(0, 2).join(' • ')}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
