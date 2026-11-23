import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "sonner";
import FloatingTaskGraphics from "@/components/shared/FloatingTaskGraphics";

const cairo = Cairo({ subsets: ["arabic", "latin"] });

import { ServiceWorkerRegister } from '@/components/shared/ServiceWorkerRegister';

const SITE_URL = 'https://taskmanagement-frontend-one.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'TaskSaaS — نظام إدارة مهام الفرق والشركات',
    template: '%s | TaskSaaS',
  },
  description:
    'منصة عربية احترافية لإدارة مهام الفرق والشركات بتتبع مستقل لكل عضو، صلاحيات واضحة، مرفقات مؤمنة، وتطبيق سطح مكتب وويب.',
  keywords: [
    'إدارة المهام',
    'تنظيم الفرق',
    'TaskSaaS',
    'Task Management',
    'لوحة تحكم',
    'إدارة المشاريع',
  ],
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'TaskSaaS',
  },
  openGraph: {
    type: 'website',
    locale: 'ar_EG',
    url: SITE_URL,
    siteName: 'TaskSaaS',
    title: 'TaskSaaS — نظام إدارة مهام الفرق والشركات',
    description:
      'تتبع مستقل لتقدم كل عضو داخل المهمة، صلاحيات متدرجة، ورفع مرفقات مشفر مع تطبيقات Windows و macOS و Linux و PWA.',
    images: [
      {
        url: '/images/landing/dashboard-dark.png',
        width: 1200,
        height: 630,
        alt: 'معاينة لوحة مهام TaskSaaS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TaskSaaS — نظام إدارة مهام الفرق والشركات',
    description:
      'منصة متكاملة لإدارة مهام الفرق والأقسام بتتبع مستقل لكل عضو.',
    images: ['/images/landing/dashboard-dark.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={cairo.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <ServiceWorkerRegister />
            <FloatingTaskGraphics />
            {children}
            <Toaster position="top-center" richColors dir="rtl" />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
