'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import Link from 'next/link';
import { UserPlus, User, Mail, Lock, ShieldCheck } from 'lucide-react';
import { UserRole } from '@/lib/types';

export default function RegisterForm() {
  const { register, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username || !email || !password || !confirmPassword) {
      setErrorMsg('يرجى تعبئة جميع الحقول المطلوبة.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('كلمتا المرور غير متطابقتين.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('يجب أن تكون كلمة المرور مكونة من 6 أحرف على الأقل.');
      return;
    }

    try {
      await register({ username, email, password, role, status: 'pending' });
    } catch (err: any) {
      setErrorMsg(err.message || 'فشلت عملية إنشاء الحساب. يرجى المحاولة مرة أخرى.');
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-2xl glass-panel shadow-xl border border-border/40 animate-fade-in text-right">
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary shadow-sm">
          <UserPlus className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">إنشاء حساب جديد</h2>
        <p className="mt-2 text-xs text-muted-foreground">
          سجل حساباً للبدء في تنظيم مهامك اليومية ومتابعة فريقك
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-500">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            اسم المستخدم
          </label>
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              className="w-full pl-4 pr-10 py-3 rounded-xl bg-card/70 border border-border/80 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-right"
              placeholder="اسمك الكامل"
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-muted-foreground/70">
              <User className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            البريد الإلكتروني
          </label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full pl-4 pr-10 py-3 rounded-xl bg-card/70 border border-border/80 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-right"
              placeholder="name@company.com"
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-muted-foreground/70">
              <Mail className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            نوع الحساب (الدور)
          </label>
          <div className="relative">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              disabled={isLoading}
              className="w-full pl-4 pr-10 py-3 rounded-xl bg-card/70 border border-border/80 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-right appearance-none cursor-pointer"
            >
              <option value="user">مستخدم عادي (عضو فريق)</option>
              <option value="admin">مسؤول النظام (مدير)</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-muted-foreground/70">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            كلمة المرور
          </label>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full pl-4 pr-10 py-3 rounded-xl bg-card/70 border border-border/80 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-right"
              placeholder="••••••••"
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-muted-foreground/70">
              <Lock className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            تأكيد كلمة المرور
          </label>
          <div className="relative">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              className="w-full pl-4 pr-10 py-3 rounded-xl bg-card/70 border border-border/80 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-right"
              placeholder="••••••••"
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-muted-foreground/70">
              <Lock className="h-4 w-4" />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/95 active:scale-[0.99] transition-all shadow-md shadow-primary/20 disabled:opacity-50 disabled:pointer-events-none mt-4"
        >
          {isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب جديد'}
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground">
          لديك حساب بالفعل؟{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
}
