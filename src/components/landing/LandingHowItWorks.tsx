'use client';

import React from 'react';
import Image from 'next/image';
import { CheckCircle2, UserPlus, ShieldCheck, ListChecks } from 'lucide-react';
import { motion } from 'framer-motion';

const THREE_COLUMNS = [
  {
    title: 'كل موظف يبدأ من مكانه الصحيح',
    description:
      'يمر العضو الجديد برحلة من 3 خطوات لاختيار القسم والمسمى الوظيفي قبل اعتماد حسابه من الإدارة.',
    icon: UserPlus,
  },
  {
    title: 'مهمة واحدة، وتقدم مستقل لكل عضو',
    description:
      'ينفذ كل فرد مهامه الفرعية ويحدد حالته الخاصة، ولا تكتمل المهمة كلياً إلا بإنهاء الجميع أدوارهم.',
    icon: ListChecks,
  },
  {
    title: 'مساحة شخصية محمية عن الفريق',
    description:
      'يعمل الموظف على مهامه الخاصة وقوائم تحققه السرية في صفحة مستقلة لا يراها أي شخص آخر.',
    icon: ShieldCheck,
  },
];

export default function LandingHowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0b1120] border-y border-border/60 dark:border-transparent"
      dir="rtl"
    >
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Notion-Style Centered Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            نظام يعرف تفاصيل شغل كل فريق.
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            بدل اللخبطة بين القوائم المتداخلة، المنصة تفصل بوضوح بين المهام المشتركة
            للشركة والمهام الخاصة بكل عضو.
          </p>
        </div>

        {/* Centered Notion-Style Spotlight Card (Inspired by Acme HQ) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="max-w-2xl mx-auto rounded-3xl bg-background dark:bg-[#101828] border border-border/80 dark:border-transparent shadow-400 overflow-hidden"
        >
          {/* Atmospheric Cover Header */}
          <div className="h-24 sm:h-28 bg-gradient-to-l from-blue-600 via-indigo-600 to-teal-500 relative p-5 flex items-end justify-between">
            <div className="flex items-center gap-2 text-white">
              <span className="px-3 py-1 rounded-full bg-white/20 text-[11px] font-bold backdrop-blur-sm">
                مهامي الشخصية (الخاصة)
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-slate-950/40 text-white text-[10px] font-bold">
              الوضع المضيء والليلي
            </span>
          </div>

          {/* Embedded Real App Screenshot Preview */}
          <div className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-extrabold text-foreground">
                  مقر العمل الشخصي — الخصوصية الكاملة
                </span>
              </div>
              <span className="text-[11px] font-semibold text-muted-foreground">
                لقطة حقيقية من التطبيق
              </span>
            </div>

            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-border/70 dark:border-transparent shadow-200 bg-white">
              <Image
                src="/images/landing/personal-tasks-light.png"
                alt="شاشة المهام الشخصية الخاصة في التطبيق"
                fill
                quality={100}
                unoptimized
                className="object-cover object-top"
              />
            </div>
          </div>
        </motion.div>

        {/* Clean 3-Column Feature Strip Below */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          {THREE_COLUMNS.map((col, idx) => {
            const Icon = col.icon;
            return (
              <motion.div
                key={col.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                className="text-right space-y-2"
              >
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary mb-1">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-base font-extrabold text-foreground">{col.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {col.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
