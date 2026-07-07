'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Home, Shield, CheckSquare } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const role = user?.role || 'user';

  // Dynamically switch bottom navigation links based on user role to prevent unauthorized access errors on mobile
  const navItems = role === 'admin' ? [
    { label: 'الرئيسية', href: '/admin/dashboard', icon: Home },
    { label: 'المهام', href: '/admin/tasks', icon: CheckSquare },
    { label: 'المستخدمين', href: '/admin/users', icon: Shield },
  ] : [
    { label: 'الرئيسية', href: '/dashboard', icon: Home },
    { label: 'مهامي الخاصة', href: '/dashboard/personal-tasks', icon: CheckSquare },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-border/40 bg-background/85 backdrop-blur-md pb-safe">
      <div className="flex h-16 items-center justify-around px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-20 h-full transition-all duration-200 ${
                isActive
                  ? 'text-primary scale-105 font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
              <span className="text-[10px] mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
