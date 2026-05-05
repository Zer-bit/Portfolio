/**
 * @file coin.tsx — Coin Game Component
 *
 * Renders a pixel-art SVG coin with a continuous spin animation.
 * The coin uses the `spinVariant` from `lib/animations.ts` applied via a
 * `motion.div` wrapper, giving it the classic Mario coin rotation effect.
 *
 * This file exports two things:
 * - `CoinComponent` — the actual React implementation (named export)
 * - `default` — a `next/dynamic` wrapped version with `{ ssr: false }` for
 *   code splitting and to avoid SSR issues with Framer Motion animations.
 *
 * @example
 * ```tsx
 * import Coin from "@/components/game/coin";
 * <Coin size={32} />
 * ```
 */

"use client";

import type React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { spinVariant } from "../../lib/animations";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface CoinProps {
  /** Width and height of the coin in pixels. Defaults to 24. */
  size?: number;
}

// ---------------------------------------------------------------------------
// Implementation
// ---------------------------------------------------------------------------

/**
 * CoinComponent — pixel-art SVG coin with continuous spin animation.
 *
 * The SVG is drawn on an 8×8 pixel grid to maintain crisp pixel-art
 * proportions at any rendered size. The main body uses the Day Theme coin
 * gold (`#f8b800`), with a lighter highlight pixel in the top-left area and
 * a darker shadow pixel in the bottom-right area.
 *
 * @param props.size - Rendered width/height in pixels (default: 24)
 */
export const CoinComponent: React.FC<CoinProps> = ({ size = 24 }) => {
  return (
    <motion.div
      variants={spinVariant}
      initial="initial"
      animate="animate"
      style={{ display: "inline-flex", width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 8 8"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Coin"
        role="img"
        style={{ imageRendering: "pixelated" }}
      >
        {/* Main coin body — gold (#f8b800) */}
        <rect x="1" y="0" width="6" height="8" fill="#f8b800" />
        <rect x="0" y="1" width="1" height="6" fill="#f8b800" />
        <rect x="7" y="1" width="1" height="6" fill="#f8b800" />
        {/* Highlight — lighter gold in top-left area */}
        <rect x="2" y="1" width="2" height="2" fill="#ffd700" />
        {/* Shadow — darker gold in bottom-right area */}
        <rect x="5" y="5" width="2" height="2" fill="#c8960c" />
      </svg>
    </motion.div>
  );
};

// ---------------------------------------------------------------------------
// Default export — dynamic import wrapper (no SSR)
// ---------------------------------------------------------------------------
/**
 * Dynamically imported Coin component with `{ ssr: false }`.
 *
 * Use this default export in all consuming components to enable code splitting
 * and avoid SSR hydration issues with Framer Motion animations.
 *
 * @satisfies Requirement 17.1 — Game_Elements use next/dynamic with ssr:false
 */
const Coin = dynamic(
  () => import("./coin").then((mod) => ({ default: mod.CoinComponent })),
  { ssr: false }
);

export default Coin;
