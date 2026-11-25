'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, CheckCircle2, Plus, Crown, Sparkles, Edit3 } from 'lucide-react';
import { Team, User } from '@/lib/types';
import { CreateTeamFormValues } from './CreateTeamModal';

interface TeamSelectorGridProps {
  departmentName: string;
  teams: Team[];
  isLoading: boolean;
  selectedTeamId: string;
  pendingNewTeam: CreateTeamFormValues | null;
  allowCreate: boolean;
  onSelectTeam: (team: Team) => void;
  onOpenCreateModal: () => void;
  onClearPendingNewTeam?: () => void;
}

export default function TeamSelectorGrid({
  departmentName,
  teams,
  isLoading,
  selectedTeamId,
  pendingNewTeam,
  allowCreate,
  onSelectTeam,
  onOpenCreateModal,
  onClearPendingNewTeam,
}: TeamSelectorGridProps) {
  return (
    <div className="space-y-3" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-xs font-bold text-muted-foreground">
          {allowCreate
            ? `اختر فريقاً للانضمام إليه أو أنشئ فريقك الجديد داخل ${departmentName}`
            : `اختر الفريق الذي ستنضم إليه داخل ${departmentName}`}
        </label>
        {allowCreate && (
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600/10 px-3 py-1.5 text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:bg-blue-600/20 transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>إنشاء فريق جديد</span>
          </button>
        )}
      </div>

      {/* Highlighted card if Team Leader drafted a new team in Popup */}
      {allowCreate && pendingNewTeam && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-violet-500/10 p-4 ring-2 ring-violet-500/40 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-extrabold text-foreground">
                  {pendingNewTeam.name}
                </span>
                <span className="rounded-full bg-violet-600 px-2.5 py-0.5 text-[10px] font-bold text-white">
                  فريقك الجديد (سيُنشأ مع الحساب)
                </span>
              </div>
              {pendingNewTeam.description && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {pendingNewTeam.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenCreateModal}
              className="inline-flex items-center gap-1 rounded-lg bg-white/80 dark:bg-slate-800 px-2.5 py-1.5 text-[11px] font-bold text-foreground hover:bg-white cursor-pointer"
            >
              <Edit3 className="h-3 w-3" />
              <span>تعديل الاسم</span>
            </button>
            {onClearPendingNewTeam && (
              <button
                type="button"
                onClick={onClearPendingNewTeam}
                className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline px-1 cursor-pointer"
              >
                إلغاء
              </button>
            )}
          </div>
        </motion.div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="h-24 rounded-xl bg-muted/40 animate-pulse" />
          <div className="h-24 rounded-xl bg-muted/40 animate-pulse" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {teams.map((team) => {
            const isSelected = !pendingNewTeam && selectedTeamId === team._id;
            const leaderObj =
              team.leaderId && typeof team.leaderId === 'object'
                ? (team.leaderId as User)
                : null;

            return (
              <motion.button
                key={team._id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.985 }}
                type="button"
                onClick={() => onSelectTeam(team)}
                className={`relative flex items-start gap-3 p-4 rounded-xl border text-right transition-all cursor-pointer ${
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
                  <Users className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1 pl-4">
                  <h4 className="text-sm font-extrabold text-foreground leading-snug">
                    {team.name}
                  </h4>

                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-muted-foreground">
                    <span>{team.memberCount ?? 0} أعضاء</span>
                    {leaderObj?.username && (
                      <span className="inline-flex items-center gap-1 text-primary/90">
                        <Crown className="h-3 w-3" />
                        <span>قائد: {leaderObj.username}</span>
                      </span>
                    )}
                  </div>

                  {team.description && (
                    <p className="mt-1 text-[11px] text-muted-foreground/85 line-clamp-1">
                      {team.description}
                    </p>
                  )}
                </div>

                {isSelected && (
                  <CheckCircle2 className="h-4 w-4 text-primary absolute top-3 left-3" />
                )}
              </motion.button>
            );
          })}

          {allowCreate && (
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.985 }}
              type="button"
              onClick={onOpenCreateModal}
              className="flex items-center justify-center gap-2.5 p-4 rounded-xl border border-dashed border-primary/50 bg-primary/5 hover:bg-primary/10 text-primary font-extrabold text-xs sm:text-sm transition-colors cursor-pointer min-h-[96px]"
            >
              <Plus className="h-4.5 w-4.5" />
              <span>إنشاء فريق جديد باسم مخصص</span>
            </motion.button>
          )}
        </div>
      )}

      {!isLoading && teams.length === 0 && !allowCreate && (
        <div className="rounded-xl bg-amber-500/10 p-4 text-xs font-semibold text-amber-700 dark:text-amber-300">
          لا توجد فرق متاحة حالياً داخل هذا القسم. تواصل مع قائد فريقك أو مدير المنصة.
        </div>
      )}
    </div>
  );
}
