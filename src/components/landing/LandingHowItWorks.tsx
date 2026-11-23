'use client';

import React from 'react';
import { UserPlus, ShieldCheck, ListChecks, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const JOURNEY_STEPS = [
  {
    step: '01',
    title: 'تحديد الفريق والمسمى الوظيفي',
    description:
      'يمر العضو الجديد برحلة تسجيل من 3 خطوات يختار فيها قسمه داخل الشركة ومسمّاه الوظيفي الدقيق قبل ملء بيانات الحساب.',
    icon: UserPlus,
    accent: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20',
  },
  {
    step: '02',
    title: 'مراجعة واعتماد الإدارة',
    description:
      'يصل إشعار فوري لبريد المدير بتفاصيل المتقدم (القسم + الوظيفة). وبمجرد الاعتماد تتحدث شاشة المستخدم تلقائياً ويدخل لوحته.',
    icon: ShieldCheck,
    accent: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    step: '03',
    title: 'توزيع المهام والتقدم المستقل',
    description:
      'يعمل كل عضو على جزئيته من المهمة المشتركة مع قائمة تحقق (Checklist) خاصة به، أو يدير مهامه الشخصية المعزولة تماماً.',
    icon: ListChecks,
    accent: 'text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/20',
  },
  {
    step: '04',
    title: 'التنبيهات والمرفقات والتقارير',
    description:
      'نقاشات حية بالتعليقات، مشاركة ملفات بروابط مشفرة مؤقتة، وتقارير فورية للإدارة لقياس سرعة الإنجاز وجودة التسليم.',
    icon: BarChart3,
    accent: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
  },
];

export default function LandingHowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0b1120] border-y border-border/60 dark:border-slate-800/80"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="inline-block px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-extrabold">
            رحلة العميل داخل المنصة
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            كيف يعمل نظام إدارة المهام في 4 خطوات واضحة؟
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            من لحظة دخول الموظف للرابط وحتى تسليم المشاريع واعتمادها من الإدارة — كل خطوة مصممة لتكون واضحة وآمنة.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {JOURNEY_STEPS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                className="relative p-6 rounded-2xl bg-background dark:bg-[#101828] border border-border/80 dark:border-slate-800 shadow-200 flex flex-col justify-between text-right"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`h-11 w-11 rounded-xl border flex items-center justify-center ${item.accent}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-2xl font-black text-muted-foreground/25 select-none">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
