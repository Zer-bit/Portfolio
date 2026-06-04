"use client";

import dynamic from "next/dynamic";
import type { GameMapProps } from "./GameMapComponent";

export type { GameMapProps, RouteEntry } from "./GameMapComponent";
export { default as GameMapComponent } from "./GameMapComponent";

const GameMap = dynamic(
  () => import("./GameMapComponent").then((mod) => mod.default),
  { ssr: false }
);

export default GameMap;
