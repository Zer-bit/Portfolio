/**
 * @file block.tsx — Block Game Component
 *
 * Renders a pixel-art SVG block in one of two variants:
 * - `"question"` — orange/brown block with a `?` character and 3D pixel edges.
 *   Clicking it triggers a `bounceVariant` animation via local state.
 * - `"brick"` — static brick pattern block with darker mortar lines.
 *
 * This file exports two things:
 * - `BlockComponent` — the actual React implementation (named export)
 * - `default` — a `next/dynamic` wrapped version with `{ ssr: false }` for
 *   code splitting and to avoid SSR issues with Framer Motion animations.
 *
 * @example
 * ```tsx
 * import Block from "@/components/game/block";
 * <Block variant="question" size={32} />
 * <Block variant="brick" size={32} />
 * ```
 */

"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { bounceVariant } from "../../lib/animations";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface BlockProps {
  /** Visual style of the block. `"question"` is interactive; `"brick"` is static. */
  variant: "question" | "brick";
  /** Width and height of the block in pixels. Defaults to 32. */
  size?: number;
}

// ---------------------------------------------------------------------------
// SVG Renderers
// ---------------------------------------------------------------------------

/**
 * Renders the pixel-art SVG for the question-mark (`?`) block variant.
 *
 * Uses `dayTheme.colors.brick` (`#d07030`) as the main body color, with a
 * lighter top/left edge (`#e8904a`) and a darker bottom/right edge (`#a05020`)
 * to simulate a 3D pixel-art effect.
 */
function QuestionBlockSVG({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Question block"
      role="img"
    >
      {/* Main body */}
      <rect width="16" height="16" fill="#d07030" />
      {/* Top/left highlight */}
      <rect x="0" y="0" width="16" height="2" fill="#e8904a" />
      <rect x="0" y="0" width="2" height="16" fill="#e8904a" />
      {/* Bottom/right shadow */}
      <rect x="0" y="14" width="16" height="2" fill="#a05020" />
      <rect x="14" y="0" width="2" height="16" fill="#a05020" />
      {/* ? character */}
      <text
        x="8"
        y="12"
        textAnchor="middle"
        fill="white"
        fontSize="10"
        fontWeight="bold"
        fontFamily="monospace"
      >
        ?
      </text>
    </svg>
  );
}

/**
 * Renders the pixel-art SVG for the brick block variant.
 *
 * Uses `dayTheme.colors.brick` (`#d07030`) as the main body color with
 * darker mortar lines (`#a05020`) forming the classic brick pattern.
 */
function BrickBlockSVG({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Brick block"
      role="img"
    >
      {/* Main body */}
      <rect width="16" height="16" fill="#d07030" />
      {/* Mortar lines */}
      <rect x="0" y="7" width="16" height="2" fill="#a05020" />
      <rect x="7" y="0" width="2" height="7" fill="#a05020" />
      <rect x="3" y="9" width="2" height="7" fill="#a05020" />
      <rect x="11" y="9" width="2" height="7" fill="#a05020" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Implementation
// ---------------------------------------------------------------------------

/**
 * BlockComponent — pixel-art SVG block with optional bounce animation.
 *
 * The `"question"` variant is interactive: clicking it triggers a
 * `bounceVariant` animation (Y: 0 → -8 → 0, spring easing) via local state.
 * The `"brick"` variant is purely decorative and does not respond to clicks.
 *
 * @param props.variant - `"question"` for the `?` block, `"brick"` for the brick block
 * @param props.size    - Rendered width/height in pixels (default: 32)
 */
export function BlockComponent({ variant, size = 32 }: BlockProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (variant === "question") {
      setIsAnimating(true);
    }
  };

  const handleAnimationComplete = () => {
    if (isAnimating) {
      setIsAnimating(false);
    }
  };

  return (
    <motion.div
      variants={bounceVariant}
      initial="initial"
      animate={isAnimating ? "animate" : "initial"}
      onAnimationComplete={handleAnimationComplete}
      onClick={handleClick}
      style={{
        display: "inline-flex",
        width: size,
        height: size,
        cursor: variant === "question" ? "pointer" : "default",
      }}
    >
      {variant === "question" ? (
        <QuestionBlockSVG size={size} />
      ) : (
        <BrickBlockSVG size={size} />
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Default export — dynamic import wrapper (no SSR)
// ---------------------------------------------------------------------------

/**
 * Dynamically imported Block component with `{ ssr: false }`.
 *
 * Use this default export in all consuming components to enable code splitting
 * and avoid SSR hydration issues with Framer Motion animations.
 *
 * @satisfies Requirement 17.1 — Game_Elements use next/dynamic with ssr:false
 */
const Block = dynamic(
  () => import("./block").then((mod) => ({ default: mod.BlockComponent })),
  { ssr: false }
);

export default Block;
