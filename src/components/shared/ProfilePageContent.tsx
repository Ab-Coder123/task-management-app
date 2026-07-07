'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAuthStore } from '@/lib/store/authStore';
import PageHeader from '@/components/shared/PageHeader';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { getAvatarFallback } from '@/lib/utils';
import { playSuccessSound } from '@/lib/utils/sound';
import { Camera, Mail, KeyRound, User2, Save, Unlock, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const pageVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
};

export default function ProfilePageContent() {
  const { user, updateProfile, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');

  useEffect(() => {
    useAuthStore.persist.rehydrate();
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);

  if (!mounted || !user) {
    return <LoadingSpinner size="lg" className="h-[60vh]" />;
  }

  // Handle custom avatar file selection and conversion to base64 Data URL
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('حجم الصورة كبير جداً. الحد الأقصى هو 2 ميجابايت.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
        toast.success('تم تحميل الصورة بنجاح! اضغط على حفظ التغييرات لتطبيق التعديل.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !email.trim()) {
      toast.error('الاسم والبريد الإلكتروني مطلوبان.');
      return;
    }

    const emailChanged = email.trim() !== user.email;
    const passwordChanged = !!password;

    if (passwordChanged) {
      if (password.length < 6) {
        toast.error('يجب أن تكون كلمة المرور الجديدة 6 أحرف على الأقل.');
        return;
      }
      if (password !== confirmPassword) {
        toast.error('كلمتا المرور الجديدتان غير متطابقتين.');
        return;
      }
    }

    if (emailChanged || passwordChanged) {
      if (!currentPassword) {
        toast.error('يرجى إدخال كلمة المرور الحالية أولاً لتأكيد التغييرات الحساسة (البريد الإلكتروني أو كلمة المرور).');
        return;
      }
      await executeProfileUpdate(currentPassword);
    } else {
      // Proceed directly for minor updates (avatar, username)
      await executeProfileUpdate();
    }
  };

  const executeProfileUpdate = async (verificationPassword?: string) => {
    try {
      const updateData: any = {
        username: username.trim(),
        email: email.trim(),
        avatar: avatar
      };

      if (password) {
        updateData.password = password;
      }

      if (verificationPassword) {
        updateData.currentPassword = verificationPassword;
      }

      const userIdToUpdate = user._id || (user as any).id;
      await updateProfile({ id: userIdToUpdate, data: updateData });
      playSuccessSound();
      toast.success('تم تحديث ملفك الشخصي بنجاح!');
      setPassword('');
      setConfirmPassword('');
      setCurrentPassword('');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'فشلت عملية تحديث البيانات.');
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="space-y-6 text-right"
      dir="rtl"
    >
      <PageHeader
        title="الملف الشخصي"
        description="استعرض بيانات حسابك الشخصي وقم بتحديث معلوماتك وصورة الحساب وكلمة المرور بسهولة."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Avatar Card */}
        <div className="lg:col-span-1 flex flex-col items-center p-6 rounded-2xl bg-card shadow-200 relative overflow-hidden">
          {/* Ambient Glow background */}
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          
          <div className="relative group cursor-pointer mb-5 mt-4">
            {avatar ? (
              <img
                src={avatar}
                alt="Profile Avatar"
                className="h-28 w-28 rounded-full object-cover border-4 border-background shadow-300 transition-all group-hover:scale-105 duration-300"
              />
            ) : (
              <div className="h-28 w-28 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-extrabold uppercase border-4 border-background shadow-300 transition-all group-hover:scale-105 duration-300">
                {getAvatarFallback(username)}
              </div>
            )}
            
            {/* Camera Hover overlay */}
            <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
              <Camera className="h-6 w-6 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <h2 className="text-lg font-bold text-foreground mb-1">{username || user.username}</h2>
          <p className="text-xs text-muted-foreground font-semibold mb-4">{email || user.email}</p>

          {/* User Badges */}
          <div className="flex flex-wrap justify-center gap-2 w-full mt-2 border-t border-border/20 pt-4">
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold shadow-100 border ${
              user.role === 'admin' 
                ? 'bg-rose-50 text-rose-700 border-rose-100' 
                : 'bg-blue-50 text-blue-700 border-blue-100'
            }`}>
              {user.role === 'admin' ? 'مدير النظام' : 'عضو فريق'}
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-100">
              حساب موثق
            </span>
          </div>
        </div>

        {/* Right Side: Profile Details form */}
        <div className="lg:col-span-2 p-6 md:p-8 rounded-2xl bg-card shadow-300 relative overflow-hidden">
          <form onSubmit={handleUpdate} className="space-y-6">
            
            {/* Profile Info Section */}
            <div>
              <h3 className="text-sm font-bold text-foreground mb-4 pb-2 border-b border-border/20 flex items-center gap-2">
                <User2 className="h-4.5 w-4.5 text-primary" />
                المعلومات الشخصية
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-2">اسم المستخدم</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-right transition-all shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-right transition-all shadow-sm"
                  />
                  {email.trim() !== user.email && !currentPassword && (
                    <p className="text-[10px] text-amber-600 font-bold mt-1.5 flex items-center gap-1">
                      <span>* يجب إدخال كلمة المرور الحالية لتأكيد حفظ البريد الجديد.</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Password Section - Unlocked via Current Password */}
            <div>
              <h3 className="text-sm font-bold text-foreground mb-4 pb-2 border-b border-border/20 flex items-center gap-2">
                <KeyRound className="h-4.5 w-4.5 text-primary" />
                تغيير كلمة المرور وتأكيد الحماية
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Current Password Field */}
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-2 flex items-center gap-1 justify-start">
                    <span>كلمة المرور الحالية</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="مطلوبة لتعديل كلمة المرور أو البريد"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-right transition-all shadow-sm focus:border-primary/80"
                  />
                </div>

                {/* New Password Field (Locked if currentPassword is empty) */}
                <div>
                  <label className={`block text-xs font-bold mb-2 flex items-center gap-1 justify-start ${currentPassword ? 'text-muted-foreground' : 'text-muted-foreground/40'}`}>
                    <span>كلمة المرور الجديدة</span>
                    {!currentPassword ? <Lock className="h-3 w-3 text-muted-foreground/45" /> : <Unlock className="h-3 w-3 text-primary" />}
                  </label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={!currentPassword}
                    placeholder={currentPassword ? "اتركها فارغة إذا لم تود تغييرها" : "🔒 أدخل كلمة المرور الحالية للفتح"}
                    className="w-full px-4 py-2.5 rounded-xl bg-white disabled:bg-slate-50 disabled:text-muted-foreground/50 border border-slate-200 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-right transition-all shadow-sm"
                  />
                </div>

                {/* Confirm New Password Field (Locked if currentPassword is empty) */}
                <div>
                  <label className={`block text-xs font-bold mb-2 flex items-center gap-1 justify-start ${currentPassword ? 'text-muted-foreground' : 'text-muted-foreground/40'}`}>
                    <span>تأكيد كلمة المرور الجديدة</span>
                    {!currentPassword ? <Lock className="h-3 w-3 text-muted-foreground/45" /> : <Unlock className="h-3 w-3 text-primary" />}
                  </label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={!currentPassword}
                    placeholder={currentPassword ? "أدخل كلمة المرور مجدداً للتأكيد" : "🔒 أدخل كلمة المرور الحالية للفتح"}
                    className="w-full px-4 py-2.5 rounded-xl bg-white disabled:bg-slate-50 disabled:text-muted-foreground/50 border border-slate-200 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-right transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-extrabold text-primary-foreground bg-primary rounded-xl hover:bg-primary/95 transition-all shadow-200 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" className="h-4 w-4" />
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    حفظ التغييرات
                  </>
                )}
              </button>
            </div>
            
          </form>
        </div>

      </div>
    </motion.div>
  );
}
