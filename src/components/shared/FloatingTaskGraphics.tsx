'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Rocket, Navigation, CheckCircle2, ListTodo, Zap, Sparkles, Target, CheckSquare } from 'lucide-react';

/**
 * FloatingTaskGraphics renders award-winning, luxury floating 3D glassmorphic icons
 * representing flying missions, tasks in progress, and completed milestones.
 * Runs smoothly in the background without blocking UI interactions.
 */
export default function FloatingTaskGraphics() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      
      {/* 1. 🚀 Flying Mission Rocket (Gliding across top-left to right) */}
      <motion.div
        initial={{ x: '-15vw', y: '18vh', rotate: 12, opacity: 0 }}
        animate={{
          x: ['-15vw', '115vw'],
          y: ['18vh', '24vh', '15vh', '22vh'],
          rotate: [12, 18, 10, 15],
          opacity: [0, 0.45, 0.45, 0],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-500/20 shadow-lg backdrop-blur-[2px]"
      >
        <Rocket className="h-5 w-5 text-emerald-500 animate-pulse" />
        <span className="text-[11px] font-bold text-emerald-600/80 tracking-wide hidden sm:inline">مهمة طائرة #104</span>
        <div className="w-8 h-0.5 bg-gradient-to-l from-emerald-400 to-transparent rounded-full" />
      </motion.div>

      {/* 2. ✈️ Gliding Task Paper Plane (Right to Left across middle) */}
      <motion.div
        initial={{ x: '115vw', y: '45vh', rotate: -15, opacity: 0 }}
        animate={{
          x: ['115vw', '-15vw'],
          y: ['45vh', '35vh', '50vh', '40vh'],
          rotate: [-15, -10, -22, -15],
          opacity: [0, 0.4, 0.4, 0],
        }}
        transition={{
          duration: 32,
          repeat: Infinity,
          delay: 5,
          ease: 'linear',
        }}
        className="absolute flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-l from-blue-500/15 via-indigo-500/10 to-transparent border border-blue-400/20 shadow-md backdrop-blur-[2px]"
      >
        <div className="w-6 h-0.5 bg-gradient-to-r from-blue-400 to-transparent rounded-full" />
        <span className="text-[10px] font-bold text-blue-600/80 hidden md:inline">انطلاق التحديثات</span>
        <Navigation className="h-4.5 w-4.5 text-blue-500 -rotate-45" />
      </motion.div>

      {/* 3. ✅ Floating Completed Checkmark Sphere (Top Right Quadrant) */}
      <motion.div
        animate={{
          y: [-12, 12, -12],
          rotate: [0, 10, -10, 0],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-[15%] left-[8%] md:left-[15%] flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 shadow-xl backdrop-blur-sm opacity-35 hover:opacity-80 transition-opacity"
      >
        <CheckCircle2 className="h-6 w-6 text-emerald-500" />
      </motion.div>

      {/* 4. 📋 Hovering Kanban Task Card (Bottom Left Area) */}
      <motion.div
        animate={{
          y: [15, -15, 15],
          rotate: [-6, 6, -6],
          x: [-8, 8, -8],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        className="absolute bottom-[20%] left-[5%] md:left-[12%] p-3 rounded-2xl bg-card/40 border border-border/40 shadow-2xl backdrop-blur-md opacity-30 flex flex-col gap-1.5 w-32"
      >
        <div className="flex items-center justify-between">
          <ListTodo className="h-4 w-4 text-indigo-500" />
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </div>
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="w-3/4 h-full bg-indigo-500 rounded-full" />
        </div>
        <div className="w-2/3 h-1 bg-muted-foreground/20 rounded-full" />
      </motion.div>

      {/* 5. 🎯 Mission Target Diamond (Top Left Area) */}
      <motion.div
        animate={{
          rotate: [0, 360],
          y: [-10, 15, -10],
        }}
        transition={{
          rotate: { duration: 40, repeat: Infinity, ease: 'linear' },
          y: { duration: 16, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute top-[28%] right-[6%] md:right-[14%] flex items-center justify-center w-11 h-11 rounded-3xl bg-amber-500/10 border border-amber-500/25 shadow-lg backdrop-blur-sm opacity-30"
      >
        <Target className="h-5 w-5 text-amber-500" />
      </motion.div>

      {/* 6. ⚡ Active Progress Zap (Bottom Right Quadrant) */}
      <motion.div
        animate={{
          scale: [0.9, 1.15, 0.9],
          rotate: [0, -15, 15, 0],
          y: [10, -10, 10],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        className="absolute bottom-[25%] right-[8%] md:right-[18%] flex items-center justify-center w-10 h-10 rounded-2xl bg-violet-500/10 border border-violet-500/25 shadow-md backdrop-blur-sm opacity-30"
      >
        <Zap className="h-5 w-5 text-violet-500" />
      </motion.div>

      {/* 7. ✨ Glowing Sparkle Star (Center Left Drift) */}
      <motion.div
        animate={{
          opacity: [0.15, 0.45, 0.15],
          scale: [0.8, 1.2, 0.8],
          y: [-20, 20, -20],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-[55%] right-[25%] hidden lg:flex items-center justify-center w-9 h-9 rounded-full bg-cyan-500/10 border border-cyan-400/20 backdrop-blur-xs opacity-30"
      >
        <Sparkles className="h-4 w-4 text-cyan-400" />
      </motion.div>

      {/* 8. 📨 Second Gliding Paper Plane / Task Mission (Mid Right to Top Left) */}
      <motion.div
        initial={{ x: '110vw', y: '75vh', rotate: -25, opacity: 0 }}
        animate={{
          x: ['110vw', '-20vw'],
          y: ['75vh', '55vh', '65vh', '45vh'],
          rotate: [-25, -18, -28, -20],
          opacity: [0, 0.35, 0.35, 0],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          delay: 14,
          ease: 'linear',
        }}
        className="absolute flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-l from-rose-500/15 via-amber-500/10 to-transparent border border-rose-400/20 shadow-lg backdrop-blur-[2px]"
      >
        <div className="w-8 h-0.5 bg-gradient-to-r from-rose-400 to-transparent rounded-full" />
        <span className="text-[10px] font-bold text-rose-600/80 hidden sm:inline">تسليم مهمة عاجلة 🚀</span>
        <Send className="h-4 w-4 text-rose-500 -rotate-45" />
      </motion.div>

    </div>
  );
}
