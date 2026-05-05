"use client";

/**
 * @file ThemedGameLayout.tsx — Theme-aware GameLayout wrapper
 *
 * A thin client component that reads the active theme from `ThemeContext`
 * and passes it as the `theme` prop to `GameLayout`. This keeps `app/layout.tsx`
 * as a server component while still allowing the theme to be toggled at runtime
 * from the Settings page.
 *
 * @satisfies Requirement 16.2 — Theme toggle updates the `theme` prop passed to GameLayout
 */

import React from "react";
import GameLayout from "./game-layout";
import { useThemeContext } from "../../lib/theme-context";

interface ThemedGameLayoutProps {
  children: React.ReactNode;
}

/**
 * ThemedGameLayout — reads `theme` from `ThemeContext` and forwards it to
 * `GameLayout` so the entire app re-renders with the correct palette when
 * the user toggles the theme on the Settings page.
 */
export default function ThemedGameLayout({ children }: ThemedGameLayoutProps) {
  const { theme } = useThemeContext();

  return <GameLayout theme={theme}>{children}</GameLayout>;
}
