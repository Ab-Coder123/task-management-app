'use client';

import * as React from 'react';
import { Moon, Sun, Laptop } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-xl bg-muted animate-pulse" />
    );
  }

  return (
    <div className="relative inline-flex items-center rounded-xl bg-muted/70 p-1 border border-border/60 shadow-sm">
      <button
        onClick={() => setTheme('light')}
        title="الوضع المضيء"
        className={`flex items-center justify-center h-7 w-7 rounded-lg transition-all cursor-pointer ${
          theme === 'light'
            ? 'bg-card text-primary shadow-sm font-bold scale-105'
            : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
        }`}
      >
        <Sun className="h-4 w-4" />
      </button>

      <button
        onClick={() => setTheme('dark')}
        title="الوضع الليلي"
        className={`flex items-center justify-center h-7 w-7 rounded-lg transition-all cursor-pointer ${
          theme === 'dark'
            ? 'bg-card text-primary shadow-sm font-bold scale-105'
            : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
        }`}
      >
        <Moon className="h-4 w-4" />
      </button>

      <button
        onClick={() => setTheme('system')}
        title="تلقائي (حسب ألوان الجهاز)"
        className={`flex items-center justify-center h-7 w-7 rounded-lg transition-all cursor-pointer ${
          theme === 'system'
            ? 'bg-card text-primary shadow-sm font-bold scale-105'
            : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
        }`}
      >
        <Laptop className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
