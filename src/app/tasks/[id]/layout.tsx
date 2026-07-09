'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import MobileSidebar from '@/components/layout/MobileSidebar';
import BottomNav from '@/components/layout/BottomNav';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function UserTaskLayout({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user && !user.isVerified) {
      router.replace('/waiting-approval');
    }
  }, [user, isAuthenticated, isLoading, router]);

  if (isLoading || (isAuthenticated && user && !user.isVerified)) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <MobileSidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />
      <div className="lg:pr-64 flex flex-col min-h-screen pb-16 lg:pb-0">
        <Navbar
          role="user"
          onMenuClick={() => setMobileSidebarOpen(true)}
        />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
