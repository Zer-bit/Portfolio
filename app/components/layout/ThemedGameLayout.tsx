"use client";

import React from "react";
import GameLayout from "./game-layout";
import { useThemeContext } from "../../lib/theme-context";

interface ThemedGameLayoutProps {
  children: React.ReactNode;
}

// ThemedGameLayout — reads `theme` from `ThemeContext` and forwards it to `GameLay...
export default function ThemedGameLayout({ children }: ThemedGameLayoutProps) {
  const { theme } = useThemeContext();

  return <GameLayout theme={theme}>{children}</GameLayout>;
}
