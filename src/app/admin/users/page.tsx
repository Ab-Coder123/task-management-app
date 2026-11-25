'use client';

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import UserTable from '@/components/users/UserTable';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { useUsers } from '@/lib/hooks/useUsers';
import { useTeams } from '@/lib/hooks/useTeams';
import { useAuthStore } from '@/lib/store/authStore';
import { canChangeUserRoles, isTeamLeader } from '@/lib/auth/permissions';
import { User } from '@/lib/types';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const pageVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
};

export default function AdminUsersPage() {
  const { user: currentUser } = useAuthStore();
  const { users, isLoading, updateUser, deleteUser } = useUsers();
  const { teams } = useTeams();
  const [mounted, setMounted] = useState(false);
  const [teamFilter, setTeamFilter] = useState<string>('all');

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Selected user for deletion confirmation dialog
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const allowRoleChanges = canChangeUserRoles(currentUser?.role);
  const filteredUsers = users.filter((u) => {
    if (teamFilter === 'all') return true;
    return u.teamId === teamFilter || u.team === teamFilter;
  });

  const handleToggleRole = async (target: User) => {
    const nextRole = isTeamLeader(target.role) ? 'user' : 'team_leader';
    try {
      await updateUser({ id: target._id, data: { role: nextRole } });
      toast.success(
        nextRole === 'team_leader'
          ? `تمت ترقية ${target.username} إلى قائد فريق.`
          : `تم تحويل ${target.username} إلى عضو فريق.`
      );
    } catch (err: any) {
      toast.error(err?.message || 'فشل تعديل صلاحية المستخدم.');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await updateUser({ id, data: { status: 'approved' } });
      toast.success('تمت الموافقة على الحساب وتنشيطه بنجاح!');
    } catch (err) {
      console.error('Approve failed', err);
      toast.error('فشلت عملية الموافقة على المستخدم.');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateUser({ id, data: { status: 'rejected' } });
      toast.success('تم رفض حساب المستخدم بنجاح.');
    } catch (err) {
      console.error('Reject failed', err);
      toast.error('فشلت عملية رفض المستخدم.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteUser(deleteTargetId);
      toast.success('تم حذف حساب المستخدم نهائياً بنجاح.');
    } catch (err) {
      console.error('Delete user failed', err);
      toast.error('فشلت عملية حذف حساب المستخدم.');
    } finally {
      setDeleteTargetId(null);
    }
  };

  if (isLoading || !mounted) {
    return <LoadingSpinner size="lg" className="h-[50vh]" />;
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="space-y-6 text-right" 
      dir="rtl"
    >
      <PageHeader
        title={allowRoleChanges ? 'إدارة جميع المستخدمين' : 'إدارة أعضاء فريقي'}
        description={
          allowRoleChanges
            ? 'استعرض المستخدمين عبر جميع الفِرق، تحكم في اعتماد الحسابات أو ترقية قادة الفِرق.'
            : 'التحقق من حسابات أعضاء فريقك المعلقة واعتماد انضمامهم للفريق.'
        }
        action={
          allowRoleChanges && teams.length > 0 ? (
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-card dark:bg-[#101828] border border-border/70 dark:border-transparent text-xs font-bold text-foreground cursor-pointer"
            >
              <option value="all">كل الفِرق ({users.length})</option>
              {teams.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
          ) : null
        }
      />

      <div className="animate-fade-in">
        <UserTable
          users={filteredUsers}
          canChangeRoles={allowRoleChanges}
          onToggleRole={handleToggleRole}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={(id) => setDeleteTargetId(id)}
        />
      </div>

      {/* Delete Confirmation Dialogue */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        title="حذف حساب مستخدم"
        description="هل أنت متأكد تمامًا من رغبتك في حذف هذا الحساب؟ سيتم مسح كافة تعليقاته وتعييناته بشكل نهائي ودائم. لا يمكن التراجع عن هذا الإجراء."
        confirmText="تأكيد الحذف النهائي"
        cancelText="إلغاء"
        isDanger
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </motion.div>
  );
}
