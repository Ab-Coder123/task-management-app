'use client';

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import UserTable from '@/components/users/UserTable';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { useUsers } from '@/lib/hooks/useUsers';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const pageVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
};

export default function AdminUsersPage() {
  const { users, isLoading, updateUser, deleteUser } = useUsers();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Selected user for deletion confirmation dialog
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

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
        title="إدارة حسابات المستخدمين"
        description="التحقق من التسجيلات المعلقة، تعديل صلاحيات القبول، أو حذف سجلات المستخدمين غير النشطين."
      />

      <div className="animate-fade-in">
        <UserTable
          users={users}
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
