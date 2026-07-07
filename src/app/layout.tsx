import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "sonner";
import FloatingTaskGraphics from "@/components/shared/FloatingTaskGraphics";

const cairo = Cairo({ subsets: ["arabic", "latin"] });

export const metadata: Metadata = {
  title: "TaskSaaS — Professional Task Management App",
  description: "A secure, role-based Task Management SaaS platform built with Next.js, React Query, and Tailwind CSS.",
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">✔️</text></svg>',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="light">
      <body className={cairo.className}>
        <QueryProvider>
          <FloatingTaskGraphics />
          {children}
          <Toaster position="top-center" richColors dir="rtl" />
        </QueryProvider>
      </body>
    </html>
  );
}
