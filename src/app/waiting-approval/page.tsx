'use client';

import React from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { ShieldAlert, LogOut, Clock } from 'lucide-react';

export default function WaitingApprovalPage() {
  const { user, logout, isLoading } = useAuth();

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-background">
      
      {/* Background blurs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-amber-500/5 blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-md p-8 rounded-2xl glass-panel border border-border shadow-2xl text-center animate-fade-in">
        
        {/* Animated Clock / Status Header */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 mb-6 animate-pulse">
          <Clock className="h-8 w-8" />
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-2">Pending Approval</h2>
        
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          Your account <span className="font-semibold text-foreground">({user?.email})</span> was successfully registered and is currently waiting for admin approval.
        </p>

        {/* Account Details Box */}
        <div className="bg-card border border-border/80 rounded-xl p-4 mb-8 text-left space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground font-medium">Username:</span>
            <span className="text-foreground font-semibold">{user?.username}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground font-medium">Status:</span>
            <span className="text-amber-500 font-bold uppercase tracking-wider">Pending Verification</span>
          </div>
        </div>

        {/* Actions button */}
        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/95 transition-all"
          >
            Check Status
          </button>
          
          <button
            onClick={logout}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl border border-border/80 text-rose-500 font-semibold text-xs hover:bg-rose-500/10 transition-all"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out / Use Another Account</span>
          </button>
        </div>

      </div>
    </div>
  );
}
