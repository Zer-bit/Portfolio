"use client";

import type React from "react";
import dynamic from "next/dynamic";

// Props
interface CloudProps {
  // Size variant controlling the rendered width and height of the cloud.
  size?: "sm" | "md" | "lg";
  // Optional inline styles for positioning the cloud (e.g. `position`, `top`, `left`).
  style?: React.CSSProperties;
}

// Size Map
// Maps each size variant to its rendered width and height in pixels.
const sizeMap: Record<NonNullable<CloudProps["size"]>, { width: number; height: number }> = {
  sm: { width: 64, height: 32 },
  md: { width: 96, height: 48 },
  lg: { width: 128, height: 64 },
};

// Implementation
// CloudComponent — pixel-art SVG cloud with continuous float animation.
export const CloudComponent: React.FC<CloudProps> = ({ size = "md", style }) => {
  const { width, height } = sizeMap[size];

  return (
    <div
      className="animate-pixel-float"
      style={{ display: "inline-flex", width, height, ...style }}
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 32 16"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Cloud"
        role="img"
        style={{ imageRendering: "pixelated" }}
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
    </div>
  );
};

// Default export — dynamic import wrapper (no SSR)

const Cloud = dynamic(
  () => import("./cloud").then((mod) => ({ default: mod.CloudComponent })),
  { ssr: false }
);

export default Cloud;
