import React from 'react';
import * as Icons from 'lucide-react';

interface EmptyStateProps {
  icon?: keyof typeof Icons;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon = 'FolderOpen',
  title,
  description,
  actionText,
  onAction,
}: EmptyStateProps) {
  const IconComponent = Icons[icon] as React.ComponentType<any>;

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed rounded-2xl bg-card/20 border-border/80 min-h-[300px] animate-fade-in">
      <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary/5 text-primary border border-primary/10">
        {IconComponent && <IconComponent className="w-8 h-8" />}
      </div>
      <h3 className="mb-1 text-lg font-semibold text-foreground">{title}</h3>
      <p className="max-w-xs mb-6 text-sm text-muted-foreground">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-all duration-200 border rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] border-primary/20 shadow-lg shadow-primary/20"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
