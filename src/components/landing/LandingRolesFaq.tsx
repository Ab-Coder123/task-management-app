'use client';

import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck, Users, ChevronDown } from 'lucide-react';

const ADMIN_POINTS = [
  'لوحة تحكم شاملة لمتابعة جميع المهام المشتركة وحالة كل موظف.',
  'اعتماد أو رفض الحسابات الجديدة مع مراجعة القسم والمسمى الوظيفي.',
  'إسناد مهمة واحدة لعدة أعضاء مع متابعة نسبة إنجاز كل فرد.',
  'رفع الملفات والمرفقات مع توليد روابط عرض مشفرة مؤقتة.',
  'تقارير أداء تفصيلية وإدارة التعليقات ومراجعتها.',
];

const MEMBER_POINTS = [
  'مساحة عمل نظيفة لعرض المهام المسندة إليك فقط حسب قسمك.',
  'تحديد حالة إنجازك الشخصي وقائمة تحقق (Checklist) خاصة بك.',
  'قسم مهام شخصية معزول تماماً لا يطلع عليه الآخرون.',
  'مناقشة المهام المشتركة عبر التعليقات مع إشعارات فورية.',
  'إمكانية تعديل بيانات الملف الشخصي والقسم والمسمى الوظيفي.',
];

const FAQS = [
  {
    q: 'لماذا يمر الموظف بمراحل اختيار الفريق والوظيفة قبل التسجيل؟',
    a: 'لضمان دخول كل عضو مكانه الصحيح داخل الهيكل التنظيمي منذ اللحظة الأولى، ومساعدة الإدارة في مراجعة طلب التفعيل وتوزيع المهام بدقة بناءً على القسم والتخصص.',
  },
  {
    q: 'كيف يتم تفعيل الحساب بعد التسجيل؟',
    a: 'بمجرد إتمام الخطوات الثلاث، يُرسل إشعار تلقائي لبريد الإدارة يحتوي على اسمك وبريدك وقسمك ومسمّاك الوظيفي. وتبقى شاشة الانتظار تتحقق تلقائياً كل 3 ثوانٍ لتنقلك للوحة التحكم فور الاعتماد.',
  },
  {
    q: 'ما الفرق بين المهام المشتركة والمهام الشخصية؟',
    a: 'المهام المشتركة تنشئها الإدارة ويمكن تعيينها لعدة أعضاء مع تعليقات ومرفقات وتقدم مستقل لكل عضو. أما المهام الشخصية فهي خاصة بصاحبها فقط ولا يظهر محتواها أو قوائمها لأي شخص آخر.',
  },
  {
    q: 'هل يمكن تشغيل المنصة كتطبيق على الكمبيوتر (Desktop App)؟',
    a: 'المنصة تعمل حالياً كـ Web App سريع ومتجاوب بالكامل، وخارطة الطريق القادمة تتضمن دعم التثبيت المباشر PWA ونسخة Desktop مخصصة لأنظمة Windows و macOS.',
  },
];

export default function LandingRolesFaq() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 space-y-20" dir="rtl">
      {/* Roles Comparison */}
      <div id="roles" className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="inline-block px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-extrabold">
            تجربتان مخصصتان حسب الدور
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            صلاحيات واضحة للإدارة ولأعضاء الفريق
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Team Member Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101828] border border-border/80 dark:border-slate-800 shadow-300 text-right">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border/50 dark:border-slate-800">
              <div className="h-11 w-11 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-foreground">
                  بوابة عضو الفريق (Member)
                </h3>
                <p className="text-xs text-muted-foreground">
                  التركيز على التنفيذ، الخصوصية، ومتابعة المهام اليومية
                </p>
              </div>
            </div>
            <ul className="space-y-3">
              {MEMBER_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/90">
                  <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Admin Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101828] border border-primary/30 dark:border-primary/40 shadow-300 text-right">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border/50 dark:border-slate-800">
              <div className="h-11 w-11 rounded-xl bg-primary/15 border border-primary/25 text-primary flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-foreground">
                  بوابة مسؤول النظام (Admin)
                </h3>
                <p className="text-xs text-muted-foreground">
                  القيادة، اعتماد الحسابات، توزيع العمل، والتقارير الشاملة
                </p>
              </div>
            </div>
            <ul className="space-y-3">
              {ADMIN_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/90">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faq" className="max-w-3xl mx-auto">
        <div className="text-center mb-10 space-y-3">
          <span className="inline-block px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-extrabold">
            الأسئلة الشائعة
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            إجابات سريعة قبل أن تبدأ
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={item.q}
                className="rounded-2xl bg-white dark:bg-[#101828] border border-border/80 dark:border-slate-800 shadow-100 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-right cursor-pointer"
                >
                  <span className="text-sm font-extrabold text-foreground">{item.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-primary' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 dark:border-slate-800/70 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
