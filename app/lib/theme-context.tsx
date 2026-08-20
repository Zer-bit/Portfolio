"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// Constants
// localStorage key for persisting the active theme.
const THEME_STORAGE_KEY = "portfolio_theme";

// localStorage key for persisting the sound-enabled preference.
const SOUND_STORAGE_KEY = "portfolio_sound_enabled";

// Types
// Shape of the value provided by `ThemeContext`.
export interface ThemeContextType {
  // The currently active theme: `"day"` or `"night"`.
  theme: "day" | "night";
  // Toggles between `"day"` and `"night"` themes.
  toggleTheme: () => void;
  // Whether sound effects are currently enabled.
  soundEnabled: boolean;
  // Toggles sound effects on or off.
  toggleSound: () => void;
}

// Context
// Context that exposes theme and sound state with their mutators.
const ThemeContext = createContext<ThemeContextType>({
  theme: "day",
  toggleTheme: () => undefined,
  soundEnabled: true,
  toggleSound: () => undefined,
});

// Provider
// ThemeProvider — wraps the application and manages theme + sound state backed by...
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"day" | "night">("day");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // -------------------------------------------------------------------------
  // Hydrate from localStorage on mount (client-only)
  // -------------------------------------------------------------------------
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (storedTheme === "day" || storedTheme === "night") {
        setTheme(storedTheme);
      }

      const storedSound = localStorage.getItem(SOUND_STORAGE_KEY);
      if (storedSound !== null) {
        setSoundEnabled(storedSound !== "false");
      }
    } catch {
      // localStorage unavailable — use defaults
    }
  }, []);

  // -------------------------------------------------------------------------
  // toggleTheme — switches between "day" and "night"
  // -------------------------------------------------------------------------
  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "day" ? "night" : "day";
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // localStorage write failed — state still updated in memory
      }
      return next;
    });
  }, []);

  // -------------------------------------------------------------------------
  // toggleSound — enables or disables sound effects
  // -------------------------------------------------------------------------
  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SOUND_STORAGE_KEY, String(next));
      } catch {
        // localStorage write failed — state still updated in memory
      }
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, soundEnabled, toggleSound }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook

export function useThemeContext(): ThemeContextType {
  return useContext(ThemeContext);
}
