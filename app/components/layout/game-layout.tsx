/**
 * @file game-layout.tsx — GameLayout Root Layout Wrapper
 *
 * The root layout component that manages the Mario-themed background,
 * parallax layers, and theme context for the entire portfolio site.
 *
 * Renders three parallax background layers (sky, clouds, ground) using
 * Framer Motion `useScroll` + `useTransform`, applies the active theme's
 * CSS custom properties to the root element, and wraps all page content
 * (including `<Navbar>`, `<ScrollProgress>`, `<Footer>`, and `children`)
 * within the `GameLayoutContext`.
 *
 * @example
 * ```tsx
 * import { GameLayout } from "@/components/layout/game-layout";
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <GameLayout theme="day">{children}</GameLayout>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 *
 * @module game-layout
 */

"use client";

import React, { createContext, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { dayTheme, nightTheme, zIndex } from "../../lib/theme";
import Navbar from "../layout/navbar";
import ScrollProgress from "../ui/scroll-progress";
import Footer from "../layout/footer";
import { Cloud, Block } from "../game/index";
import PlayerHUD from "../game/PlayerHUD";
import { useProgressTracker } from "../../lib/progress-tracker";
import { usePathname } from "next/navigation";

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

/**
 * Shape of the value provided by `GameLayoutContext`.
 *
 * Consumers can read the active theme name and the current vertical scroll
 * position (in pixels) to drive theme-aware or scroll-aware behavior.
 *
 * @example
 * ```tsx
 * const { theme, scrollY } = useContext(GameLayoutContext);
 * ```
 */
export interface GameLayoutContextType {
  /** The currently active theme: `"day"` or `"night"`. */
  theme: "day" | "night";
  /** Current vertical scroll position in pixels. */
  scrollY: number;
}

/**
 * Context that exposes the active theme and scroll position to any descendant
 * component. Defaults to `"day"` theme and `scrollY: 0`.
 *
 * @satisfies Requirement 20.3 — GameLayout exposes a context API for future components
 */
export const GameLayoutContext = createContext<GameLayoutContextType>({
  theme: "day",
  scrollY: 0,
});

// ---------------------------------------------------------------------------
// Number of clouds to render
// ---------------------------------------------------------------------------

/** Total cloud count on desktop. */
const CLOUD_COUNT_DESKTOP = 6;
/** Maximum cloud count on mobile (viewport < 768px). */
const CLOUD_COUNT_MOBILE = 3;

/**
 * Pre-computed cloud positions so they are stable across renders.
 * Each entry defines the horizontal offset (left %) and vertical offset (top %)
 * for a cloud within the cloud parallax layer.
 */
const CLOUD_POSITIONS: Array<{ left: string; top: string; size: "sm" | "md" | "lg" }> = [
  { left: "5%",  top: "10%", size: "lg" },
  { left: "25%", top: "5%",  size: "md" },
  { left: "50%", top: "15%", size: "sm" },
  { left: "68%", top: "8%",  size: "lg" },
  { left: "82%", top: "20%", size: "md" },
  { left: "92%", top: "5%",  size: "sm" },
];

/** Number of brick blocks to fill the ground strip. */
const BLOCK_COUNT = 40;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

/**
 * Props for the `GameLayout` component.
 */
export interface GameLayoutProps {
  /**
   * The active theme to apply. Defaults to `"day"`.
   * Switching to `"night"` applies the `nightTheme` palette across all
   * CSS custom properties without requiring individual component edits.
   */
  theme?: "day" | "night";
  /** Page content to render inside the themed layout. */
  children: React.ReactNode;
}

// ---------------------------------------------------------------------------
// RouteTracker — marks the current route as visited on every navigation
// ---------------------------------------------------------------------------

/**
 * RouteTracker — invisible component that calls `markVisited` whenever the
 * pathname changes. Placed inside `GameLayout` so it runs on every page
 * without modifying any existing component.
 *
 * @satisfies Requirement 15.1 — Records each visited route
 * @satisfies Requirement 15.2 — Persisted via ProgressTrackerProvider → localStorage
 * @satisfies Requirement 15.5 — Does not modify any existing component's state or props
 */
function RouteTracker() {
  const pathname = usePathname();
  const { markVisited } = useProgressTracker();

  useEffect(() => {
    markVisited(pathname);
  }, [pathname, markVisited]);

  return null;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * GameLayout — Mario-themed root layout wrapper.
 *
 * Responsibilities:
 * - Applies the active theme's color tokens as CSS custom properties on the
 *   root `div` so any descendant can reference `var(--theme-sky)` etc.
 * - Renders three parallax background layers (sky, clouds, ground) that scroll
 *   at different speeds using Framer Motion `useScroll` + `useTransform`.
 * - Applies `will-change: transform` to all parallax layer `div` elements to
 *   promote them to GPU compositing layers for smooth 60fps animation.
 * - Limits visible Cloud components to ≤3 on mobile (viewport < 768px).
 * - Wraps `<Navbar>`, `<ScrollProgress>`, `<Footer>`, and `children` within
 *   `GameLayoutContext` so descendants can read the active theme and scrollY.
 *
 * @param props.theme    - `"day"` | `"night"` (default: `"day"`)
 * @param props.children - Page content
 *
 * @satisfies Requirement 7.1  — Applies active theme as CSS custom properties
 * @satisfies Requirement 7.2  — Multi-layer parallax background
 * @satisfies Requirement 7.3  — Accepts `theme` prop
 * @satisfies Requirement 7.4  — Defaults to `"day"` theme
 * @satisfies Requirement 7.5  — Uses Framer Motion scroll hook for 60fps parallax
 * @satisfies Requirement 7.6  — Preserves Navbar, ScrollProgress, Footer
 * @satisfies Requirement 6.7  — Renders Cloud components in parallax background layer
 * @satisfies Requirement 6.8  — Limits clouds to ≤3 on mobile
 * @satisfies Requirement 17.4 — `will-change: transform` on parallax layers
 * @satisfies Requirement 20.3 — Exposes GameLayoutContext for future consumers
 */
export function GameLayout({ theme = "day", children }: GameLayoutProps) {
  // -------------------------------------------------------------------------
  // Theme resolution
  // -------------------------------------------------------------------------

  const activeTheme = theme === "night" ? nightTheme : dayTheme;

  // CSS custom properties derived from the active theme palette.
  const themeVars: React.CSSProperties = {
    // Color tokens
    ["--theme-sky" as string]:    activeTheme.colors.sky,
    ["--theme-ground" as string]: activeTheme.colors.ground,
    ["--theme-brick" as string]:  activeTheme.colors.brick,
    ["--theme-coin" as string]:   activeTheme.colors.coin,
    ["--theme-pipe" as string]:   activeTheme.colors.pipe,
    ["--theme-mario" as string]:  activeTheme.colors.mario,
    ["--theme-text" as string]:   activeTheme.colors.text,
    ["--theme-bg" as string]:     activeTheme.colors.bg,
    ["--theme-border" as string]: activeTheme.colors.border,
  };

  // -------------------------------------------------------------------------
  // Progress tracker — coin count for PlayerHUD
  // -------------------------------------------------------------------------

  const { visitedRoutes } = useProgressTracker();

  // -------------------------------------------------------------------------
  // Scroll tracking
  // -------------------------------------------------------------------------

  const { scrollY: motionScrollY } = useScroll();

  // Expose a plain number scrollY value via context.
  const [scrollYValue, setScrollYValue] = useState(0);
  useEffect(() => {
    return motionScrollY.on("change", (v) => setScrollYValue(v));
  }, [motionScrollY]);

  // -------------------------------------------------------------------------
  // Parallax transforms
  // -------------------------------------------------------------------------

  // Sky layer scrolls at 0.1× page scroll speed (farthest / slowest).
  const skyY = useTransform(motionScrollY, [0, 1000], [0, -100]);

  // Cloud layer scrolls at 0.3× page scroll speed (middle).
  const cloudY = useTransform(motionScrollY, [0, 1000], [0, -300]);

  // Ground layer scrolls at 1.0× page scroll speed (nearest / same as content).
  const groundY = useTransform(motionScrollY, [0, 1000], [0, -1000]);

  // -------------------------------------------------------------------------
  // Mobile cloud limiting
  // -------------------------------------------------------------------------

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const visibleCloudCount = isMobile ? CLOUD_COUNT_MOBILE : CLOUD_COUNT_DESKTOP;
  const visibleClouds = CLOUD_POSITIONS.slice(0, visibleCloudCount);

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <GameLayoutContext.Provider value={{ theme, scrollY: scrollYValue }}>
      {/* Route tracker — records current pathname in ProgressTracker */}
      <RouteTracker />
      {/* Root element — receives all theme CSS custom properties */}
      <div
        style={{
          ...themeVars,
          position: "relative",
          minHeight: "100vh",
          overflow: "hidden",
          backgroundColor: activeTheme.colors.sky,
        }}
      >
        {/* ------------------------------------------------------------------ */}
        {/* Sky parallax layer — z-index: background (0), scrolls at 0.1×      */}
        {/* ------------------------------------------------------------------ */}
        <motion.div
          aria-hidden="true"
          style={{
            y: skyY,
            willChange: "transform",
            position: "fixed",
            inset: 0,
            zIndex: zIndex.background,
            background: `linear-gradient(180deg, ${activeTheme.colors.sky} 0%, ${activeTheme.colors.bg} 100%)`,
            pointerEvents: "none",
          }}
        />

        {/* ------------------------------------------------------------------ */}
        {/* Cloud parallax layer — z-index: background (0), scrolls at 0.3×    */}
        {/* ------------------------------------------------------------------ */}
        <motion.div
          aria-hidden="true"
          style={{
            y: cloudY,
            willChange: "transform",
            position: "fixed",
            inset: 0,
            zIndex: zIndex.background,
            pointerEvents: "none",
          }}
        >
          {visibleClouds.map((cloud, i) => (
            <Cloud
              key={i}
              size={cloud.size}
              style={{
                position: "absolute",
                left: cloud.left,
                top: cloud.top,
              }}
            />
          ))}
        </motion.div>

        {/* ------------------------------------------------------------------ */}
        {/* Ground parallax layer — z-index: ground (10), scrolls at 1.0×      */}
        {/* ------------------------------------------------------------------ */}
        <motion.div
          aria-hidden="true"
          style={{
            y: groundY,
            willChange: "transform",
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: zIndex.ground,
            display: "flex",
            flexWrap: "nowrap",
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          {Array.from({ length: BLOCK_COUNT }).map((_, i) => (
            <Block key={i} variant="brick" size={32} />
          ))}
        </motion.div>

        {/* ------------------------------------------------------------------ */}
        {/* Persistent PlayerHUD — fixed overlay, zIndex.hud (40)              */}
        {/* ------------------------------------------------------------------ */}
        <PlayerHUD coins={visitedRoutes.length} />

        {/* ------------------------------------------------------------------ */}
        {/* Page content — sits above parallax layers                           */}
        {/* ------------------------------------------------------------------ */}
        <div
          style={{
            position: "relative",
            zIndex: zIndex.ui,
          }}
        >
          <ScrollProgress />
          <Navbar />
          {/* pt-32 (128px) clears the fixed PlayerHUD (~48px) + fixed Navbar (~72px) */}
          <main style={{ paddingTop: "128px" }}>{children}</main>
          <Footer />
        </div>
      </div>
    </GameLayoutContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Default export
// ---------------------------------------------------------------------------

export default GameLayout;
