'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import Link from 'next/link';
import {
  UserPlus,
  User,
  Mail,
  Lock,
  ShieldCheck,
  Code2,
  Palette,
  Kanban,
  Megaphone,
  Briefcase,
  Settings2,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Users,
  Sparkles,
  Edit3,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserRole } from '@/lib/types';
import { COMPANY_TEAMS, CompanyTeam } from '@/lib/constants/departments';

const TEAM_ICONS: Record<CompanyTeam['iconName'], React.ComponentType<{ className?: string }>> = {
  Code2,
  Palette,
  Kanban,
  Megaphone,
  Briefcase,
  Settings2,
};

const smoothEase = [0.22, 1, 0.36, 1] as const;

const stepVariants = {
  initial: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? -24 : 24,
    scale: 0.985,
  }),
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.36,
      ease: smoothEase,
      when: 'beforeChildren',
      staggerChildren: 0.045,
    },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? 24 : -24,
    scale: 0.985,
    transition: { duration: 0.22, ease: 'easeIn' },
  }),
};

const staggerGridVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.04,
    },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 12, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.32, ease: smoothEase },
  },
};

export default function RegisterForm() {
  const { register, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const initialTeamParam = searchParams.get('team');
  const validInitialTeam = COMPANY_TEAMS.find((t) => t.id === initialTeamParam);

  // Wizard state
  const [step, setStep] = useState<1 | 2 | 3>(validInitialTeam ? 2 : 1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [role, setRole] = useState<UserRole>('user');
  const [selectedTeamId, setSelectedTeamId] = useState<string>(validInitialTeam?.id || '');
  const [selectedJob, setSelectedJob] = useState<string>('');
  const [isCustomJob, setIsCustomJob] = useState(false);
  const [customJobTitle, setCustomJobTitle] = useState('');

  useEffect(() => {
    if (validInitialTeam) {
      setRole('user');
      setSelectedTeamId(validInitialTeam.id);
      setStep((prev) => (prev === 1 ? 2 : prev));
    }
  }, [validInitialTeam]);

  // Form fields state (Step 3)
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const selectedTeam = COMPANY_TEAMS.find((t) => t.id === selectedTeamId);

  const finalTeam = selectedTeam?.name || '';
  const finalJobTitle =
    role === 'admin'
      ? 'قائد الفريق (Team Leader)'
      : isCustomJob
      ? customJobTitle.trim()
      : selectedJob;

  const handleSelectRole = (nextRole: UserRole) => {
    setErrorMsg('');
    setRole(nextRole);
    if (nextRole === 'admin') {
      setSelectedJob('');
      setIsCustomJob(false);
      setCustomJobTitle('');
    }
  };

  const handleSelectTeam = (teamId: string) => {
    setErrorMsg('');
    if (teamId !== selectedTeamId) {
      setSelectedTeamId(teamId);
      setSelectedJob('');
      setIsCustomJob(false);
      setCustomJobTitle('');
    }
  };

  const goToStep = (nextStep: 1 | 2 | 3) => {
    setDirection(nextStep >= step ? 1 : -1);
    setStep(nextStep);
  };

  const handleNextFromStep1 = () => {
    setErrorMsg('');
    if (!selectedTeam) {
      setErrorMsg(
        role === 'admin'
          ? 'يرجى اختيار القسم أو الفريق الذي ستتولى قيادته للمتابعة.'
          : 'يرجى اختيار القسم أو الفريق الذي تنتمي إليه للمتابعة.'
      );
      return;
    }
    if (role === 'admin') {
      goToStep(3);
      return;
    }
    goToStep(2);
  };

  const handleNextFromStep2 = () => {
    setErrorMsg('');
    if (isCustomJob) {
      if (!customJobTitle.trim()) {
        setErrorMsg('يرجى كتابة المسمى الوظيفي الخاص بك للمتابعة.');
        return;
      }
    } else if (!selectedJob) {
      setErrorMsg('يرجى اختيار المسمى الوظيفي للمتابعة.');
      return;
    }
    goToStep(3);
  };

  const handleBackFromStep3 = () => {
    setErrorMsg('');
    if (role === 'admin') {
      goToStep(1);
    } else {
      goToStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      setErrorMsg('يرجى تعبئة جميع الحقول المطلوبة.');
      return;
    }

    if (!finalTeam || (role === 'user' && !finalJobTitle)) {
      setErrorMsg('يرجى التأكد من اختيار القسم والمسمى الوظيفي.');
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
      await register({
        username: username.trim(),
        email: email.trim(),
        password,
        role,
        team: finalTeam,
        jobTitle: finalJobTitle,
        status: 'pending',
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'فشلت عملية إنشاء الحساب. يرجى المحاولة مرة أخرى.');
    }
  };

  const stepperItems = [
    { num: 1, label: '1. اختيار الفريق' },
    { num: 2, label: '2. المسمى الوظيفي' },
    { num: 3, label: '3. بيانات الحساب' },
  ];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: smoothEase }}
      className="w-full max-w-2xl p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#0f172a] border border-border/80 dark:border-transparent shadow-xl dark:shadow-500 text-right relative z-10 overflow-hidden"
      dir="rtl"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary shadow-sm">
          <UserPlus className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">إنشاء حساب جديد</h2>
        <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
          اتبع الخطوات التالية لتحديد فريقك ومسمّاك الوظيفي قبل إتمام بيانات الحساب
        </p>
      </div>

      {/* Progress Stepper Bar */}
      <div className="mb-7">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {stepperItems.map((item) => {
            const isCompleted = step > item.num || (role === 'admin' && item.num === 2 && step === 3);
            const isActive = step === item.num;
            const isSkipped = role === 'admin' && item.num === 2;

            return (
              <div
                key={item.num}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-2 sm:px-3 rounded-xl border text-xs font-bold transition-all duration-300 ${
                  isActive
                    ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-[1.02]'
                    : isCompleted
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                    : isSkipped
                    ? 'bg-muted/40 text-muted-foreground/50 border-border/40 line-through'
                    : 'bg-muted/60 dark:bg-slate-800/60 text-muted-foreground border-border/60 dark:border-transparent'
                }`}
              >
                {isCompleted && !isSkipped && <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />}
                <span className="truncate">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto', marginBottom: 20 }}
            exit={{ opacity: 0, y: -8, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.25, ease: smoothEase }}
            className="overflow-hidden"
          >
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-600 dark:text-rose-400">
              {errorMsg}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait" custom={direction}>
        {/* STEP 1: Role & Team Selection */}
        {step === 1 && (
          <motion.div
            key="step-1"
            custom={direction}
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            {/* Account Role Switcher */}
            <motion.div variants={itemVariants}>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5">
                نوع الحساب المطلوب
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.985 }}
                  type="button"
                  onClick={() => handleSelectRole('user')}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-right transition-all ${
                    role === 'user'
                      ? 'bg-primary/10 border-primary ring-2 ring-primary/20 text-foreground'
                      : 'bg-muted/40 dark:bg-slate-800/50 border-border/70 dark:border-transparent text-muted-foreground hover:bg-muted/70'
                  }`}
                >
                  <div
                    className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background dark:bg-slate-900 text-muted-foreground border border-border/60 dark:border-transparent'
                    }`}
                  >
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-foreground">عضو فريق (موظف)</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      ينضم إلى فريق محدد لتنفيذ المهام الموكلة إليه
                    </p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.985 }}
                  type="button"
                  onClick={() => handleSelectRole('admin')}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-right transition-all ${
                    role === 'admin'
                      ? 'bg-primary/10 border-primary ring-2 ring-primary/20 text-foreground'
                      : 'bg-muted/40 dark:bg-slate-800/50 border-border/70 dark:border-transparent text-muted-foreground hover:bg-muted/70'
                  }`}
                >
                  <div
                    className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      role === 'admin'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background dark:bg-slate-900 text-muted-foreground border border-border/60 dark:border-transparent'
                    }`}
                  >
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-foreground">قائد فريق (Team Leader)</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      يقود فريقاً محدداً ويدير مهامه وأعضاءه
                    </p>
                  </div>
                </motion.button>
              </div>
            </motion.div>

            <AnimatePresence>
              {role === 'admin' && (
                <motion.div
                  key="leader-info"
                  initial={{ opacity: 0, y: 8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  transition={{ duration: 0.22, ease: smoothEase }}
                  className="overflow-hidden"
                >
                  <div className="p-4 rounded-2xl bg-violet-500/10 border border-violet-500/20 dark:border-transparent text-right space-y-1.5">
                    <div className="flex items-center gap-2 text-violet-700 dark:text-violet-300 font-bold text-xs sm:text-sm">
                      <Sparkles className="h-4 w-4 shrink-0" />
                      <span>حساب قائد فريق (Team Leader)</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      اختر القسم أو الفريق الذي ستتولى قيادته من القائمة أدناه لتسجيلك كـ <strong>قائد الفريق</strong> وإدارة مهام وأعضاء فريقك مباشرة.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              key="team-grid"
              variants={staggerGridVariants}
              initial="initial"
              animate="animate"
            >
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5">
                {role === 'admin' ? 'اختر القسم / الفريق الذي ستتولى قيادته' : 'اختر القسم / الفريق الذي تعمل به'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {COMPANY_TEAMS.map((team) => {
                  const IconComponent = TEAM_ICONS[team.iconName];
                  const isSelected = selectedTeamId === team.id;

                  return (
                    <motion.button
                      key={team.id}
                      variants={itemVariants}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.985 }}
                      type="button"
                      onClick={() => handleSelectTeam(team.id)}
                      className={`relative flex items-start gap-3 p-4 rounded-xl border text-right transition-colors ${
                        isSelected
                          ? 'bg-primary/10 border-primary ring-2 ring-primary/25 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-border/70 dark:border-transparent hover:border-primary/40 hover:bg-slate-100/80 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div
                        className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-white dark:bg-slate-900 text-primary border border-border/60 dark:border-transparent'
                        }`}
                      >
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1 pl-4">
                        <h3 className="text-sm font-bold text-foreground leading-snug">
                          {team.name}
                        </h3>
                        <p className="text-[11px] font-semibold text-primary/80 mt-0.5">
                          {team.nameEn}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                          {team.description}
                        </p>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="h-4 w-4 text-primary absolute top-3 left-3" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            <motion.button
              variants={itemVariants}
              whileTap={{ scale: 0.99 }}
              type="button"
              onClick={handleNextFromStep1}
              className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/95 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2"
            >
              <span>
                {role === 'admin'
                  ? 'المتابعة لإدخال بيانات قائد الفريق'
                  : 'الخطوة التالية: اختيار الوظيفة'}
              </span>
              <ArrowLeft className="h-4 w-4" />
            </motion.button>
          </motion.div>
        )}

        {/* STEP 2: Job Title Selection */}
        {step === 2 && selectedTeam && (
          <motion.div
            key="step-2"
            custom={direction}
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            {/* Selected Team Summary Banner */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-xl bg-primary/10 border border-primary/20"
            >
              <div className="flex items-center gap-2.5">
                {(() => {
                  const IconComp = TEAM_ICONS[selectedTeam.iconName];
                  return (
                    <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                      <IconComp className="h-4 w-4" />
                    </div>
                  );
                })()}
                <div>
                  <p className="text-[11px] text-muted-foreground font-semibold">القسم المختار</p>
                  <p className="text-sm font-bold text-foreground">{selectedTeam.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  goToStep(1);
                }}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>تغيير الفريق</span>
              </button>
            </motion.div>

            {/* Job Title Options */}
            <motion.div variants={staggerGridVariants} initial="initial" animate="animate">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5">
                اختر مسمّاك الوظيفي داخل {selectedTeam.name}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedTeam.jobs.map((job) => {
                  const isSelected = !isCustomJob && selectedJob === job;
                  return (
                    <motion.button
                      key={job}
                      variants={itemVariants}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.985 }}
                      type="button"
                      onClick={() => {
                        setErrorMsg('');
                        setIsCustomJob(false);
                        setSelectedJob(job);
                      }}
                      className={`flex items-center justify-between p-3.5 rounded-xl border text-right transition-colors ${
                        isSelected
                          ? 'bg-primary/10 border-primary ring-2 ring-primary/25 text-foreground font-bold'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-border/70 dark:border-transparent text-foreground/90 hover:border-primary/40 hover:bg-slate-100/80 dark:hover:bg-slate-800 font-medium'
                      }`}
                    >
                      <span className="text-sm">{job}</span>
                      {isSelected && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
                    </motion.button>
                  );
                })}

                {/* Custom Job Title Option */}
                <motion.button
                  variants={itemVariants}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.985 }}
                  type="button"
                  onClick={() => {
                    setErrorMsg('');
                    setIsCustomJob(true);
                    setSelectedJob('');
                  }}
                  className={`flex items-center justify-between p-3.5 rounded-xl border text-right transition-colors sm:col-span-2 ${
                    isCustomJob
                      ? 'bg-primary/10 border-primary ring-2 ring-primary/25 text-foreground font-bold'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-dashed border-border dark:border-transparent text-muted-foreground hover:border-primary/40 font-semibold'
                  }`}
                >
                  <span className="text-sm flex items-center gap-2">
                    <Edit3 className="h-4 w-4" />
                    <span>مسمى وظيفي آخر (إدخال يدوي)</span>
                  </span>
                  {isCustomJob && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
                </motion.button>
              </div>

              <AnimatePresence>
                {isCustomJob && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -6, height: 0 }}
                    transition={{ duration: 0.25, ease: smoothEase }}
                    className="mt-3 overflow-hidden"
                  >
                    <label className="block text-xs font-bold text-muted-foreground mb-1.5">
                      أدخل المسمى الوظيفي
                    </label>
                    <input
                      type="text"
                      value={customJobTitle}
                      onChange={(e) => setCustomJobTitle(e.target.value)}
                      placeholder="مثال: Senior Tech Lead أو System Architect"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-border/80 dark:border-transparent text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-right"
                      autoFocus
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  goToStep(1);
                }}
                className="py-3 px-5 rounded-xl bg-muted hover:bg-muted/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-foreground font-semibold text-sm transition-all flex items-center justify-center gap-1.5"
              >
                <ArrowRight className="h-4 w-4" />
                <span>السابق</span>
              </button>

              <button
                type="button"
                onClick={handleNextFromStep2}
                className="flex-1 py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/95 active:scale-[0.99] transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2"
              >
                <span>الخطوة التالية: بيانات الحساب</span>
                <ArrowLeft className="h-4 w-4" />
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* STEP 3: Final Account Details Form */}
        {step === 3 && (
          <motion.div
            key="step-3"
            custom={direction}
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-5"
          >
            {/* Selection Summary Banner */}
            <motion.div
              variants={itemVariants}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-border/70 dark:border-transparent flex flex-wrap items-center justify-between gap-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-xs font-bold">
                  <Briefcase className="h-3.5 w-3.5" />
                  {finalTeam}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {finalJobTitle}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  goToStep(1);
                }}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>تعديل</span>
              </button>
            </motion.div>

            <motion.form
              variants={staggerGridVariants}
              initial="initial"
              animate="animate"
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <motion.div variants={itemVariants}>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  اسم المستخدم
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-border/80 dark:border-transparent text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-right"
                    placeholder="اسمك الكامل"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-muted-foreground/70">
                    <User className="h-4 w-4" />
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-border/80 dark:border-transparent text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-right"
                    placeholder="name@company.com"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-muted-foreground/70">
                    <Mail className="h-4 w-4" />
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-border/80 dark:border-transparent text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-right"
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
                      className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-border/80 dark:border-transparent text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-right"
                      placeholder="••••••••"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-muted-foreground/70">
                      <Lock className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleBackFromStep3}
                  disabled={isLoading}
                  className="py-3 px-5 rounded-xl bg-muted hover:bg-muted/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-foreground font-semibold text-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span>رجوع</span>
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/95 active:scale-[0.99] transition-all shadow-md shadow-primary/20 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب الآن'}
                </button>
              </motion.div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center mt-6 pt-4 border-t border-border/40 dark:border-transparent space-y-2">
        <p className="text-sm text-muted-foreground">
          لديك حساب بالفعل؟{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            تسجيل الدخول
          </Link>
        </p>
        <p className="text-xs text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors font-semibold">
            العودة إلى الصفحة الرئيسية
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
