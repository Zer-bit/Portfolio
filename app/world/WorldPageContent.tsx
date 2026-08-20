"use client";

import GameMap from "../components/game/GameMap";
import { NAV_LINKS, ROUTES } from "../lib/constants";
import { useProgressTracker } from "../lib/progress-tracker";

const WORLD_ROUTES = [
  ...NAV_LINKS,
  { name: "Gallery", href: ROUTES.gallery, id: "gallery" },
] as const;

export default function WorldPageContent() {
  const { visitedRoutes } = useProgressTracker();

  return (
    <main>
      <GameMap routes={WORLD_ROUTES} visitedRoutes={visitedRoutes} />
    </main>
  );
}
