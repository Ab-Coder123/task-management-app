'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { usersApi } from '@/lib/api/users';
import { LogOut, Loader2, Clock, UserCheck, Briefcase, Users, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function WelcomeWaitingApprovalPage() {
  const { user, logout, isLoading } = useAuth();
  const { updateUser } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Poll verification status every 3 seconds
  useEffect(() => {
    if (!user?._id) return;

    let isSubscribed = true;
    const interval = setInterval(async () => {
      try {
        const freshUser = await usersApi.getUser(user._id);
        if (freshUser && freshUser.isVerified && isSubscribed) {
          clearInterval(interval);
          // Sync changes to local Zustand auth store
          updateUser({ isVerified: true });
          // Redirect user based on role
          const dest = freshUser.role === 'admin' ? '/admin/dashboard' : '/dashboard';
          router.replace(dest);
        }
      } catch (err) {
        console.error('Error polling user verification status:', err);
      }
    }, 3000);

    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, [user?._id, updateUser, router]);

  const handleManualCheck = async () => {
    if (!user?._id || isChecking) return;
    setIsChecking(true);
    try {
      const freshUser = await usersApi.getUser(user._id);
      if (freshUser && freshUser.isVerified) {
        updateUser({ isVerified: true });
        toast.success('تم اعتماد حسابك! جاري تحويلك إلى لوحة التحكم...');
        const dest = freshUser.role === 'admin' ? '/admin/dashboard' : '/dashboard';
        router.replace(dest);
      } else {
        toast.info('الحساب ما زال قيد مراجعة الإدارة.');
      }
    } catch (err) {
      console.error('Manual verification check error:', err);
      toast.error('تعذر التحقق من الحالة حالياً، يرجى المحاولة بعد قليل.');
    } finally {
      setIsChecking(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-background overflow-hidden text-right" dir="rtl">
      
      {/* Ambient background glows */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-lg p-8 md:p-10 rounded-3xl border border-border/80 shadow-600 z-10 relative bg-card opacity-100"
      >
        
        {/* Verification Icon Box */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-500/10 border-2 border-blue-500/20 text-blue-500 mb-6 shadow-lg animate-pulse">
          <Clock className="h-10 w-10 text-blue-600" />
        </div>

        <h1 className="text-xl md:text-2xl font-extrabold text-foreground mb-3 text-center tracking-tight">
          حسابك قيد الانتظار والمراجعة ⏳
        </h1>
        
        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mb-6 text-center">
          شكراً لتسجيلك! حسابك يحتاج إلى تفعيل واعتماد من قبل الإدارة قبل أن تتمكن من الدخول إلى لوحة التحكم.
        </p>

        {/* Steps Card */}
        <div className="bg-muted/30 border border-border/40 rounded-2xl p-5 mb-6 space-y-4">
          <h3 className="text-xs font-extrabold text-foreground border-b border-border/30 pb-2.5">
            الخطوات اللازمة لتفعيل حسابك ومراجعته:
          </h3>
          
          <div className="space-y-4 text-xs">
            <div className="flex gap-3">
              <div className="h-6 w-6 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20 flex items-center justify-center font-extrabold shrink-0">
                1
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-0.5">طلب تفعيل مُرسل للمدير</h4>
                <p className="text-muted-foreground text-[11px] leading-relaxed m-0">
                  تم إرسال بريد إلكتروني تلقائي لطلب تفعيل حسابك إلى المدير المسؤول عبد الرحمن عبر العنوان: <span className="font-mono font-semibold text-primary">abdulrahmanahm7li@gmail.com</span>
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="h-6 w-6 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20 flex items-center justify-center font-extrabold shrink-0">
                2
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-0.5">مراجعة الحساب وتأكيده</h4>
                <p className="text-muted-foreground text-[11px] leading-relaxed m-0">
                  سيقوم المدير بمراجعة بيانات تسجيلك (الاسم، البريد الإلكتروني، والصلاحيات المطلوبة) وتأكيدها.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="h-6 w-6 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20 flex items-center justify-center font-extrabold shrink-0">
                3
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-0.5">التفعيل والدخول التلقائي</h4>
                <p className="text-muted-foreground text-[11px] leading-relaxed m-0">
                  عند ضغط المدير على زر التفعيل في بريده، سيتم تحديث حالة حسابك هنا فوراً وتحويلك تلقائياً إلى لوحة التحكم.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Live status check loading indicator */}
        <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center gap-2.5 text-xs text-blue-700 dark:text-blue-300 font-bold mb-6 shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400 shrink-0" />
          <span>في انتظار موافقة المدير... نقوم بالتحقق من حالة الحساب تلقائياً</span>
        </div>

        {/* User Account Info Card */}
        <div className="bg-muted/40 dark:bg-slate-900/70 border border-border/60 dark:border-slate-800 rounded-2xl p-4 mb-6 space-y-2.5 shadow-inner">
          <div className="flex items-center justify-between text-xs border-b border-border/30 dark:border-slate-800 pb-2">
            <span className="text-muted-foreground font-bold flex items-center gap-1.5">
              <UserCheck className="h-4 w-4 text-primary" />
              الاسم المسجل:
            </span>
            <span className="text-foreground font-extrabold">{user?.username || '—'}</span>
          </div>
          <div className="flex items-center justify-between text-xs border-b border-border/30 dark:border-slate-800 pb-2">
            <span className="text-muted-foreground font-bold">البريد الإلكتروني:</span>
            <span className="text-foreground font-semibold font-mono">{user?.email || '—'}</span>
          </div>
          <div className="flex items-center justify-between text-xs border-b border-border/30 dark:border-slate-800 pb-2">
            <span className="text-muted-foreground font-bold flex items-center gap-1.5">
              <Users className="h-4 w-4 text-primary" />
              القسم / الفريق:
            </span>
            <span className="text-foreground font-bold">
              {user?.team || (user?.role === 'admin' ? 'الإدارة العامة' : 'غير محدد')}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-bold flex items-center gap-1.5">
              <Briefcase className="h-4 w-4 text-emerald-500" />
              المسمى الوظيفي:
            </span>
            <span className="text-foreground font-bold">
              {user?.jobTitle || (user?.role === 'admin' ? 'قائد الفريق (Team Leader)' : 'غير محدد')}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleManualCheck}
            disabled={isChecking || isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-primary text-primary-foreground font-extrabold text-xs hover:bg-primary/95 transition-all cursor-pointer shadow-md shadow-primary/20 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'جاري التحقق من حالة الحساب...' : 'تحديث حالة الحساب الآن'}</span>
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-muted/60 dark:bg-slate-800 border border-border/70 dark:border-slate-700 text-foreground font-bold text-xs hover:bg-muted transition-all"
            >
              <Home className="h-4 w-4" />
              <span>الصفحة الرئيسية</span>
            </Link>

            <button
              onClick={logout}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 font-extrabold text-xs hover:bg-rose-500/20 transition-all cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
