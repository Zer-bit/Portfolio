/**
 * @file StartScreen.tsx — StartScreen Game Component
 *
 * Renders the Mario-themed landing/intro screen for the portfolio site.
 * Displays the developer name with a coin-gold color, a blinking "PRESS START"
 * call-to-action button, and a floating animation to evoke the classic
 * Super Mario Bros. title screen aesthetic.
 *
 * This file exports two things:
 * - `StartScreenComponent` — the actual React implementation (named export)
 * - `default` — a `next/dynamic` wrapped version with `{ ssr: false }` for
 *   code splitting and to avoid SSR issues with Framer Motion animations.
 *
 * @example
 * ```tsx
 * import StartScreen from "@/components/game/StartScreen";
 * <StartScreen />
 * ```
 */

"use client";

import type React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { dayTheme } from "../../lib/theme";
import { fadeUpVariant, bounceVariant } from "../../lib/animations";
import { PixelButton } from "../ui/pixel-button";
import { ROUTES } from "../../lib/constants";
import { useProgressTracker } from "../../lib/progress-tracker";

// ---------------------------------------------------------------------------
// Implementation
// ---------------------------------------------------------------------------

/**
 * StartScreenComponent — Mario-themed intro/landing screen.
 *
 * Layout mirrors a classic game title screen:
 * - Developer name displayed prominently in coin gold using `.pixel-text`
 * - Subtitle / tagline in white `.pixel-text`
 * - Animated "PRESS START" PixelButton with coin variant
 * - Blinking cursor element using `bounceVariant` for Mario title screen feel
 *
 * All animations use existing presets from `app/lib/animations.ts`.
 * All colors use existing tokens from `app/lib/theme.ts`.
 */
export const StartScreenComponent: React.FC = () => {
  const router = useRouter();
  const { markVisited } = useProgressTracker();

  const handlePressStart = () => {
    // Mark /world as visited before navigating so the World card
    // shows ★ CLEAR immediately when the world map renders.
    markVisited(ROUTES.world);
    router.push(ROUTES.world);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        gap: "32px",
        padding: "32px 16px",
        textAlign: "center",
      }}
      role="main"
      aria-label="Start Screen"
    >
      {/* Developer name — fade up on mount */}
      <motion.div
        variants={fadeUpVariant}
        initial="hidden"
        animate="visible"
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        {/* Portfolio label */}
        <span
          className="pixel-text"
          style={{
            color: dayTheme.colors.text,
            fontSize: "10px",
            letterSpacing: "0.2em",
          }}
        >
          PORTFOLIO
        </span>

        {/* Developer name in coin gold */}
        <h1
          className="pixel-text"
          style={{
            color: dayTheme.colors.coin,
            fontSize: "clamp(14px, 3vw, 24px)",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          JEZER PARALES
        </h1>

        {/* Tagline */}
        <span
          className="pixel-text"
          style={{
            color: dayTheme.colors.text,
            fontSize: "9px",
            letterSpacing: "0.15em",
            opacity: 0.85,
          }}
        >
          FULL STACK DEVELOPER
        </span>
      </motion.div>

      {/* Decorative coin-colored divider */}
      <motion.div
        variants={fadeUpVariant}
        initial="hidden"
        animate="visible"
        style={{
          width: "120px",
          height: "4px",
          backgroundColor: dayTheme.colors.coin,
          imageRendering: "pixelated",
        }}
        aria-hidden="true"
      />

      {/* PRESS START button — bounces to draw attention */}
      <motion.div
        variants={bounceVariant}
        initial="initial"
        animate="animate"
        aria-label="Press Start to enter the portfolio"
      >
        <PixelButton
          variant="coin"
          size="lg"
          onClick={handlePressStart}
          aria-label="Press Start — navigate to world map"
        >
          PRESS START
        </PixelButton>
      </motion.div>

      {/* Blinking cursor — Mario title screen aesthetic */}
      <motion.span
        className="pixel-text"
        style={{
          color: dayTheme.colors.coin,
          fontSize: "10px",
          display: "inline-block",
        }}
        animate={{ opacity: [1, 0, 1] }}
        transition={{
          duration: 1.2,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        }}
        aria-hidden="true"
      >
        ▼
      </motion.span>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Default export — dynamic import wrapper (no SSR)
// ---------------------------------------------------------------------------

/**
 * Dynamically imported StartScreen component with `{ ssr: false }`.
 *
 * Use this default export in all consuming components to enable code splitting
 * and avoid SSR hydration issues with Framer Motion animations.
 *
 * @satisfies Requirement 14.1 — Game components use next/dynamic with ssr:false
 */
const StartScreen = dynamic(
  () =>
    import("./StartScreen").then((mod) => ({
      default: mod.StartScreenComponent,
    })),
  { ssr: false }
);

export default StartScreen;
