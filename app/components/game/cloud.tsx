/**
 * @file cloud.tsx — Cloud Game Component
 *
 * Renders a pixel-art SVG cloud with a continuous float animation.
 * The cloud uses the `floatVariant` from `lib/animations.ts` applied via a
 * `motion.div` wrapper, giving it the classic Mario cloud bobbing effect.
 *
 * The cloud SVG is drawn on a 32×16 pixel grid with a white body (`#ffffff`)
 * and a light blue shadow/outline (`#c0d8f8`) along the bottom and sides to
 * simulate the classic Super Mario Bros. cloud aesthetic.
 *
 * This file exports two things:
 * - `CloudComponent` — the actual React implementation (named export)
 * - `default` — a `next/dynamic` wrapped version with `{ ssr: false }` for
 *   code splitting and to avoid SSR issues with Framer Motion animations.
 *
 * @example
 * ```tsx
 * import Cloud from "@/components/game/cloud";
 * <Cloud size="md" style={{ position: "absolute", top: 40, left: 100 }} />
 * ```
 */

"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { floatVariant } from "../../lib/animations";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface CloudProps {
  /**
   * Size variant controlling the rendered width and height of the cloud.
   * - `"sm"` → 64 × 32 px
   * - `"md"` → 96 × 48 px
   * - `"lg"` → 128 × 64 px
   *
   * Defaults to `"md"`.
   */
  size?: "sm" | "md" | "lg";
  /** Optional inline styles for positioning the cloud (e.g. `position`, `top`, `left`). */
  style?: React.CSSProperties;
}

// ---------------------------------------------------------------------------
// Size Map
// ---------------------------------------------------------------------------

/**
 * Maps each size variant to its rendered width and height in pixels.
 * Built on the Pixel_Grid spacing scale (multiples of 4px).
 */
const sizeMap: Record<NonNullable<CloudProps["size"]>, { width: number; height: number }> = {
  sm: { width: 64, height: 32 },
  md: { width: 96, height: 48 },
  lg: { width: 128, height: 64 },
};

// ---------------------------------------------------------------------------
// Implementation
// ---------------------------------------------------------------------------

/**
 * CloudComponent — pixel-art SVG cloud with continuous float animation.
 *
 * The SVG is drawn on a 32×16 viewBox to maintain crisp pixel-art proportions
 * at any rendered size. The main body uses white (`#ffffff`) and the
 * shadow/outline uses light blue (`#c0d8f8`) along the bottom and side edges,
 * matching the classic Super Mario Bros. cloud style.
 *
 * The `floatVariant` animation (Y: 0 → -6 → 0, 3s easeInOut, infinite) is
 * applied via a `motion.div` wrapper so the cloud gently bobs up and down.
 *
 * @param props.size  - Size variant: `"sm"` | `"md"` | `"lg"` (default: `"md"`)
 * @param props.style - Optional inline styles for positioning
 *
 * @satisfies Requirement 6.4  — Cloud renders pixel-art shape with float animation
 * @satisfies Requirement 17.1 — Loaded via next/dynamic with ssr:false
 */
export function CloudComponent({ size = "md", style }: CloudProps) {
  const { width, height } = sizeMap[size];

  return (
    <motion.div
      variants={floatVariant}
      initial="initial"
      animate="animate"
      style={{ display: "inline-flex", width, height, ...style }}
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 32 16"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Cloud"
        role="img"
      >
        {/* Cloud body — white */}
        <rect x="4" y="8" width="24" height="8" fill="#ffffff" />
        <rect x="8" y="4" width="16" height="4" fill="#ffffff" />
        <rect x="12" y="0" width="8" height="4" fill="#ffffff" />
        {/* Shadow/outline pixels — light blue */}
        <rect x="4" y="14" width="24" height="2" fill="#c0d8f8" />
        <rect x="2" y="8" width="2" height="6" fill="#c0d8f8" />
        <rect x="28" y="8" width="2" height="6" fill="#c0d8f8" />
      </svg>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Default export — dynamic import wrapper (no SSR)
// ---------------------------------------------------------------------------

/**
 * Dynamically imported Cloud component with `{ ssr: false }`.
 *
 * Use this default export in all consuming components to enable code splitting
 * and avoid SSR hydration issues with Framer Motion animations.
 *
 * @satisfies Requirement 17.1 — Game_Elements use next/dynamic with ssr:false
 */
const Cloud = dynamic(
  () => import("./cloud").then((mod) => ({ default: mod.CloudComponent })),
  { ssr: false }
);

export default Cloud;
