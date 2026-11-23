'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Code2, Palette, Kanban, Megaphone } from 'lucide-react';
import { motion } from 'framer-motion';

const TEAM_PLAYBOOKS = [
  {
    teamId: 'engineering',
    tag: 'التطوير والبرمجة',
    title: 'توزيع المهام البرمجية وتقدم كل مطور',
    image: '/images/landing/teams/engineering.png',
    frameBg: 'from-slate-900 via-slate-800 to-blue-950',
    icon: Code2,
    bullets: [
      'متابعة مهام Frontend و Backend منفردة',
      'ربط المرفقات التقنية والـ Pull Requests',
      'إشعارات فورية عند تغيير الحالة',
    ],
  },
  {
    teamId: 'design',
    tag: 'التصميم و UI/UX',
    title: 'تنظيم مسودات التصميم والمهام الشخصية',
    image: '/images/landing/teams/design.png',
    frameBg: 'from-amber-500 via-orange-600 to-rose-600',
    icon: Palette,
    bullets: [
      'مساحة مهام شخصية قبل تسليم التصميم',
      'رفع الملفات والصور بروابط مؤمنة 15 دقيقة',
      'تعليقات ومراجعة مباشرة من الإدارة',
    ],
  },
  {
    teamId: 'product',
    tag: 'إدارة المنتجات',
    title: 'رؤية شاملة للأولويات وحركة التنقل',
    image: '/images/landing/teams/product.png',
    frameBg: 'from-violet-700 via-purple-700 to-indigo-900',
    icon: Kanban,
    bullets: [
      'قائمة تنقل واضحة بين المشترك والخاص',
      'اعتماد انضمام الأعضاء حسب القسم',
      'تقارير دورية لنسب الإنجاز',
    ],
  },
  {
    teamId: 'marketing',
    tag: 'التسويق والنمو',
    title: 'تنسيق الحملات والمحتوى دون تشتت',
    image: '/images/landing/teams/marketing.png',
    frameBg: 'from-emerald-600 via-teal-700 to-cyan-800',
    icon: Megaphone,
    bullets: [
      'متابعة مواعيد الإطلاق والتسليم',
      'قوائم تحقق فرعية لكل مسوّق ومصمم',
      'تنبيهات تلقائية عند اقتراب الموعد',
    ],
  },
];

export default function LandingDepartments() {
  return (
    <section
      id="departments"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0b1120] border-y border-border/60 dark:border-transparent"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Row (Notion Section 4 style) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 text-right">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              الفِرق الذكية تعمل بهذه الطريقة.
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              نماذج حية لعمل الأقسام داخل المنصة — اختر فريقك وابدأ فوراً.
            </p>
          </div>
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-foreground dark:bg-primary text-background dark:text-white text-xs font-extrabold hover:opacity-90 transition-all shrink-0 w-fit"
          >
            <span>ابدأ مع فريقك</span>
            <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Showcase Cards Grid (Notion-style vibrant framed cards) */}
        <div
          id="teams-showcase"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {TEAM_PLAYBOOKS.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.teamId}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.38, delay: idx * 0.06 }}
                className={`group rounded-3xl p-4 bg-gradient-to-br ${card.frameBg} shadow-400 flex flex-col justify-between text-right overflow-hidden`}
              >
                {/* Top Card Label */}
                <div className="flex items-center justify-between text-white mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="text-xs font-extrabold">{card.tag}</span>
                  </div>
                </div>

                {/* Inner Solid App Card */}
                <div className="rounded-2xl bg-white dark:bg-[#0f172a] p-4 shadow-500 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-[#0b1120] shadow-100">
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        quality={100}
                        unoptimized
                        className="object-cover object-center group-hover:scale-[1.04] transition-transform duration-300"
                      />
                    </div>

                    <h3 className="text-sm font-extrabold text-foreground leading-snug">
                      {card.title}
                    </h3>

                    <ul className="space-y-1.5">
                      {card.bullets.map((b) => (
                        <li
                          key={b}
                          className="text-[11px] text-muted-foreground flex items-start gap-1.5 leading-snug"
                        >
                          <span className="text-primary font-bold">•</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={`/register?team=${card.teamId}`}
                    className="pt-3 mt-2 border-t border-border/40 dark:border-transparent flex items-center justify-between text-xs font-extrabold text-primary hover:underline"
                  >
                    <span>التسجيل في هذا القسم</span>
                    <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
