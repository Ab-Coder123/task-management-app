import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
  className?: string;
}

export default function LoadingSpinner({ size = 'md', fullPage = false, className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const container = (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <div className="relative">
        <div className={`rounded-full border-t-primary border-r-primary/30 border-b-primary/10 border-l-primary/30 animate-spin ${sizeClasses[size]}`} />
        <div className="absolute inset-0 rounded-full blur-[6px] border-t-primary/40 border-r-transparent border-b-transparent border-l-transparent animate-pulse" />
      </div>
      <p className="text-xs font-medium text-muted-foreground animate-pulse">Loading...</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-md">
        {container}
      </div>
    );
  }

  return container;
}
