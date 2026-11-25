'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useTeams } from '@/lib/hooks/useTeams';
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
import { CanonicalRole, Team } from '@/lib/types';
import { COMPANY_TEAMS, CompanyTeam } from '@/lib/constants/departments';
import TeamSelectorGrid from '@/components/teams/TeamSelectorGrid';
import CreateTeamModal, { CreateTeamFormValues } from '@/components/teams/CreateTeamModal';

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
      duration: 0.34,
      ease: smoothEase,
      when: 'beforeChildren',
      staggerChildren: 0.04,
    },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? 24 : -24,
    scale: 0.985,
    transition: { duration: 0.2, ease: 'easeIn' },
  }),
};

const staggerGridVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.03,
    },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 12, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: smoothEase },
  },
};

export default function RegisterForm() {
  const { register, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const initialDeptParam = searchParams.get('team');
  const validInitialDept = COMPANY_TEAMS.find((t) => t.id === initialDeptParam);

  // Wizard state (Public signup ONLY allows 'user' or 'team_leader', NEVER 'super_admin')
  const [step, setStep] = useState<1 | 2 | 3>(validInitialDept ? 2 : 1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [role, setRole] = useState<'user' | 'team_leader'>('user');
  const [selectedDeptId, setSelectedDeptId] = useState<string>(validInitialDept?.id || '');

  // Team & Job state (Step 2)
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [selectedTeamName, setSelectedTeamName] = useState<string>('');
  const [pendingNewTeam, setPendingNewTeam] = useState<CreateTeamFormValues | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [selectedJob, setSelectedJob] = useState<string>('');
  const [isCustomJob, setIsCustomJob] = useState(false);
  const [customJobTitle, setCustomJobTitle] = useState('');

  // Form fields state (Step 3)
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const selectedDept = COMPANY_TEAMS.find((t) => t.id === selectedDeptId);
  const { teams: departmentTeams, isLoading: teamsLoading } = useTeams(
    selectedDept?.id || undefined
  );

  useEffect(() => {
    if (validInitialDept) {
      setSelectedDeptId(validInitialDept.id);
      setStep((prev) => (prev === 1 ? 2 : prev));
    }
  }, [validInitialDept]);

  const effectiveTeamName =
    role === 'team_leader' && pendingNewTeam
      ? pendingNewTeam.name
      : selectedTeamName || departmentTeams.find((t) => t._id === selectedTeamId)?.name || '';

  const effectiveJobTitle =
    role === 'team_leader'
      ? 'قائد الفريق (Team Leader)'
      : isCustomJob
      ? customJobTitle.trim()
      : selectedJob;

  const handleSelectRole = (nextRole: 'user' | 'team_leader') => {
    setErrorMsg('');
    setRole(nextRole);
    if (nextRole === 'user') {
      // Employees CANNOT create new teams — clear any pending new team draft immediately
      setPendingNewTeam(null);
      setIsCreateModalOpen(false);
    }
  };

  const handleSelectDept = (deptId: string) => {
    setErrorMsg('');
    if (deptId !== selectedDeptId) {
      setSelectedDeptId(deptId);
      setSelectedTeamId('');
      setSelectedTeamName('');
      setPendingNewTeam(null);
      setSelectedJob('');
      setIsCustomJob(false);
      setCustomJobTitle('');
    }
  };

  const handleSelectExistingTeam = (team: Team) => {
    setErrorMsg('');
    setPendingNewTeam(null);
    setSelectedTeamId(team._id);
    setSelectedTeamName(team.name);
  };

  const handleConfirmNewTeamModal = (values: CreateTeamFormValues) => {
    setErrorMsg('');
    setPendingNewTeam(values);
    setSelectedTeamId('');
    setSelectedTeamName(values.name);
    setIsCreateModalOpen(false);
  };

  const goToStep = (nextStep: 1 | 2 | 3) => {
    setDirection(nextStep >= step ? 1 : -1);
    setStep(nextStep);
  };

  const handleNextFromStep1 = () => {
    setErrorMsg('');
    if (!selectedDept) {
      setErrorMsg('يرجى اختيار القسم أو التخصص أولاً للمتابعة.');
      return;
    }
    goToStep(2);
  };

  const handleNextFromStep2 = () => {
    setErrorMsg('');
    if (!effectiveTeamName || (!selectedTeamId && !(role === 'team_leader' && pendingNewTeam))) {
      setErrorMsg(
        role === 'team_leader'
          ? 'يرجى اختيار فريق للانضمام إليه أو إنشاء فريقك الجديد.'
          : 'يرجى اختيار الفريق الذي ستنضم إليه داخل القسم للمتابعة.'
      );
      return;
    }

    if (role === 'user') {
      if (isCustomJob) {
        if (!customJobTitle.trim()) {
          setErrorMsg('يرجى كتابة المسمى الوظيفي الخاص بك للمتابعة.');
          return;
        }
      } else if (!selectedJob) {
        setErrorMsg('يرجى اختيار المسمى الوظيفي للمتابعة.');
        return;
      }
    }

    goToStep(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      setErrorMsg('يرجى تعبئة جميع الحقول المطلوبة.');
      return;
    }

    if (!selectedDept || !effectiveTeamName) {
      setErrorMsg('يرجى التأكد من اختيار القسم والفريق.');
      return;
    }

    if (role === 'user' && !effectiveJobTitle) {
      setErrorMsg('يرجى التأكد من اختيار المسمى الوظيفي.');
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
        role: role as CanonicalRole,
        departmentId: selectedDept.id,
        teamId: pendingNewTeam ? undefined : selectedTeamId,
        team: effectiveTeamName,
        jobTitle: effectiveJobTitle,
        newTeam: role === 'team_leader' && pendingNewTeam ? pendingNewTeam : undefined,
        status: 'pending',
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'فشلت عملية إنشاء الحساب. يرجى المحاولة مرة أخرى.');
    }
  };

  const stepperItems = [
    { num: 1, label: '1. الدور والقسم' },
    { num: 2, label: role === 'team_leader' ? '2. اختيار أو إنشاء فريق' : '2. الفريق والوظيفة' },
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
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 dark:border-transparent text-primary shadow-sm">
          <UserPlus className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">إنشاء حساب جديد</h2>
        <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
          حدّد دورك والقسم ثم اختر فريق العمل قبل إتمام بيانات حسابك
        </p>
      </div>

      {/* Progress Stepper Bar */}
      <div className="mb-7">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {stepperItems.map((item) => {
            const isCompleted = step > item.num;
            const isActive = step === item.num;

            return (
              <div
                key={item.num}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-2 sm:px-3 rounded-xl border text-xs font-bold transition-all duration-300 ${
                  isActive
                    ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-[1.02]'
                    : isCompleted
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 dark:border-transparent'
                    : 'bg-muted/60 dark:bg-slate-800/60 text-muted-foreground border-border/60 dark:border-transparent'
                }`}
              >
                {isCompleted && <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />}
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
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 dark:border-transparent text-xs font-semibold text-rose-600 dark:text-rose-400">
              {errorMsg}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait" custom={direction}>
        {/* STEP 1: Role & Department Selection */}
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
            {/* Account Role Switcher (User vs Team Leader ONLY) */}
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
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-right transition-all cursor-pointer ${
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
                      ينضم إلى فريق محدد داخل القسم لتنفيذ المهام
                    </p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.985 }}
                  type="button"
                  onClick={() => handleSelectRole('team_leader')}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-right transition-all cursor-pointer ${
                    role === 'team_leader'
                      ? 'bg-primary/10 border-primary ring-2 ring-primary/20 text-foreground'
                      : 'bg-muted/40 dark:bg-slate-800/50 border-border/70 dark:border-transparent text-muted-foreground hover:bg-muted/70'
                  }`}
                >
                  <div
                    className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      role === 'team_leader'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background dark:bg-slate-900 text-muted-foreground border border-border/60 dark:border-transparent'
                    }`}
                  >
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-foreground">قائد فريق (Team Leader)</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      ينضم لفريق أو ينشئ فريقه الخاص ويقود أعضاءه
                    </p>
                  </div>
                </motion.button>
              </div>
            </motion.div>

            <AnimatePresence>
              {role === 'team_leader' && (
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
                      <span>صلاحية قائد الفريق (Team Leader)</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      في الخطوة التالية يمكنك الانضمام إلى فريق حالي داخل القسم أو <strong>إنشاء فريق جديد باسمك</strong> عبر نافذة سريعة.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Department Selection Grid */}
            <motion.div
              key="dept-grid"
              variants={staggerGridVariants}
              initial="initial"
              animate="animate"
            >
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5">
                اختر القسم العام التابع له
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {COMPANY_TEAMS.map((dept) => {
                  const IconComponent = TEAM_ICONS[dept.iconName];
                  const isSelected = selectedDeptId === dept.id;

                  return (
                    <motion.button
                      key={dept.id}
                      variants={itemVariants}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.985 }}
                      type="button"
                      onClick={() => handleSelectDept(dept.id)}
                      className={`relative flex items-start gap-3 p-4 rounded-xl border text-right transition-colors cursor-pointer ${
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
                          {dept.name}
                        </h3>
                        <p className="text-[11px] font-semibold text-primary/80 mt-0.5">
                          {dept.nameEn}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                          {dept.description}
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
              className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/95 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>
                {role === 'team_leader'
                  ? 'الخطوة التالية: اختيار أو إنشاء الفريق'
                  : 'الخطوة التالية: اختيار الفريق والوظيفة'}
              </span>
              <ArrowLeft className="h-4 w-4" />
            </motion.button>
          </motion.div>
        )}

        {/* STEP 2: Specific Team Selection (+ Create Team Popup for Team Leader) + Job Title (Employee) */}
        {step === 2 && selectedDept && (
          <motion.div
            key="step-2"
            custom={direction}
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            {/* Selected Department Banner */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-xl bg-primary/10 border border-primary/20 dark:border-transparent"
            >
              <div className="flex items-center gap-2.5">
                {(() => {
                  const IconComp = TEAM_ICONS[selectedDept.iconName];
                  return (
                    <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                      <IconComp className="h-4 w-4" />
                    </div>
                  );
                })()}
                <div>
                  <p className="text-[11px] text-muted-foreground font-semibold">
                    {role === 'team_leader' ? 'قائد فريق في قسم' : 'عضو فريق في قسم'}
                  </p>
                  <p className="text-sm font-bold text-foreground">{selectedDept.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  goToStep(1);
                }}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>تغيير القسم أو الدور</span>
              </button>
            </motion.div>

            {/* Real Teams Grid inside Department (Create button ONLY for Team Leader) */}
            <motion.div variants={itemVariants}>
              <TeamSelectorGrid
                departmentName={selectedDept.name}
                teams={departmentTeams}
                isLoading={teamsLoading}
                selectedTeamId={selectedTeamId}
                pendingNewTeam={pendingNewTeam}
                allowCreate={role === 'team_leader'}
                onSelectTeam={handleSelectExistingTeam}
                onOpenCreateModal={() => {
                  if (role === 'team_leader') setIsCreateModalOpen(true);
                }}
                onClearPendingNewTeam={() => setPendingNewTeam(null)}
              />
            </motion.div>

            {/* Job Title Options (Required for Employees; Team Leaders get automatic leader title) */}
            {role === 'user' && (
              <motion.div variants={staggerGridVariants} initial="initial" animate="animate">
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5">
                  اختر مسمّاك الوظيفي داخل {selectedDept.name}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedDept.jobs.map((job) => {
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
                        className={`flex items-center justify-between p-3.5 rounded-xl border text-right transition-colors cursor-pointer ${
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
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-right transition-colors sm:col-span-2 cursor-pointer ${
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
            )}

            <motion.div variants={itemVariants} className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  goToStep(1);
                }}
                className="py-3 px-5 rounded-xl bg-muted hover:bg-muted/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-foreground font-semibold text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowRight className="h-4 w-4" />
                <span>السابق</span>
              </button>

              <button
                type="button"
                onClick={handleNextFromStep2}
                className="flex-1 py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/95 active:scale-[0.99] transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer"
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
                {selectedDept && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-200/70 dark:bg-slate-900 text-foreground text-xs font-bold">
                    {selectedDept.name}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 dark:border-transparent text-xs font-bold">
                  <Users className="h-3.5 w-3.5" />
                  {effectiveTeamName}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 dark:border-transparent text-xs font-bold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {effectiveJobTitle}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  goToStep(2);
                }}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
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
                  onClick={() => {
                    setErrorMsg('');
                    goToStep(2);
                  }}
                  disabled={isLoading}
                  className="py-3 px-5 rounded-xl bg-muted hover:bg-muted/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-foreground font-semibold text-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span>رجوع</span>
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/95 active:scale-[0.99] transition-all shadow-md shadow-primary/20 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  {isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب الآن'}
                </button>
              </motion.div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Team Creation Modal (ONLY mounted for Team Leader) */}
      {role === 'team_leader' && selectedDept && (
        <CreateTeamModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          departmentId={selectedDept.id}
          departmentName={selectedDept.name}
          initialName={pendingNewTeam?.name || ''}
          initialDescription={pendingNewTeam?.description || ''}
          onConfirm={handleConfirmNewTeamModal}
        />
      )}

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
