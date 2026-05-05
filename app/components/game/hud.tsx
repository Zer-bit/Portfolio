/**
 * @file hud.tsx — HUD Game Component
 *
 * Renders a pixel-art styled Heads-Up Display bar inspired by the classic
 * Super Mario Bros. HUD. Displays a score counter, coin counter (with the
 * animated Coin component), and a world label.
 *
 * This file exports two things:
 * - `HUDComponent` — the actual React implementation (named export)
 * - `default` — a `next/dynamic` wrapped version with `{ ssr: false }` for
 *   code splitting and to avoid SSR issues with Framer Motion animations.
 *
 * @example
 * ```tsx
 * import HUD from "@/components/game/hud";
 * <HUD score={1200} coins={5} worldLabel="PORTFOLIO-1" />
 * ```
 */

"use client";

import dynamic from "next/dynamic";
import { dayTheme } from "../../lib/theme";
import Coin from "./coin";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface HUDProps {
  /** Current score value. Displayed as a zero-padded 6-digit number. Defaults to 0. */
  score?: number;
  /** Number of coins collected. Displayed next to the coin icon. Defaults to 0. */
  coins?: number;
  /** World label string shown in the WORLD section. Defaults to "PORTFOLIO-1". */
  worldLabel?: string;
}

// ---------------------------------------------------------------------------
// Implementation
// ---------------------------------------------------------------------------

/**
 * HUDComponent — pixel-art styled HUD bar with score, coin counter, and world label.
 *
 * Layout mirrors the classic Super Mario Bros. HUD with three sections
 * displayed side by side:
 * - SCORE: zero-padded 6-digit counter
 * - COIN: animated coin icon + count prefixed with ×
 * - WORLD: world label string
 *
 * All text uses the `.pixel-text` CSS class. Coin count uses the theme coin
 * gold color (`dayTheme.colors.coin`) and other text uses white
 * (`dayTheme.colors.text`).
 *
 * @param props.score      - Score value (default: 0)
 * @param props.coins      - Coin count (default: 0)
 * @param props.worldLabel - World label string (default: "PORTFOLIO-1")
 */
export function HUDComponent({
  score = 0,
  coins = 0,
  worldLabel = "PORTFOLIO-1",
}: HUDProps) {
  return (
    <div
      style={{
        background: "#000",
        padding: "8px 16px",
        display: "flex",
        gap: "32px",
        alignItems: "flex-start",
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
}

// ---------------------------------------------------------------------------
// Default export — dynamic import wrapper (no SSR)
// ---------------------------------------------------------------------------

/**
 * Dynamically imported HUD component with `{ ssr: false }`.
 *
 * Use this default export in all consuming components to enable code splitting
 * and avoid SSR hydration issues with Framer Motion animations (via the
 * embedded Coin component).
 *
 * @satisfies Requirement 17.1 — Game_Elements use next/dynamic with ssr:false
 */
const HUD = dynamic(
  () => import("./hud").then((mod) => ({ default: mod.HUDComponent })),
  { ssr: false }
);

export default HUD;
