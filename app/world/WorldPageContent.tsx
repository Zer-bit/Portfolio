"use client";

/**
 * @file WorldPageContent.tsx — Client wrapper for the World Map page.
 *
 * Reads `visitedRoutes` from the ProgressTracker context and passes them to
 * `GameMap` so visited LevelNodes are visually marked as completed.
 *
 * Kept as a separate client component so `app/world/page.tsx` can remain a
 * server component (for metadata export) while still consuming client-side
 * context.
 *
 * @satisfies Requirement 15.3 — GameMap visually marks visited LevelNodes
 */

import GameMap from "../components/game/GameMap";
import { NAV_LINKS } from "../lib/constants";
import { useProgressTracker } from "../lib/progress-tracker";

export default function WorldPageContent() {
  const { visitedRoutes } = useProgressTracker();

  // Don't show the "World" card on the world map itself — you're already here.
  const mapRoutes = NAV_LINKS.filter((r) => r.href !== "/world");

  // Exclude /world from the completed set (you're currently on it)
  const completedRoutes = visitedRoutes.filter((r) => r !== "/world");

  return (
    <main>
      <GameMap routes={mapRoutes} visitedRoutes={completedRoutes} />
    </main>
  );
}
