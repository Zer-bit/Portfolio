"use client";

import React, { createContext, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { dayTheme, nightTheme, zIndex } from "../../lib/theme";
import Navbar from "../layout/navbar";
import ScrollProgress from "../ui/scroll-progress";
import Footer from "../layout/footer";
import Cloud from "../game/cloud";
import { useProgressTracker } from "../../lib/progress-tracker";
import { usePathname } from "next/navigation";

// Context
// Shape of the value provided by `GameLayoutContext`.
export interface GameLayoutContextType {
  // The currently active theme: `"day"` or `"night"`.
  theme: "day" | "night";
  // Current vertical scroll position in pixels.
  scrollY: number;
}

export const GameLayoutContext = createContext<GameLayoutContextType>({
  theme: "day",
  scrollY: 0,
});

// Number of clouds to render
// Total cloud count on desktop.
const CLOUD_COUNT_DESKTOP = 6;
// Maximum cloud count on mobile (viewport < 768px).
const CLOUD_COUNT_MOBILE = 3;

// Pre-computed cloud positions so they are stable across renders.
const CLOUD_POSITIONS: Array<{ left: string; top: string; size: "sm" | "md" | "lg" }> = [
  { left: "5%",  top: "10%", size: "lg" },
  { left: "25%", top: "5%",  size: "md" },
  { left: "50%", top: "15%", size: "sm" },
  { left: "68%", top: "8%",  size: "lg" },
  { left: "82%", top: "20%", size: "md" },
  { left: "92%", top: "5%",  size: "sm" },
];

// Props
// Props for the `GameLayout` component.
export interface GameLayoutProps {
  // The active theme to apply.
  theme?: "day" | "night";
  // Page content to render inside the themed layout.
  children: React.ReactNode;
}

// RouteTracker — marks the current route as visited on every navigation

function RouteTracker() {
  const pathname = usePathname();
  const { markVisited } = useProgressTracker();

  useEffect(() => {
    markVisited(pathname);
  }, [pathname, markVisited]);

  return null;
}

// Component

export function GameLayout({ theme = "day", children }: GameLayoutProps) {
  // -------------------------------------------------------------------------
  // Theme resolution
  // -------------------------------------------------------------------------

  const activeTheme = theme === "night" ? nightTheme : dayTheme;
  const pathname = usePathname();
  const isLanding = pathname === "/";

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
          {/* h-14 = 56px — clears the single merged navbar. Landing page (/) has no navbar so no offset needed. */}
          <main style={{ paddingTop: isLanding ? "0" : "56px", minHeight: "100vh" }}>{children}</main>
          <Footer />
        </div>
      </div>
    </GameLayoutContext.Provider>
  );
}

// Default export
export default GameLayout;
