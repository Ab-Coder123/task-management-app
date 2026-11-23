import type { Metadata } from 'next';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';
import { DownloadPageContent } from '@/components/landing/DownloadPageContent';

export const metadata: Metadata = {
  title: 'تحميل التطبيق | TaskSaaS',
  description:
    'حمّل تطبيق TaskSaaS على Windows و macOS و Linux أو ثبّت تطبيق الويب التفاعلي (PWA) مباشرة لإدارة مهام فريقك.',
};

export default function DownloadPage() {
  return (
    <div dir="rtl" className="flex min-h-screen flex-col bg-white text-slate-900 dark:bg-[#0b1120] dark:text-slate-100">
      <LandingNavbar />
      <main className="flex-1">
        <DownloadPageContent />
      </main>
      <LandingFooter />
    </div>
  );
}
