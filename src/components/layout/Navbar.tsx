'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAuthStore } from '@/lib/store/authStore';
import { useNotifications } from '@/lib/hooks/useNotifications';
import { getAvatarFallback } from '@/lib/utils';
import { Bell, LogOut, Menu, ChevronDown, User } from 'lucide-react';
import Link from 'next/link';
import ThemeToggle from '@/components/shared/ThemeToggle';

interface NavbarProps {
  onMenuClick: () => void;
  role: 'admin' | 'user';
}

export default function Navbar({ onMenuClick, role }: NavbarProps) {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    useAuthStore.persist.rehydrate();
    setMounted(true);
  }, []);

  const profileHref = role === 'admin' ? '/admin/profile' : '/dashboard/profile';

  const handleProfileToggle = () => {
    if (!dropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 10,
        left: rect.left,
      });
    }
    setDropdownOpen(prev => !prev);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md shadow-100">
      <div className="flex h-16 items-center justify-between px-6">

        {/* Right side (RTL): Badge + Mobile menu */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            <span className="text-xs font-bold text-primary bg-primary/10 px-3.5 py-1.5 rounded-full shadow-100">
              {role === 'admin' ? 'بوابة مدير النظام' : 'مساحة العمل'}
            </span>
          </div>
          <button
            onClick={onMenuClick}
            className="rounded-xl p-2 text-muted-foreground hover:bg-muted/60 lg:hidden transition-all"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Left side (RTL): Profile & Notifications */}
        <div className="flex items-center gap-3">

          {/* Profile Trigger */}
          <div className="relative">
            {mounted && user ? (
              <button
                ref={buttonRef}
                onClick={handleProfileToggle}
                className="flex items-center gap-2.5 rounded-xl px-3 py-1.5 hover:bg-muted/60 transition-all border border-transparent"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="h-8 w-8 rounded-full object-cover shadow-200"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold uppercase">
                    {getAvatarFallback(user.username)}
                  </div>
                )}
                <div className="hidden text-right md:block">
                  <p className="text-sm font-bold text-foreground leading-none">{user.username}</p>
                  <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">{user.role === 'admin' ? 'مدير النظام' : 'عضو فريق'}</p>
                </div>
                <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground md:block" />
              </button>
            ) : (
              <div className="h-8 w-24 bg-muted rounded-xl animate-pulse" />
            )}
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notification Bell */}
          <Link
            href={role === 'admin' ? '/admin/notifications' : '/dashboard/notifications'}
            className="relative rounded-xl p-2 text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-all"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 left-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-background">
                {unreadCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Profile Dropdown — Portal rendered on document.body */}
      {mounted && user && createPortal(
        <>
          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0"
                onClick={() => setDropdownOpen(false)}
              />
              <div
                style={{
                  position: 'fixed',
                  top: dropdownPos.top,
                  left: dropdownPos.left,
                  zIndex: 9999,
                  minWidth: '14rem',
                }}
                className="w-56 rounded-2xl p-2 shadow-400 text-right bg-white border border-border animate-in fade-in slide-in-from-top-2 duration-200"
                dir="rtl"
              >
                <div className="px-3.5 py-3 mb-2 bg-muted/40 rounded-xl border border-border/50">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">الحساب النشط</p>
                  <p className="text-xs font-bold text-foreground truncate mt-0.5" title={user.email}>{user.email}</p>
                </div>

                <Link
                  href={profileHref}
                  onClick={() => setDropdownOpen(false)}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-extrabold text-foreground hover:bg-muted hover:text-primary transition-all duration-200"
                >
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>تعديل الملف الشخصي</span>
                </Link>

                <button
                  onClick={() => { setDropdownOpen(false); logout(); }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-extrabold text-rose-600 hover:bg-rose-500/10 transition-all duration-200 mt-1 border-t border-border pt-2 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            </>
          )}
        </>,
        document.body
      )}
    </header>
  );
}
