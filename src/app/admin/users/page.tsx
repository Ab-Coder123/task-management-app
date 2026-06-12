'use client';

import React, { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import UserTable from '@/components/users/UserTable';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { useUsers } from '@/lib/hooks/useUsers';

export default function AdminUsersPage() {
  const { users, isLoading, updateUser, deleteUser } = useUsers();
  
  // Selected user for deletion confirmation dialog
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    try {
      await updateUser({ id, data: { status: 'approved' } });
    } catch (err) {
      console.error('Approve failed', err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateUser({ id, data: { status: 'rejected' } });
    } catch (err) {
      console.error('Reject failed', err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteUser(deleteTargetId);
    } catch (err) {
      console.error('Delete user failed', err);
    } finally {
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Accounts Management"
        description="Verify pending registrations, toggle approval flags, or delete inactive user records."
      />

      {isLoading ? (
        <LoadingSpinner size="lg" className="h-[50vh]" />
      ) : (
        <UserTable
          users={users}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={(id) => setDeleteTargetId(id)}
        />
      )}

      {/* Delete Confirmation Dialogue */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        title="Delete User Account"
        description="Are you absolutely sure you want to delete this user? All their comments and assignments will be deleted permanently. This action cannot be undone."
        confirmText="Permanently Delete"
        isDanger
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
