/**
 * @file progress-tracker.tsx — Progress Tracker Context
 *
 * Provides a React Context that records which routes the visitor has viewed,
 * persisting the list in `localStorage` so progress survives page refreshes.
 *
 * Exports:
 * - `ProgressTrackerProvider` — wraps the app and manages visited-route state
 * - `useProgressTracker`      — hook returning `{ visitedRoutes, markVisited }`
 *
 * Usage:
 * ```tsx
 * // In app/layout.tsx
 * <ProgressTrackerProvider>
 *   <GameLayout>{children}</GameLayout>
 * </ProgressTrackerProvider>
 *
 * // In any client component
 * const { visitedRoutes, markVisited } = useProgressTracker();
 * ```
 *
 * @satisfies Requirement 15.1 — Records visited routes in client-side state (React Context)
 * @satisfies Requirement 15.2 — Persists visited routes in localStorage
 * @satisfies Requirement 15.5 — Does NOT modify any existing component's internal state or props
 *
 * @module progress-tracker
 */

"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** localStorage key used to persist the visited-routes array. */
const STORAGE_KEY = "portfolio_visited_routes";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Shape of the value provided by `ProgressTrackerContext`.
 */
export interface ProgressTrackerContextType {
  /**
   * Array of route `href` strings the visitor has navigated to.
   * e.g. `["/about", "/projects"]`
   */
  visitedRoutes: string[];
  /**
   * Records a route as visited. Idempotent — calling with an already-visited
   * route is a no-op.
   *
   * @param route - The pathname to mark as visited (e.g. `"/about"`)
   */
  markVisited: (route: string) => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

/**
 * Context that exposes visited routes and the `markVisited` mutator.
 * Defaults to an empty array and a no-op function so consumers that render
 * outside the provider don't throw.
 */
const ProgressTrackerContext = createContext<ProgressTrackerContextType>({
  visitedRoutes: [],
  markVisited: () => undefined,
});

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

/**
 * ProgressTrackerProvider — wraps the application and manages the
 * visited-routes state backed by `localStorage`.
 *
 * Hydration strategy:
 * - On mount, reads the persisted array from `localStorage` (if any).
 * - On every `markVisited` call, updates both React state and `localStorage`.
 * - Uses a `try/catch` around all `localStorage` access so the app degrades
 *   gracefully in environments where storage is unavailable (e.g. private
 *   browsing with strict settings, SSR).
 *
 * @param props.children - Subtree to provide the context to
 */
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

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * useProgressTracker — consumes the ProgressTrackerContext.
 *
 * @returns `{ visitedRoutes, markVisited }`
 *
 * @example
 * ```tsx
 * const { visitedRoutes, markVisited } = useProgressTracker();
 *
 * // Mark the current page as visited on mount
 * useEffect(() => { markVisited(pathname); }, [pathname, markVisited]);
 *
 * // Check if a route has been visited
 * const isVisited = visitedRoutes.includes("/about");
 * ```
 *
 * @satisfies Requirement 15.1 — Provides visitedRoutes and markVisited
 */
export function useProgressTracker(): ProgressTrackerContextType {
  return useContext(ProgressTrackerContext);
}
