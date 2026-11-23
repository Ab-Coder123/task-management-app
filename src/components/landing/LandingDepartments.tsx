'use client';

import React from 'react';
import Link from 'next/link';
import { COMPANY_TEAMS, CompanyTeam } from '@/lib/constants/departments';
import {
  Code2,
  Palette,
  Kanban,
  Megaphone,
  Briefcase,
  Settings2,
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

export default function LandingDepartments() {
  return (
    <section
      id="departments"
      className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0b1120] border-y border-border/60 dark:border-slate-800/80"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="inline-block px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-extrabold">
            الهيكل التنظيمي المدعوم
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            اختر فريقك وابدأ التسجيل مباشرة
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            تدعم المنصة 6 أقسام رئيسية داخل الشركات بمسمياتها الوظيفية. اضغط على أي قسم للانتقال مباشرةً لاختيار وظيفتك وإكمال حسابك.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {COMPANY_TEAMS.map((team, idx) => {
            const Icon = TEAM_ICONS[team.iconName];
            return (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="group p-6 rounded-2xl bg-background dark:bg-[#101828] border border-border/80 dark:border-slate-800 shadow-200 hover:border-primary/50 transition-all flex flex-col justify-between text-right"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="h-11 w-11 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-bold text-primary/80 bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/15">
                      {team.jobs.length} مسميات وظيفية
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-foreground">
                    {team.name}
                  </h3>
                  <p className="text-[11px] font-semibold text-primary/80 mt-0.5">
                    {team.nameEn}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {team.description}
                  </p>

                  {/* Sample Job Titles */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {team.jobs.slice(0, 3).map((job) => (
                      <span
                        key={job}
                        className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-border/70 dark:border-slate-700 text-[10px] font-semibold text-foreground/80"
                      >
                        {job}
                      </span>
                    ))}
                    {team.jobs.length > 3 && (
                      <span className="px-2 py-0.5 rounded-md bg-muted dark:bg-slate-800 text-[10px] font-bold text-muted-foreground">
                        +{team.jobs.length - 3} أخرى
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  href={`/register?team=${team.id}`}
                  className="mt-5 pt-4 border-t border-border/50 dark:border-slate-800 flex items-center justify-between text-xs font-extrabold text-primary hover:underline"
                >
                  <span>التسجيل في هذا القسم</span>
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
