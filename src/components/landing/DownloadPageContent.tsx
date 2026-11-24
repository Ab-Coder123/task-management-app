'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Monitor,
  Apple,
  Terminal,
  Smartphone,
  Bell,
  Keyboard,
  ShieldCheck,
  RefreshCw,
  ArrowUpLeft,
  Download,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { InstallAppButton } from '@/components/shared/InstallAppButton';

type DetectedOS = 'windows' | 'macos' | 'linux' | 'mobile' | 'unknown';

interface PlatformCard {
  id: DetectedOS;
  name: string;
  subtitle: string;
  badge: string;
  fileHint: string;
  downloadHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  accentClass: string;
  iconBg: string;
  icon: typeof Monitor;
}

const DESKTOP_PLATFORMS: PlatformCard[] = [
  {
    id: 'windows',
    name: 'Windows',
    subtitle: 'مثبت ويندوز المباشر جاهز للتشغيل الفوري على جهازك',
    badge: 'Windows 10 / 11 (x64)',
    fileHint: 'ملف التثبيت المباشر (.exe)',
    downloadHref: '/api/download/windows',
    secondaryLabel: 'أو تحميل النسخة المحمولة Portable بدون تثبيت',
    secondaryHref: '/api/download/windows?type=portable',
    accentClass: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-50 dark:bg-blue-950/60',
    icon: Monitor,
  },
  {
    id: 'macos',
    name: 'macOS',
    subtitle: 'حزمة DMG أصلية متوافقة مع أجهزة Mac الحديثة',
    badge: 'macOS 12+',
    fileHint: 'ملف التثبيت المباشر (.dmg)',
    downloadHref: '/api/download/macos',
    secondaryLabel: 'أو تحميل أرشيف مضغوط (.zip)',
    secondaryHref: '/api/download/macos?type=zip',
    accentClass: 'text-violet-600 dark:text-violet-400',
    iconBg: 'bg-violet-50 dark:bg-violet-950/60',
    icon: Apple,
  },
  {
    id: 'linux',
    name: 'Linux',
    subtitle: 'نسخة AppImage الموحدة للتشغيل الفوري على جميع التوزيعات',
    badge: 'Ubuntu / Fedora / Arch',
    fileHint: 'تحميل مباشر (.AppImage)',
    downloadHref: '/api/download/linux',
    accentClass: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/60',
    icon: Terminal,
  },
];

const DESKTOP_FEATURES = [
  {
    icon: Keyboard,
    title: 'اختصار سريع عالمي',
    description: 'افتح قائمة مهامك فوراً من أي نافذة عبر الاختصار Ctrl+Shift+N دون مقاطعة عملك.',
  },
  {
    icon: Bell,
    title: 'إشعارات سطح مكتب أصلية',
    description: 'تنبيهات نظام فورية عند إسناد مهمة جديدة أو تحديث حالة التسليم أو استلام تعليق.',
  },
  {
    icon: RefreshCw,
    title: 'تحديثات صامتة وتلقائية',
    description: 'يحصل التطبيق على أحدث التحسينات والمميزات تلقائياً مع بقاء جلسة عملك محفوظة.',
  },
  {
    icon: ShieldCheck,
    title: 'تشغيل من شريط المهام',
    description: 'يعمل في الخلفية عبر System Tray مع خيار التشغيل التلقائي فور فتح الجهاز.',
  },
];

export function DownloadPageContent() {
  const [detectedOS, setDetectedOS] = useState<DetectedOS>('unknown');

  useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    if (/android|iphone|ipad|ipod/.test(ua)) {
      setDetectedOS('mobile');
    } else if (ua.includes('win')) {
      setDetectedOS('windows');
    } else if (ua.includes('mac')) {
      setDetectedOS('macos');
    } else if (ua.includes('linux')) {
      setDetectedOS('linux');
    }
  }, []);

  const detectedLabel =
    detectedOS === 'windows'
      ? 'Windows'
      : detectedOS === 'macos'
      ? 'macOS'
      : detectedOS === 'linux'
      ? 'Linux'
      : detectedOS === 'mobile'
      ? 'الهاتف أو المتصفح'
      : 'جميع الأنظمة';

  return (
    <div className="bg-white dark:bg-[#0b1120]">
      {/* Hero Banner */}
      <section className="mx-auto max-w-6xl px-4 pt-12 pb-10 sm:px-6 lg:px-8 lg:pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/70 dark:text-blue-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>تجربة أصلية لسطح المكتب والويب — جاهزة لـ {detectedLabel}</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            حمّل تطبيق{' '}
            <span className="bg-gradient-to-l from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
              TaskSaaS
            </span>{' '}
            على جهازك
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
            تابع مهام فريقك وأنجز أعمالك اليومية بسرعة أكبر عبر تطبيق سطح المكتب الأصلي أو بتثبيت تطبيق الويب التفاعلي (PWA) بنقرة واحدة.
          </p>
        </div>

        {/* Instant Web App (PWA) Spotlight */}
        <div className="mx-auto mt-10 max-w-4xl rounded-3xl bg-[#f3f5f9] p-6 shadow-sm sm:p-8 dark:bg-[#101828] dark:shadow-[0_22px_55px_-15px_rgba(0,0,0,0.65)]">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/25">
                <Smartphone className="h-7 w-7" />
              </div>
              <div>
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    التثبيت الفوري كتطبيق ويب (PWA)
                  </h2>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300">
                    متاح الآن
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  يعمل على الكمبيوتر والهاتف (Windows, macOS, Android, iOS) بأيقونة مستقلة ونافذة كاملة ودعم صفحة عدم الاتصال.
                </p>
              </div>
            </div>

            <div className="w-full shrink-0 md:w-auto">
              <InstallAppButton className="w-full md:w-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Desktop Platforms Grid */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              تطبيقات سطح المكتب الرسمية
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              اختر نظام التشغيل الخاص بك ليبدأ تحميل التطبيق مباشرة على جهازك بنقرة واحدة.
            </p>
          </div>
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            <span>ليس لديك حساب؟ أنشئ حساب فريقك مجاناً</span>
            <ArrowUpLeft className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {DESKTOP_PLATFORMS.map((platform) => {
            const Icon = platform.icon;
            const isRecommended = detectedOS === platform.id;

            return (
              <div
                key={platform.id}
                className={`relative flex flex-col justify-between rounded-2xl p-6 transition-all ${
                  isRecommended
                    ? 'bg-white ring-2 ring-blue-600 shadow-[0_20px_45px_-15px_rgba(37,99,235,0.22)] dark:bg-[#101828] dark:ring-blue-500 dark:shadow-[0_24px_55px_-12px_rgba(0,0,0,0.7)]'
                    : 'bg-[#f8fafc] shadow-sm hover:-translate-y-0.5 hover:shadow-md dark:bg-[#101828] dark:shadow-[0_18px_45px_-14px_rgba(0,0,0,0.55)]'
                }`}
              >
                <div>
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${platform.iconBg} ${platform.accentClass}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    {isRecommended ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-[11px] font-bold text-white">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>موصى به لجهازك</span>
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-200/70 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {platform.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {platform.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {platform.subtitle}
                  </p>
                </div>

                <div className="mt-6 pt-4">
                  <div className="mb-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                    {platform.fileHint}
                  </div>
                  <a
                    href={platform.downloadHref}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                      isRecommended
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Download className="h-4 w-4" />
                    <span>تحميل لنظام {platform.name}</span>
                  </a>
                  {platform.secondaryHref && platform.secondaryLabel && (
                    <a
                      href={platform.secondaryHref}
                      className="mt-2.5 block text-center text-xs font-medium text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                    >
                      {platform.secondaryLabel}
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Native OS Advantages */}
      <section className="mx-auto max-w-6xl px-4 pt-8 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#f3f5f9] p-6 sm:p-10 dark:bg-[#101828] dark:shadow-[0_24px_60px_-15px_rgba(0,0,0,0.6)]">
          <div className="mb-8 max-w-2xl">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              لماذا تطبيق سطح المكتب؟
            </h2>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
              صُمم ليمنح فريقك سرعة الوصول المباشر دون الضياع وسط عشرات التبويبات المفتوحة في المتصفح.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {DESKTOP_FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="rounded-2xl bg-white p-5 shadow-sm dark:bg-[#0b1120] dark:shadow-[0_14px_35px_-12px_rgba(0,0,0,0.5)]"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {feat.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
