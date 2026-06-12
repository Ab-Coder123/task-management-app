'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { ADMIN_NAV_ITEMS, USER_NAV_ITEMS } from '@/lib/constants';
import * as Icons from 'lucide-react';
import { LogOut, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const role = user?.role || 'user';
  const navItems = role === 'admin' ? ADMIN_NAV_ITEMS : USER_NAV_ITEMS;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />

          {/* Drawer Content */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-y-0 left-0 w-72 border-r border-border/80 bg-card p-6 shadow-2xl flex flex-col justify-between"
          >
            <div>
              {/* Header with Close Button */}
              <div className="flex items-center justify-between pb-6 border-b border-border/40 mb-6">
                <Link href="/" onClick={onClose} className="flex items-center space-x-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-violet-500">
                    <Icons.Trello className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    TaskSaaS
                  </span>
                </Link>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-muted/40"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1.5">
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
                      onClick={onClose}
                      className={`flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 border ${
                        isActive
                          ? 'bg-primary/10 border-primary/20 text-primary'
                          : 'border-transparent text-muted-foreground hover:bg-muted/30 hover:text-foreground'
                      }`}
                    >
                      {IconComponent && <IconComponent className="h-4.5 w-4.5" />}
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Footer / Logout */}
            <div className="pt-6 border-t border-border/40">
              <button
                onClick={() => {
                  onClose();
                  logout();
                }}
                className="flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-all"
              >
                <LogOut className="h-4.5 w-4.5" />
                <span>Sign Out</span>
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
