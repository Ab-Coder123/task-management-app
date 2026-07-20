import React from 'react';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-background overflow-hidden">
      {/* Visual Background Highlights */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-violet-500/10 blur-[100px] pointer-events-none" />
      
      <LoginForm />
    </div>
  );
}
