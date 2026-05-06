/**
 * @file PlayerHUD.tsx — Persistent Player HUD Component
 *
 * Renders the persistent HUD-style header across all pages by wrapping the
 * existing `HUD` component. Reads the current pathname via `usePathname()` and
 * maps it to a world label string (e.g., `/` → "WORLD-1", `/world` → "WORLD-2").
 *
 * This file exports two things:
 * - `PlayerHUDComponent` — the actual React implementation (named export)
 * - `default` — a `next/dynamic` wrapped version with `{ ssr: false }` for
 *   code splitting and to avoid SSR issues with Framer Motion animations.
 *
 * @example
 * ```tsx
 * import PlayerHUD from "@/components/game/PlayerHUD";
 * <PlayerHUD coins={3} />
 * ```
 */

"use client";

import type React from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { HUDComponent } from "./hud";
import { zIndex } from "../../lib/theme";
import { ROUTES } from "../../lib/constants";

// ---------------------------------------------------------------------------
// Route → World Label mapping
// ---------------------------------------------------------------------------

/**
 * Maps a pathname to a world label string for display in the HUD.
 * Falls back to "WORLD-?" for any unrecognized route.
 */
const WORLD_LABEL_MAP: Record<string, string> = {
  [ROUTES.home]: "WORLD-1",
  [ROUTES.world]: "WORLD-2",
  [ROUTES.about]: "WORLD-3",
  [ROUTES.projects]: "WORLD-4",
  [ROUTES.skills]: "WORLD-5",
  [ROUTES.experience]: "WORLD-6",
  [ROUTES.contact]: "WORLD-7",
  [ROUTES.settings]: "WORLD-8",
  [ROUTES.game]: "WORLD-9",
};

/**
 * Derives the world label string from a pathname.
 * Strips trailing slashes before lookup (except for root `/`).
 *
 * @param pathname - The current URL pathname from `usePathname()`
 * @returns A world label string such as "WORLD-1" or "WORLD-?"
 */
function getWorldLabel(pathname: string): string {
  // Normalize: strip trailing slash unless it's the root
  const normalized =
    pathname !== "/" && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;

  // For dynamic sub-routes like /projects/[slug], map to the parent route label
  const parentPath = "/" + normalized.split("/")[1];
  return (
    WORLD_LABEL_MAP[normalized] ??
    WORLD_LABEL_MAP[parentPath] ??
    "WORLD-?"
  );
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface PlayerHUDProps {
  /**
   * Optional coin count — used by the ProgressTracker feature to display
   * the number of visited pages as the coin counter.
   * Defaults to 0.
   */
  coins?: number;
}

// ---------------------------------------------------------------------------
// Implementation
// ---------------------------------------------------------------------------

/**
 * PlayerHUDComponent — persistent HUD header that maps the current route to a
 * world label and renders it via the existing `HUD` component.
 *
 * Positioned with `zIndex.hud` (40) so it floats above all page content.
 *
 * @param props.coins - Optional visited-page count for the ProgressTracker feature
 */
export const PlayerHUDComponent: React.FC<PlayerHUDProps> = ({ coins = 0 }) => {
  const pathname = usePathname();
  const worldLabel = getWorldLabel(pathname);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: zIndex.hud,
      }}
      aria-label="Player HUD"
    >
      <HUDComponent worldLabel={worldLabel} coins={coins} />
    </div>
  );
};

// ---------------------------------------------------------------------------
// Default export — dynamic import wrapper (no SSR)
// ---------------------------------------------------------------------------

/**
 * Dynamically imported PlayerHUD component with `{ ssr: false }`.
 *
 * Use this default export in all consuming components to enable code splitting
 * and avoid SSR hydration issues with Framer Motion animations (via the
 * embedded HUD → Coin component).
 *
 * @satisfies Requirement 14.1 — Game components use next/dynamic with ssr:false
 */
const PlayerHUD = dynamic(
  () =>
    import("./PlayerHUD").then((mod) => ({ default: mod.PlayerHUDComponent })),
  { ssr: false }
);

export default PlayerHUD;
