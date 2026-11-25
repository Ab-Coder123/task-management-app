'use client';

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import CreateTeamModal, { CreateTeamFormValues } from '@/components/teams/CreateTeamModal';
import { useTeams } from '@/lib/hooks/useTeams';
import { useUsers } from '@/lib/hooks/useUsers';
import { useAuthStore } from '@/lib/store/authStore';
import { isSuperAdmin, isTeamLeader } from '@/lib/auth/permissions';
import { COMPANY_TEAMS } from '@/lib/constants/departments';
import { Users, Plus, Trash2, Crown, Layers, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Team, User } from '@/lib/types';

export default function AdminTeamsPage() {
  const { user: currentUser, updateUser } = useAuthStore();
  const { teams, isLoading: teamsLoading, createTeam, isCreatingTeam, deleteTeam } = useTeams();
  const { users, isLoading: usersLoading } = useUsers();

  const [mounted, setMounted] = useState(false);
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Team | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (teamsLoading || usersLoading || !mounted) {
    return <LoadingSpinner size="lg" className="h-[50vh]" />;
  }

  const superAdmin = isSuperAdmin(currentUser?.role);
  const teamLeader = isTeamLeader(currentUser?.role);

  const visibleTeams = teams.filter((team) => {
    if (superAdmin) {
      return deptFilter === 'all' || team.departmentId === deptFilter;
    }
    if (teamLeader) {
      const leaderObjId =
        team.leaderId && typeof team.leaderId === 'object'
          ? (team.leaderId as User)._id
          : team.leaderId;
      return (
        team._id === currentUser?.teamId ||
        team.name === currentUser?.team ||
        (leaderObjId && currentUser?._id && leaderObjId.toString() === currentUser._id.toString()) ||
        (currentUser?.departmentId && team.departmentId === currentUser.departmentId)
      );
    }
    return false;
  });

  const handleCreateTeam = async (values: CreateTeamFormValues) => {
    try {
      const created = await createTeam({
        name: values.name,
        description: values.description,
        departmentId: values.departmentId,
        departmentName: values.departmentName,
        assignAsMyTeam: teamLeader,
      });

      if (teamLeader && created?._id) {
        updateUser({
          teamId: created._id,
          team: created.name,
          departmentId: created.departmentId,
        });
      }

      toast.success(`تم إنشاء فريق "${values.name}" بنجاح!`);
      setIsCreateModalOpen(false);
    } catch (err: any) {
      toast.error(err?.message || 'فشل إنشاء الفريق.');
      throw err;
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTeam(deleteTarget._id);
      toast.success(`تم حذف فريق "${deleteTarget.name}" بنجاح.`);
    } catch (err: any) {
      toast.error(err?.message || 'تعذر حذف الفريق.');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6 text-right"
      dir="rtl"
    >
      <PageHeader
        title={superAdmin ? 'إدارة جميع الفِرق والأقسام' : 'إدارة فريقي والفِرق'}
        description={
          superAdmin
            ? 'استعرض جميع الفِرق عبر أقسام الشركة، القادة، وعدد الأعضاء أو أنشئ فِرقاً جديدة.'
            : 'تصفح تفاصيل فريقك وأعضائه أو أنشئ فريقاً جديداً تقوده داخل قسمك.'
        }
        action={
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>إنشاء فريق جديد</span>
          </button>
        }
      />

      {/* Super Admin Department Filter Chips */}
      {superAdmin && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setDeptFilter('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              deptFilter === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-card dark:bg-[#101828] text-muted-foreground hover:text-foreground'
            }`}
          >
            كل الأقسام ({teams.length})
          </button>
          {COMPANY_TEAMS.map((dept) => (
            <button
              key={dept.id}
              type="button"
              onClick={() => setDeptFilter(dept.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                deptFilter === dept.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-card dark:bg-[#101828] text-muted-foreground hover:text-foreground'
              }`}
            >
              {dept.name}
            </button>
          ))}
        </div>
      )}

      {/* Teams Cards */}
      {visibleTeams.length === 0 ? (
        <div className="rounded-3xl bg-card dark:bg-[#101828] p-12 text-center shadow-200 dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)]">
          <Layers className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm font-bold text-foreground">لا توجد فِرق مطابقة للفلتر الحالي</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleTeams.map((team) => {
            const leaderObj =
              team.leaderId && typeof team.leaderId === 'object'
                ? (team.leaderId as User)
                : null;
            const teamMembersList = users.filter(
              (u) => u.teamId === team._id || u.team === team.name
            );
            const isMyTeam =
              currentUser?.teamId === team._id || currentUser?.team === team.name;

            return (
              <div
                key={team._id}
                className={`flex flex-col justify-between rounded-2xl bg-card dark:bg-[#101828] p-6 shadow-200 dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.65)] transition-all ${
                  isMyTeam ? 'ring-2 ring-blue-600/40' : ''
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">
                      <Sparkles className="h-3 w-3" />
                      <span>{team.departmentName}</span>
                    </span>
                    {isMyTeam && (
                      <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        فريقك الحالي
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-extrabold text-foreground">
                    {team.name}
                  </h3>
                  {team.description && (
                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                      {team.description}
                    </p>
                  )}

                  <div className="mt-4 pt-4 border-t border-border/30 dark:border-slate-800/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                        <Crown className="h-3.5 w-3.5 text-amber-500" />
                        <span>قائد الفريق:</span>
                      </span>
                      <span className="font-bold text-foreground">
                        {leaderObj?.username || 'غير معين بعد'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-blue-500" />
                        <span>الأعضاء المسجلون:</span>
                      </span>
                      <span className="font-bold text-foreground">
                        {teamMembersList.length || team.memberCount || 0} عضو
                      </span>
                    </div>
                  </div>
                </div>

                {superAdmin && !team.isDefault && (
                  <div className="mt-5 pt-3 border-t border-border/30 dark:border-slate-800/80 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(team)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>حذف الفريق</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create Team Popup Modal */}
      <CreateTeamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        allowDepartmentPick={superAdmin || !currentUser?.departmentId}
        departmentId={currentUser?.departmentId || COMPANY_TEAMS[0].id}
        departmentName={
          COMPANY_TEAMS.find((d) => d.id === currentUser?.departmentId)?.name || ''
        }
        isSubmitting={isCreatingTeam}
        onConfirm={handleCreateTeam}
      />

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="حذف الفريق"
        description={`هل أنت متأكد من حذف فريق "${deleteTarget?.name || ''}"؟ سيتم فك ارتباط الأعضاء بهذا الفريق.`}
        confirmText="تأكيد الحذف"
        cancelText="إلغاء"
        isDanger
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </motion.div>
  );
}
