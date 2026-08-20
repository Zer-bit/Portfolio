"use client";

import type React from "react";
import dynamic from "next/dynamic";
import { dayTheme } from "../../lib/theme";
import Coin from "./coin";

// Props
interface HUDProps {
  // Current score value. Displayed as a zero-padded 6-digit number. Defaults to 0.
  score?: number;
  // Number of coins collected. Displayed next to the coin icon. Defaults to 0.
  coins?: number;
  // World label string shown in the WORLD section. Defaults to "PORTFOLIO-1".
  worldLabel?: string;
}

// Implementation
// HUDComponent — pixel-art styled HUD bar with score, coin counter, and world labe...
export const HUDComponent: React.FC<HUDProps> = ({
  score = 0,
  coins = 0,
  worldLabel = "PORTFOLIO-1",
}) => {
  return (
    <div
      style={{
        background: "#000",
        padding: "8px 16px",
        display: "flex",
        gap: "32px",
        alignItems: "flex-start",
        height: "48px",          // fixed height so navbar and main can offset reliably
        boxSizing: "border-box",
      }}
      role="status"
      aria-label="Game HUD"
    >
      {/* Score section */}
      <div>
        <span
          className="pixel-text"
          style={{ color: dayTheme.colors.text, fontSize: "10px" }}
        >
          SCORE
        </span>
        <br />
        <span
          className="pixel-text"
          style={{ color: dayTheme.colors.text, fontSize: "12px" }}
        >
          {String(score).padStart(6, "0")}
        </span>
      </div>

      {/* Coin counter section */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <Coin size={16} />
        <span
          className="pixel-text"
          style={{ color: dayTheme.colors.coin, fontSize: "12px" }}
        >
          ×{coins}
        </span>
      </div>

      {/* World label section */}
      <div>
        <span
          className="pixel-text"
          style={{ color: dayTheme.colors.text, fontSize: "10px" }}
        >
          WORLD
        </span>
        <br />
        <span
          className="pixel-text"
          style={{ color: dayTheme.colors.text, fontSize: "12px" }}
        >
          {worldLabel}
        </span>
      </div>
    </div>
  );
};

// Default export — dynamic import wrapper (no SSR)

const HUD = dynamic(
  () => import("./hud").then((mod) => ({ default: mod.HUDComponent })),
  { ssr: false }
);

export default HUD;
