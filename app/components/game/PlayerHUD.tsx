"use client";

import type React from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { HUDComponent } from "./hud";
import { zIndex } from "../../lib/theme";
import { ROUTES } from "../../lib/constants";

// Route → World Label mapping
// Maps a pathname to a world label string for display in the HUD.
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

// Derives the world label string from a pathname.
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

// Props
interface PlayerHUDProps {
  // Optional coin count — used by the ProgressTracker feature to display the number...
  coins?: number;
}

// Implementation
// PlayerHUDComponent — persistent HUD header that maps the current route to a worl...
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

// Default export — dynamic import wrapper (no SSR)

const PlayerHUD = dynamic(
  () =>
    import("./PlayerHUD").then((mod) => ({ default: mod.PlayerHUDComponent })),
  { ssr: false }
);

export default PlayerHUD;
