'use client';

import React from 'react';
import {
  GitMerge,
  Lock,
  FileKey2,
  BellRing,
  ShieldAlert,
  MoonStar,
} from 'lucide-react';
import { motion } from 'framer-motion';

const FEATURES = [
  {
    title: 'تتبع تقدم مستقل لكل عضو',
    description:
      'عند إسناد مهمة واحدة لعدة موظفين، يمتلك كل موظف حالته الخاصة وقائمة تحققه الفردية. لا تُغلق المهمة كلياً إلا بعد إنهاء جميع الأعضاء لأدوارهم.',
    icon: GitMerge,
    badge: 'Assignee Progress',
    color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20',
  },
  {
    title: 'فصل تام للمهام الشخصية',
    description:
      'مساحة عمل خاصة لكل موظف لإدارة مهامه اليومية وقوائمه السرية (Private Checklist) دون ظهورها لبقية الفريق أو التعليقات العامة.',
    icon: Lock,
    badge: 'Privacy First',
    color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    title: 'مرفقات محمية بروابط مؤقتة',
    description:
      'تُرفع الملفات بأمان على Cloudinary وتُعرض عبر روابط موقعة (Signed URLs) تنتهي صلاحيتها تلقائياً خلال 15 دقيقة لحماية بيانات الشركة.',
    icon: FileKey2,
    badge: 'Signed URLs',
    color: 'text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/20',
  },
  {
    title: 'تنبيهات ذكية ذاتية التنظيف',
    description:
      'إشعارات فورية للتعيين والتعديلات والتعليقات مع فهرس TTL في قاعدة البيانات يحذف التنبيهات القديمة تلقائياً بعد 48 ساعة للحفاظ على السرعة.',
    icon: BellRing,
    badge: '48h Auto-TTL',
    color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
  },
  {
    title: 'حماية المسارات على الـ Edge',
    description:
      'التحقق الفوري من الجلسة ودور المستخدم (Admin / User) وحالة الاعتماد على شبكة Edge قبل تحميل الصفحة لمنع أي وصول غير مصرح به.',
    icon: ShieldAlert,
    badge: 'Edge RBAC',
    color: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20',
  },
  {
    title: 'تصميم عربي صلب ومتجاوب',
    description:
      'واجهة RTL أصيلة تدعم الوضع المضيء والوضع الليلي بألوان صلبة مريحة للعين وتجاوب كامل من شاشات الموبايل الصغيرة (320px) حتى الديسكتوب.',
    icon: MoonStar,
    badge: 'Solid Light/Dark',
    color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  },
];

export default function LandingFeatures() {
  return (
    <section id="features" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="inline-block px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-extrabold">
            مميزات هندسية حقيقية
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            كل ما تحتاجه لإدارة فريقك دون تعقيد
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            تم بناء المنصة لحل المشاكل العملية التي تواجه فرق العمل يومياً في توزيع المهام، الخصوصية، ومتابعة الأداء.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="p-6 rounded-2xl bg-white dark:bg-[#101828] border border-border/80 dark:border-slate-800 shadow-200 hover:border-primary/40 transition-all text-right"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`h-11 w-11 rounded-xl border flex items-center justify-center ${feat.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-muted dark:bg-slate-800 text-[10px] font-bold text-muted-foreground">
                    {feat.badge}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-foreground mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {feat.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
