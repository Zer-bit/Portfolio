/**
 * @file GameMap.tsx — GameMap Game Component
 *
 * Renders the Mario-themed world map navigation hub for the portfolio site.
 * Displays each portfolio section as a clickable LevelNode styled with
 * existing `PixelCard` and `PixelButton` components. Supports responsive
 * layout (single column on mobile, grid on desktop) and optional visual
 * distinction for visited routes via the `visitedRoutes` prop.
 *
 * This file exports two things:
 * - `GameMapComponent` — the actual React implementation (named export)
 * - `default` — a `next/dynamic` wrapped version with `{ ssr: false }` for
 *   code splitting and to avoid SSR issues with Framer Motion animations.
 *
 * @example
 * ```tsx
 * import GameMap from "@/components/game/GameMap";
 * <GameMap routes={NAV_LINKS} visitedRoutes={["/about", "/skills"]} />
 * ```
 */

"use client";

import type React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { dayTheme } from "../../lib/theme";
import { fadeUpVariant } from "../../lib/animations";
import { PixelCard } from "../ui/pixel-card";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * A single route entry — matches the shape of items in `NAV_LINKS` from
 * `app/lib/constants.ts`.
 */
export interface RouteEntry {
  /** Display name for the level node (e.g. "About", "Projects"). */
  name: string;
  /** URL path for the route (e.g. "/about", "/projects"). */
  href: string;
  /** Unique identifier for the route (e.g. "about", "projects"). */
  id: string;
}

/**
 * Props for the GameMap component.
 */
export interface GameMapProps {
  /**
   * Array of route entries to render as LevelNodes.
   * Pass `NAV_LINKS` (excluding "World") or a filtered subset.
   */
  routes: readonly RouteEntry[];
  /**
   * Optional array of route `href` strings that have already been visited.
   * Visited nodes are visually marked as "completed" using `dayTheme.colors.coin`.
   * Unvisited nodes use `dayTheme.colors.text`.
   * Supports Requirement 15.3 (ProgressTracker integration).
   */
  visitedRoutes?: string[];
}

// ---------------------------------------------------------------------------
// Level number map — maps route id to a world-style level label
// ---------------------------------------------------------------------------

/**
 * Maps each route id to a Mario-style level label displayed inside the node.
 * Keeps the world-map aesthetic without hardcoding strings in JSX.
 */
const LEVEL_LABELS: Record<string, string> = {
  about:      "WORLD 1-1",
  projects:   "WORLD 1-2",
  skills:     "WORLD 1-3",
  experience: "WORLD 1-4",
  contact:    "WORLD 1-5",
  game:       "WORLD 1-6",
};

// ---------------------------------------------------------------------------
// Implementation
// ---------------------------------------------------------------------------

/**
 * GameMapComponent — Mario-themed world map with clickable LevelNodes.
 *
 * Layout:
 * - Single column on mobile (< 768px) via CSS media query
 * - 2–3 column grid on desktop (≥ 768px)
 *
 * Each LevelNode is a `PixelCard` wrapped in a Next.js `<Link>` so keyboard
 * navigation (Tab → Enter) works natively. An `aria-label` on the link
 * describes the destination for screen readers.
 *
 * Visited routes (from `visitedRoutes` prop) are highlighted with
 * `dayTheme.colors.coin`; unvisited routes use `dayTheme.colors.text`.
 *
 * @param props - {@link GameMapProps}
 */
export const GameMapComponent: React.FC<GameMapProps> = ({
  routes,
  visitedRoutes = [],
}) => {
  return (
    <section
      aria-label="World Map — choose a level"
      style={{
        padding: "40px 24px 80px",
        maxWidth: "1000px",
        margin: "0 auto",
        minHeight: "calc(100vh - 56px)", // fill viewport below navbar
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/* Section heading */}
      <motion.h2
        className="pixel-text"
        variants={fadeUpVariant}
        initial="hidden"
        animate="visible"
        style={{
          color: dayTheme.colors.coin,
          fontSize: "clamp(12px, 2.5vw, 20px)",
          textAlign: "center",
          marginBottom: "40px",
        }}
      >
        SELECT A WORLD
      </motion.h2>

      {/*
       * Responsive grid container.
       * CSS custom property approach keeps this inline-style only — no new
       * CSS classes introduced (Requirement 4.4 / 19.5).
       *
       * Mobile  (< 768px): 1 column
       * Desktop (≥ 768px): repeat(auto-fill, minmax(260px, 1fr))
       */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(260px, 100%), 1fr))",
          gap: "24px",
        }}
      >
        {routes.map((route, index) => {
          const isVisited = visitedRoutes.includes(route.href);
          const levelLabel = LEVEL_LABELS[route.id] ?? `WORLD ${index + 1}`;

          return (
            <motion.div
              key={route.id}
              variants={fadeUpVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              // Stagger each node slightly for a cascade entrance effect
              transition={{ delay: index * 0.08 }}
            >
              {/*
               * Next.js <Link> wraps the entire card so the whole surface is
               * keyboard-focusable and navigable. The aria-label describes the
               * destination clearly for screen readers (Requirement 18.2).
               */}
              <Link
                href={route.href}
                aria-label={`Navigate to ${route.name} — ${levelLabel}`}
                style={{ display: "block", textDecoration: "none" }}
              >
                <PixelCard
                  variant="elevated"
                  style={{
                    padding: "24px 20px",
                    cursor: "pointer",
                    textAlign: "center",
                    // Coin-gold border for visited nodes, default border otherwise
                    borderColor: isVisited
                      ? dayTheme.colors.coin
                      : dayTheme.colors.border,
                  }}
                >
                  {/* Level label (e.g. "WORLD 1-1") */}
                  <span
                    className="pixel-text"
                    style={{
                      display: "block",
                      color: isVisited
                        ? dayTheme.colors.coin
                        : dayTheme.colors.text,
                      fontSize: "9px",
                      letterSpacing: "0.15em",
                      marginBottom: "12px",
                      opacity: 0.85,
                    }}
                  >
                    {levelLabel}
                  </span>

                  {/* Route name (e.g. "ABOUT") */}
                  <span
                    className="pixel-text"
                    style={{
                      display: "block",
                      color: isVisited
                        ? dayTheme.colors.coin
                        : dayTheme.colors.text,
                      fontSize: "clamp(11px, 2vw, 16px)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {route.name.toUpperCase()}
                  </span>

                  {/* Completed badge — only shown for visited routes */}
                  {isVisited && (
                    <span
                      className="pixel-text"
                      style={{
                        display: "inline-block",
                        marginTop: "10px",
                        color: dayTheme.colors.coin,
                        fontSize: "7px",
                        letterSpacing: "0.12em",
                        opacity: 0.8,
                      }}
                      aria-label="Level completed"
                    >
                      ★ CLEAR
                    </span>
                  )}
                </PixelCard>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------
// Default export — dynamic import wrapper (no SSR)
// ---------------------------------------------------------------------------

/**
 * Dynamically imported GameMap component with `{ ssr: false }`.
 *
 * Use this default export in all consuming components to enable code splitting
 * and avoid SSR hydration issues with Framer Motion animations.
 *
 * @satisfies Requirement 14.1 — Game components use next/dynamic with ssr:false
 */
const GameMap = dynamic(
  () =>
    import("./GameMap").then((mod) => ({
      default: mod.GameMapComponent,
    })),
  { ssr: false }
);

export default GameMap;
