'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useNotifications } from '@/lib/hooks/useNotifications';
import { getAvatarFallback } from '@/lib/utils';
import { Bell, LogOut, Menu, User, ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  onMenuClick: () => void;
  role: 'admin' | 'user';
}

export default function Navbar({ onMenuClick, role }: NavbarProps) {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/65 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left Side: Mobile Menu Button */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted/40 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="hidden lg:block">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary/80 bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10">
              {role === 'admin' ? 'Admin Portal' : 'User Workspace'}
            </span>
          </div>
        </div>

        {/* Right Side: Notifications & Profile Menu */}
        <div className="flex items-center space-x-4">
          {/* Notification Bell */}
          <Link
            href={role === 'admin' ? '/admin/notifications' : '#'}
            className="relative rounded-full p-2 text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-background">
                {unreadCount}
              </span>
            )}
          </Link>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 rounded-xl p-1.5 hover:bg-muted/30 transition-all border border-transparent hover:border-border/30"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 border border-primary/20 text-primary text-sm font-semibold uppercase">
                {user ? getAvatarFallback(user.username) : '?'}
              </div>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium text-foreground">{user?.username || 'Guest'}</p>
                <p className="text-[10px] text-muted-foreground capitalize">{user?.role || 'Role'}</p>
              </div>
              <ChevronDown className="hidden h-4 w-4 text-muted-foreground md:block" />
            </button>

            {dropdownOpen && (
              <>
                {/* Overlay click catcher */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 z-20 w-48 rounded-xl border border-border/80 bg-card p-1.5 shadow-2xl animate-fade-in">
                  <div className="px-3 py-2 border-b border-border/40 mb-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account</p>
                    <p className="text-sm font-medium text-foreground truncate mt-0.5">{user?.email}</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center space-x-2.5 rounded-lg px-3 py-2 text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-all"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
