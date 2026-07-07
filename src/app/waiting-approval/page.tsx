'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { notificationsApi } from '@/lib/api/notifications';
import { Sparkles, ArrowLeft, LogOut, BellRing, CheckCircle2, MessageSquareText, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WelcomeOnboardingPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  // Fetch notifications to check if admin/management sent any messages
  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsApi.getNotifications,
  });

  const userNotifs = notifications.filter((n: any) => {
    const metaUser = n.metadata?.userId || n.userId || n.recipient;
    return !metaUser || metaUser === user?._id || metaUser === (user as any)?.id;
  });
  const msgCount = userNotifs.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          const dest = user?.role === 'admin' ? '/admin/dashboard' : '/dashboard';
          router.push(dest);
          return 0;
         }
         return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [router, user]);

  const handleSkip = () => {
    const dest = user?.role === 'admin' ? '/admin/dashboard' : '/dashboard';
    router.push(dest);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-background overflow-hidden text-right" dir="rtl">
      
      {/* Ambient background glows */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-lg p-8 md:p-10 rounded-3xl glass-panel border border-border/80 shadow-600 z-10 relative bg-card/90 backdrop-blur-xl"
      >
        
        {/* Celebration Header Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/15 border-2 border-primary/30 text-primary mb-6 shadow-lg animate-bounce">
          <Sparkles className="h-10 w-10 fill-primary/20" />
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground mb-3 text-center tracking-tight">
          مرحباً بك في منصة إدارة المهام والفريق!
        </h1>
        
        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mb-6 text-center">
          تم تسجيل حسابك وتفعيله بنجاح! أنت الآن جاهز للانطلاق في تنظيم مهامك ومتابعة أعمالك والتعاون مع فريقك بكل مرونة وسرعة.
        </p>

        {/* User Account Info Card */}
        <div className="bg-muted/40 border border-border/60 rounded-2xl p-4 mb-6 space-y-2.5 shadow-inner">
          <div className="flex items-center justify-between text-xs border-b border-border/30 pb-2">
            <span className="text-muted-foreground font-bold flex items-center gap-1.5">
              <UserCheck className="h-4 w-4 text-primary" />
              الحساب المسجل:
            </span>
            <span className="text-foreground font-extrabold">{user?.username || 'مستخدم جديد'}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-bold">البريد الإلكتروني:</span>
            <span className="text-foreground font-semibold font-mono">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-muted-foreground font-bold">حالة الحساب:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-extrabold text-[10px] uppercase tracking-wider">
              نشط ومصرح بالدخول
            </span>
          </div>
        </div>

        {/* Management Messages Notice Box */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-4 rounded-2xl border mb-8 flex items-start gap-3.5 transition-all shadow-sm ${
            msgCount > 0 
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
              : 'bg-primary/5 border-primary/20 text-foreground'
          }`}
        >
          {msgCount > 0 ? (
            <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-600 shrink-0 mt-0.5 animate-pulse">
              <BellRing className="h-5 w-5" />
            </div>
          ) : (
            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5">
              <MessageSquareText className="h-5 w-5" />
            </div>
          )}
          
          <div className="flex-1">
            <h4 className="text-xs font-bold mb-1">
              {msgCount > 0 ? 'تنبيه من إدارة الفريق!' : 'حالة الإشعارات والرسائل'}
            </h4>
            <p className="text-[11px] leading-relaxed opacity-90 font-medium">
              {msgCount > 0 
                ? `لقد أرسل لك المدير أو إدارة الفريق (${msgCount}) رسالة/إشعار جديد! يمكنك الاطلاع عليها فور دخولك للوحة التحكم.`
                : 'لا توجد رسائل معلقة من المدير في الوقت الحالي. يمكنك التوجه مباشرة إلى لوحة التحكم وبدء أولى مهامك!'}
            </p>
          </div>
        </motion.div>

        {/* Countdown & Progress Bar */}
        <div className="mb-6 space-y-2">
          <div className="flex justify-between items-center text-xs font-extrabold text-muted-foreground px-1">
            <span>سيتم تحويلك تلقائياً إلى لوحة التحكم...</span>
            <span className="text-primary font-mono text-sm">00:0{countdown}</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden p-0.5 border border-border/40">
            <motion.div 
              className="h-full bg-primary rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${(countdown / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleSkip}
            className="w-full py-3 px-6 rounded-2xl bg-primary text-primary-foreground font-extrabold text-xs hover:bg-primary/95 transition-all shadow-lg hover:shadow-primary/25 flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>الدخول إلى لوحة التحكم الآن (تخطي)</span>
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 duration-300" />
          </button>
          
          <button
            onClick={logout}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 space-x-reverse py-2 px-4 rounded-xl text-muted-foreground font-bold text-xs hover:text-rose-500 hover:bg-rose-500/5 transition-all cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>تسجيل الخروج / الدخول بحساب آخر</span>
          </button>
        </div>

      </motion.div>
    </div>
  );
}
