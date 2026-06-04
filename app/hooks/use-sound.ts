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

// ---------------------------------------------------------------------------
// Global Shared AudioContext Singleton
// ---------------------------------------------------------------------------
let globalAudioCtx: AudioContext | null = null;

async function resumeCtx(ctx: AudioContext) {
  try {
    if (ctx.state === "suspended") {
      await ctx.resume();
    }
  } catch (e) {
    console.warn("AudioContext resume failed:", e);
  }
}

function getSharedCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!globalAudioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      globalAudioCtx = new AudioContextClass();
    }
    const ctx = globalAudioCtx;
    if (ctx.state === "suspended") {
      void resumeCtx(ctx);
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
  volume = 0.25,
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
  // Keep soundEnabled in a ref so callbacks always see the latest value
  const enabledRef = useRef(soundEnabled);
  enabledRef.current = soundEnabled;

  const playBounce = useCallback(() => {
    if (!enabledRef.current) return;
    const ctx = getSharedCtx();
    if (!ctx) return;
    const t = ctx.currentTime + 0.02; // 20ms scheduling lookahead to prevent layout rendering dropouts
    tone(ctx, 300, t,        0.08, 0.25);
    tone(ctx, 500, t + 0.08, 0.1,  0.25);
  }, []);

  const playCoin = useCallback(() => {
    if (!enabledRef.current) return;
    const ctx = getSharedCtx();
    if (!ctx) return;
    const t = ctx.currentTime + 0.02; // 20ms scheduling lookahead
    tone(ctx, 988,  t,        0.08, 0.25);
    tone(ctx, 1319, t + 0.08, 0.15, 0.2); // slight drop for pitch echo
  }, []);

  const playPipe = useCallback(() => {
    if (!enabledRef.current) return;
    const ctx = getSharedCtx();
    if (!ctx) return;
    const t = ctx.currentTime + 0.02; // 20ms scheduling lookahead
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

  const playClick = useCallback(() => {
    if (!enabledRef.current) return;
    const ctx = getSharedCtx();
    if (!ctx) return;
    const t = ctx.currentTime + 0.02; // 20ms scheduling lookahead
    tone(ctx, 440, t, 0.07, 0.25);
  }, []);

  return { playBounce, playCoin, playPipe, playClick };
}
