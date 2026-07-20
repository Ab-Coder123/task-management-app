'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { Moon, Sun, Laptop, ChevronDown, Check, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownPos, setDropdownPos] = React.useState({ top: 0, left: 0, width: 0 });
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.closest('[data-theme-toggle]')?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
      });
    }
    setIsOpen(prev => !prev);
  };

  if (!mounted) {
    return <div className="h-9 w-32 rounded-xl bg-muted animate-pulse" />;
  }

  const getActiveConfig = () => {
    if (theme === 'dark') return { label: 'الوضع الليلي', Icon: Moon, color: 'text-indigo-400', bg: 'bg-indigo-500/10' };
    if (theme === 'light') return { label: 'الوضع المضيء', Icon: Sun, color: 'text-amber-500', bg: 'bg-amber-500/10' };
    return { label: 'تلقائي (النظام)', Icon: Laptop, color: 'text-blue-500', bg: 'bg-blue-500/10' };
  };

  const current = getActiveConfig();
  const CurrentIcon = current.Icon;

  return (
    <div className="relative inline-block text-right select-none " data-theme-toggle dir="rtl">
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card border border-border/80 hover:border-primary/50 text-xs font-extrabold text-foreground shadow-100 hover:shadow-200 transition-all cursor-pointer group"
        title="تغيير مظهر واجهة الاستخدام"
      >
        <div className={`p-1 rounded-lg ${current.bg} ${current.color} transition-transform group-hover:scale-110`}>
          <CurrentIcon className="h-3.5 w-3.5" />
        </div>
        <span>{current.label}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
      </button>

      {/* Portal Dropdown — renders directly on document.body */}
      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Invisible backdrop to catch outside clicks */}
              <div className="fixed inset-0" style={{ zIndex: 9998 }} onClick={() => setIsOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
                style={{
                  position: 'fixed',
                  top: dropdownPos.top,
                  left: dropdownPos.left,
                  zIndex: 1,
                  minWidth: '12rem',
                }}
                className="w-48 rounded-2xl bg-white border border-border/90 shadow-500 p-1.5 overflow-hidden text-right"
                dir="rtl"
              >
                <div className="px-2.5 py-1.5 mb-1 border-b border-border/40 text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-primary" />
                  <span>مظهر واجهة التطبيق</span>
                </div>

                <button
                  onClick={() => { setTheme('light'); setIsOpen(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${theme === 'light' ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted/70'}`}
                >
                  <div className="flex items-center gap-2">
                    <Sun className={`h-4 w-4 ${theme === 'light' ? 'text-amber-500 fill-amber-500/20' : 'text-muted-foreground'}`} />
                    <span>الوضع المضيء</span>
                  </div>
                  {theme === 'light' && <Check className="h-4 w-4 text-primary stroke-[2.5]" />}
                </button>

                <button
                  onClick={() => { setTheme('dark'); setIsOpen(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer mt-0.5 ${theme === 'dark' ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted/70'}`}
                >
                  <div className="flex items-center gap-2">
                    <Moon className={`h-4 w-4 ${theme === 'dark' ? 'text-indigo-400 fill-indigo-400/20' : 'text-muted-foreground'}`} />
                    <span>الوضع الليلي</span>
                  </div>
                  {theme === 'dark' && <Check className="h-4 w-4 text-primary stroke-[2.5]" />}
                </button>

                <button
                  onClick={() => { setTheme('system'); setIsOpen(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer mt-0.5 ${theme === 'system' ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted/70'}`}
                >
                  <div className="flex items-center gap-2">
                    <Laptop className={`h-4 w-4 ${theme === 'system' ? 'text-blue-500' : 'text-muted-foreground'}`} />
                    <span>تلقائي (حسب النظام)</span>
                  </div>
                  {theme === 'system' && <Check className="h-4 w-4 text-primary stroke-[2.5]" />}
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
