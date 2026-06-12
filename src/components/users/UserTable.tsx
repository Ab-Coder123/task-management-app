'use client';

import React from 'react';
import { User } from '@/lib/types';
import UserStatusBadge from './UserStatusBadge';
import { formatDate } from '@/lib/utils';
import { Check, X, Trash2, Shield } from 'lucide-react';

interface UserTableProps {
  users: User[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function UserTable({ users, onApprove, onReject, onDelete }: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="text-center py-12 border rounded-2xl border-dashed border-border/80 bg-card/10">
        <p className="text-sm text-muted-foreground">No users registered yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-sm">
      <table className="w-full min-w-[700px] text-left border-collapse">
        <thead>
          <tr className="border-b border-border/80 bg-muted/20 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <th className="px-6 py-4">User</th>
            <th className="px-6 py-4">Registration Date</th>
            <th className="px-6 py-4">Role</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/40 text-sm text-foreground">
          {users.map((user) => (
            <tr key={user._id} className="hover:bg-muted/10 transition-colors">
              
              {/* User Identity */}
              <td className="px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary flex items-center justify-center uppercase">
                    {user.username.substring(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{user.username}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </td>
              
              {/* Registration Date */}
              <td className="px-6 py-4 text-muted-foreground font-medium">
                {formatDate(user.createdAt, 'PPP')}
              </td>

              {/* Role */}
              <td className="px-6 py-4">
                <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  user.role === 'admin' 
                    ? 'bg-violet-500/10 text-violet-500 border border-violet-500/20' 
                    : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                }`}>
                  {user.role}
                </span>
              </td>
              
              {/* Status Badge */}
              <td className="px-6 py-4">
                <UserStatusBadge status={user.status} />
              </td>
              
              {/* Action Operations */}
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end space-x-2">
                  {user.status === 'pending' && (
                    <>
                      <button
                        onClick={() => onApprove(user._id)}
                        className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-500/10 transition-all"
                        title="Approve User"
                      >
                        <Check className="h-4.5 w-4.5" />
                      </button>
                      <button
                        onClick={() => onReject(user._id)}
                        className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-500/10 transition-all"
                        title="Reject User"
                      >
                        <X className="h-4.5 w-4.5" />
                      </button>
                    </>
                  )}
                  {user.role !== 'admin' && (
                    <button
                      onClick={() => onDelete(user._id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-all"
                      title="Delete User"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  )}
                </div>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
