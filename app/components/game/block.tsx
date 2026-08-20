"use client";

import { useState } from "react";
import type React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { bounceVariant } from "../../lib/animations";

// Props
interface BlockProps {
  // Visual style of the block. `"question"` is interactive; `"brick"` is static.
  variant: "question" | "brick";
  // Width and height of the block in pixels. Defaults to 32.
  size?: number;
}

// SVG Renderers
// Renders the pixel-art SVG for the question-mark (`?`) block variant.
function QuestionBlockSVG({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Question block"
      role="img"
      style={{ imageRendering: "pixelated" }}
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

// Renders the pixel-art SVG for the brick block variant.
function BrickBlockSVG({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Brick block"
      role="img"
      style={{ imageRendering: "pixelated" }}
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

// Implementation
// BlockComponent — pixel-art SVG block with optional bounce animation.
export const BlockComponent: React.FC<BlockProps> = ({ variant, size = 32 }) => {
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
};

const Block = dynamic(
  () => import("./block").then((mod) => ({ default: mod.BlockComponent })),
  { ssr: false }
);

export default Block;
