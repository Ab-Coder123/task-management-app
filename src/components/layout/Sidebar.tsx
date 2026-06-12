'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { ADMIN_NAV_ITEMS, USER_NAV_ITEMS } from '@/lib/constants';
import * as Icons from 'lucide-react';
import { LogOut } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const role = user?.role || 'user';
  const navItems = role === 'admin' ? ADMIN_NAV_ITEMS : USER_NAV_ITEMS;

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border/40 bg-card/45 backdrop-blur-md lg:block">
      <div className="flex h-full flex-col justify-between">

        {/* Top Section */}
        <div>
          {/* Logo Brand Panel */}
          <div className="flex h-16 items-center px-6 border-b border-border/40">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-violet-500 shadow-md shadow-primary/30">
                <Icons.Trello className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                TaskSaaS
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 px-4 py-6">
            <p className="px-3 mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Navigation Menu
            </p>
            {navItems.map((item) => {
              const IconComponent = Icons[item.icon as keyof typeof Icons] as React.ComponentType<any>;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 rounded-xl px-4.5 py-3 text-sm font-medium transition-all duration-200 border ${isActive
                    ? 'bg-primary/10 border-primary/20 text-primary shadow-sm shadow-primary/5'
                    : 'border-transparent text-muted-foreground hover:bg-muted/30 hover:text-foreground'
                    }`}
                >
                  {IconComponent && (
                    <IconComponent className={`h-4.5 w-4.5 ${isActive ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
                  )}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Footer / Logout */}
        <div className="p-4 border-t border-border/40">
          <button
            onClick={logout}
            className="flex w-full items-center space-x-3 rounded-xl border border-transparent px-4.5 py-3 text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-all duration-200"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Sign Out</span>
          </button>
        </div>

      </div>
    </aside>
  );
}
