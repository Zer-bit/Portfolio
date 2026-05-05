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

  return (
    <main>
      <GameMap routes={NAV_LINKS} visitedRoutes={visitedRoutes} />
    </main>
  );
}
