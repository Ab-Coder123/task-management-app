'use client';

// Singleton AudioContext to prevent hitting browser limits and handle suspended states cleanly
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!audioCtx) {
      audioCtx = new AudioCtx();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch (e) {
    console.warn('AudioContext initialization failed:', e);
    return null;
  }
}

/**
 * Helper to play a single crystal marimba/bell note with smooth exponential decay.
 */
function playCrystalNote(ctx: AudioContext, freq: number, startTime: number, duration: number, maxGain: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // Pure sine wave for a soft, crystal glass / marimba tone without harsh buzz
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, startTime);

  // Soft, instant attack with a gentle, relaxing exponential fade-out
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.linearRampToValueAtTime(maxGain, startTime + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration + 0.05);
}

/**
 * Plays a luxurious, soft, and sweet "Crystal Chime" for task completion and success.
 * Inspired by modern iOS / Apple Pay / Todoist success sounds.
 */
export function playSuccessSound() {
  if (typeof window === 'undefined') return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    
    // Play an airy, ascending Major 9th crystal chord cascade (G5 -> B5 -> D6 -> G6)
    // Very gentle and sweet volume level (0.12 - 0.15 max gain)
    playCrystalNote(ctx, 783.99, now,         0.40, 0.12); // G5
    playCrystalNote(ctx, 987.77, now + 0.06,  0.45, 0.14); // B5
    playCrystalNote(ctx, 1174.66, now + 0.12, 0.55, 0.15); // D6
    playCrystalNote(ctx, 1567.98, now + 0.18, 0.75, 0.12); // G6 (soft sustain shimmer)
  } catch (e) {
    console.warn('Audio play blocked or unsupported by browser', e);
  }
}

/**
 * Plays a soft, pleasant "Water Drop / Bubble" chime for incoming notifications and UI interactions.
 */
export function playNotificationSound() {
  if (typeof window === 'undefined') return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Soft marimba drop (A5 gently sliding up to E6)
    osc.frequency.setValueAtTime(880.00, now);        // A5
    osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.12); // E6

    // Very gentle, non-intrusive volume (10% gain)
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.10, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  } catch (e) {
    console.warn('Audio play blocked or unsupported by browser', e);
  }
}
