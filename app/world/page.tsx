import type { Metadata } from "next";
import GameMap from "../components/game/GameMap";
import { NAV_LINKS } from "../lib/constants";

export const metadata: Metadata = {
  title: "Jezer Parales | World Map",
  description: "Choose a world to explore in Jezer Parales' Mario-themed portfolio.",
};

export default function WorldPage() {
  return (
    <main>
      <GameMap routes={NAV_LINKS} />
    </main>
  );
}
