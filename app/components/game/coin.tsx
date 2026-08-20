"use client";

import type React from "react";
import dynamic from "next/dynamic";

// Props
interface CoinProps {
  // Width and height of the coin in pixels. Defaults to 24.
  size?: number;
}

// Implementation
// CoinComponent — pixel-art SVG coin with continuous spin animation.
export const CoinComponent: React.FC<CoinProps> = ({ size = 24 }) => {
  return (
    <div
      className="animate-pixel-spin"
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
    </div>
  );
};

// Default export — dynamic import wrapper (no SSR)

const Coin = dynamic(
  () => import("./coin").then((mod) => ({ default: mod.CoinComponent })),
  { ssr: false }
);

export default Coin;
