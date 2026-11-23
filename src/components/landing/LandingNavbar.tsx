'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import ThemeToggle from '@/components/shared/ThemeToggle';
import {
  ArrowLeft,
  Menu,
  X,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Clock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { href: '#how-it-works', label: 'كيف يعمل النظام' },
  { href: '#features', label: 'المميزات' },
  { href: '#departments', label: 'أقسام الشركة' },
  { href: '#faq', label: 'الأسئلة الشائعة' },
];

export default function LandingNavbar() {
  const { user, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    useAuthStore.persist.rehydrate();
    setMounted(true);
  }, []);

  const dashboardHref = !user
    ? '/login'
    : !user.isVerified
    ? '/waiting-approval'
    : user.role === 'admin'
    ? '/admin/dashboard'
    : '/dashboard';

  return (
    <header
      className="sticky top-0 z-50 w-full bg-white dark:bg-[#0b1120] border-b border-border/80 dark:border-slate-800 shadow-100"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo (Matches Browser Tab Icon ✔️) */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 dark:bg-slate-800/90 border border-primary/20 dark:border-transparent shadow-100 dark:shadow-200">
            <span className="text-lg leading-none select-none" aria-hidden="true">
              ✔️
            </span>
          </div>
          <div className="text-right">
            <span className="text-base font-extrabold text-foreground tracking-tight block leading-none">
              مدير المهام
            </span>
            <span className="text-[10px] font-bold text-primary tracking-wider">
              TaskSaaS
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {!mounted ? (
            <div className="h-9 w-28 rounded-xl bg-muted animate-pulse" />
          ) : isAuthenticated && user ? (
            <Link
              href={dashboardHref}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/95 transition-all shadow-md shadow-primary/20"
            >
              {!user.isVerified ? (
                <>
                  <Clock className="h-3.5 w-3.5" />
                  <span>حالة الحساب</span>
                </>
              ) : (
                <>
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span>لوحة التحكم</span>
                </>
              )}
              <ArrowLeft className="h-3.5 w-3.5 hidden sm:inline" />
            </Link>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border dark:border-slate-700 bg-background dark:bg-slate-900 text-xs font-bold text-foreground hover:border-primary/50 hover:text-primary transition-all"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>تسجيل الدخول</span>
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/95 transition-all shadow-md shadow-primary/20"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>ابدأ مجاناً</span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-xl border border-border/80 dark:border-slate-800 bg-card text-foreground hover:bg-muted/70 transition-all"
            aria-label="قائمة التنقل"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Panel (Solid Background) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white dark:bg-[#0b1120] border-t border-border/80 dark:border-slate-800 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              <div className="flex flex-col space-y-1">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2.5 rounded-xl text-sm font-bold text-foreground hover:bg-muted/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              <div className="pt-3 border-t border-border/60 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <ThemeToggle />

                {mounted && (!isAuthenticated || !user) && (
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 sm:flex-none text-center px-4 py-2.5 rounded-xl border border-border dark:border-slate-700 bg-background dark:bg-slate-900 text-xs font-bold text-foreground"
                    >
                      تسجيل الدخول
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 sm:flex-none text-center px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md shadow-primary/20"
                    >
                      إنشاء حساب
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
