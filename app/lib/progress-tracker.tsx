"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// Constants
// localStorage key used to persist the visited-routes array.
const STORAGE_KEY = "portfolio_visited_routes";

// Types
// Shape of the value provided by `ProgressTrackerContext`.
export interface ProgressTrackerContextType {
  // Array of route `href` strings the visitor has navigated to. e.g. `["/about", "/projects"]`
  visitedRoutes: string[];
  // Records a route as visited. Idempotent — calling with an already-visited route is a no-op.
  markVisited: (route: string) => void;
}

// Context
// Context that exposes visited routes and the `markVisited` mutator.
const ProgressTrackerContext = createContext<ProgressTrackerContextType>({
  visitedRoutes: [],
  markVisited: () => undefined,
});

// Provider
// ProgressTrackerProvider — wraps the application and manages the visited-routes s...
export function ProgressTrackerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [visitedRoutes, setVisitedRoutes] = useState<string[]>([]);

  // -------------------------------------------------------------------------
  // Hydrate from localStorage on mount (client-only)
  // -------------------------------------------------------------------------
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Filter to only string values for safety
          setVisitedRoutes(parsed.filter((v): v is string => typeof v === "string"));
        }
      }
    } catch {
      // localStorage unavailable or JSON parse error — start with empty state
    }
  }, []);

  // -------------------------------------------------------------------------
  // markVisited — idempotent route recorder
  // -------------------------------------------------------------------------
  const markVisited = useCallback((route: string) => {
    setVisitedRoutes((prev) => {
      if (prev.includes(route)) return prev; // already recorded — no-op
      const next = [...prev, route];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // localStorage write failed — state still updated in memory
      }
      return next;
    });
  }, []);

  return (
    <ProgressTrackerContext.Provider value={{ visitedRoutes, markVisited }}>
      {children}
    </ProgressTrackerContext.Provider>
  );
}

// Hook

export function useProgressTracker(): ProgressTrackerContextType {
  return useContext(ProgressTrackerContext);
}
