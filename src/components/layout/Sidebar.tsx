'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAuthStore } from '@/lib/store/authStore';
import { ADMIN_NAV_ITEMS, USER_NAV_ITEMS } from '@/lib/constants';
import * as Icons from 'lucide-react';
import { LogOut } from 'lucide-react';
import { getAvatarFallback } from '@/lib/utils';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    useAuthStore.persist.rehydrate();
    setMounted(true);
  }, []);

  const role = user?.role || 'user';
  const navItems = role === 'admin' ? ADMIN_NAV_ITEMS : USER_NAV_ITEMS;

  return (
    <aside className="fixed inset-y-0 right-0 z-30 hidden w-64 lg:flex flex-col text-right bg-card shadow-300">
      
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-200">
            <Icons.Trello className="h-5 w-5 text-white" />
          </div>
          <span className="text-base font-bold text-foreground tracking-tight">مدير المهام</span>
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-3 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
          قائمة التنقل
        </p>

        {!mounted ? (
          <div className="space-y-3 px-3 py-1">
            <div className="h-8 bg-muted rounded-lg animate-pulse w-full" />
            <div className="h-8 bg-muted rounded-lg animate-pulse w-[90%]" />
            <div className="h-8 bg-muted rounded-lg animate-pulse w-[85%]" />
            <div className="h-8 bg-muted rounded-lg animate-pulse w-[95%]" />
          </div>
        ) : (
          navItems.map((item) => {
            const IconComponent = Icons[item.icon as keyof typeof Icons] as React.ComponentType<any>;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/10 text-primary shadow-100'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                }`}
              >
                {IconComponent && (
                  <IconComponent className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                )}
                <span>{item.label}</span>
                {isActive && (
                  <span className="mr-auto h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })
        )}
      </nav>

      {/* User & Logout */}
      <div className="p-3">
        {mounted && user ? (
          <div className="flex items-center gap-3 px-3 py-2.5 mb-1.5 rounded-xl bg-muted/40 shadow-100">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="Avatar"
                className="h-8 w-8 rounded-full object-cover shrink-0 shadow-200"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold uppercase shrink-0">
                {getAvatarFallback(user.username)}
              </div>
            )}
            <div className="min-w-0 text-right">
              <p className="text-sm font-bold text-foreground truncate">{user.username}</p>
              <p className="text-[10px] text-muted-foreground font-semibold truncate">{role === 'admin' ? 'مدير النظام' : 'عضو فريق'}</p>
            </div>
          </div>
        ) : (
          <div className="h-12 bg-muted rounded-xl animate-pulse mb-1.5 w-full" />
        )}
        
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all duration-200"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
