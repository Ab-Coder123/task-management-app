import React from 'react';
import * as Icons from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: keyof typeof Icons;
  description?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

export default function StatsCard({
  title,
  value,
  icon,
  description,
  trend,
  color = 'primary',
}: StatsCardProps) {
  const IconComponent = Icons[icon] as React.ComponentType<any>;

  const colorStyles = {
    primary: 'text-primary bg-primary/10 border-primary/20',
    success: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    warning: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    danger: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    info: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-300 hover:border-border hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${colorStyles[color]}`}>
          {IconComponent && <IconComponent className="h-5 w-5" />}
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-3xl font-bold tracking-tight text-foreground">{value}</h3>
        
        {(description || trend) && (
          <div className="mt-2 flex items-center space-x-2">
            {trend && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                trend.isPositive 
                  ? 'bg-emerald-500/10 text-emerald-500' 
                  : 'bg-rose-500/10 text-rose-500'
              }`}>
                {trend.value}
              </span>
            )}
            {description && (
              <span className="text-xs text-muted-foreground">{description}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
