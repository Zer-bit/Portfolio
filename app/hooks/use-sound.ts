"use client";

/**
 * useSound — Mario-themed sound effects via Web Audio API
 *
 * Generates retro 8-bit style sounds procedurally. Respects the
 * `soundEnabled` preference from ThemeContext.
 */

import { useRef, useCallback } from "react";
import { useThemeContext } from "../lib/theme-context";

export interface UseSoundReturn {
  playBounce: () => void;
  playCoin: () => void;
  playPipe: () => void;
  playClick: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function getCtx(ctxRef: React.MutableRefObject<AudioContext | null>): Promise<AudioContext | null> {
  if (typeof window === "undefined") return null;
  try {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") {
      await ctx.resume();
    }
    return ctx;
  } catch {
    return null;
  }
}

function tone(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  volume = 0.3,
  type: OscillatorType = "square"
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  gain.gain.setValueAtTime(volume, startTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.01);
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useSound(): UseSoundReturn {
  const { soundEnabled } = useThemeContext();
  // Use a ref so we don't recreate AudioContext on every render
  const ctxRef = useRef<AudioContext | null>(null);
  // Keep soundEnabled in a ref so callbacks always see the latest value
  const enabledRef = useRef(soundEnabled);
  enabledRef.current = soundEnabled;

  const playBounce = useCallback(async () => {
    if (!enabledRef.current) return;
    const ctx = await getCtx(ctxRef);
    if (!ctx) return;
    const t = ctx.currentTime;
    tone(ctx, 300, t,        0.08, 0.3);
    tone(ctx, 500, t + 0.08, 0.1,  0.3);
  }, []);

  const playCoin = useCallback(async () => {
    if (!enabledRef.current) return;
    const ctx = await getCtx(ctxRef);
    if (!ctx) return;
    const t = ctx.currentTime;
    tone(ctx, 988,  t,        0.08, 0.25);
    tone(ctx, 1319, t + 0.08, 0.15, 0.2);
  }, []);

  const playPipe = useCallback(async () => {
    if (!enabledRef.current) return;
    const ctx = await getCtx(ctxRef);
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "square";
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.4);
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
    osc.start(t);
    osc.stop(t + 0.41);
  }, []);

  const playClick = useCallback(async () => {
    if (!enabledRef.current) return;
    const ctx = await getCtx(ctxRef);
    if (!ctx) return;
    const t = ctx.currentTime;
    tone(ctx, 440, t, 0.07, 0.25);
  }, []);

  return { playBounce, playCoin, playPipe, playClick };
}
