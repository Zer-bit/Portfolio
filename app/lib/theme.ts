/**
 * lib/theme.ts — Centralized Theme System
 *
 * Single source of truth for all visual tokens used across the Mario Pixel Portfolio.
 * Exports color palettes (day/night), pixel-grid spacing, and z-index layers.
 *
 * Usage:
 * ```ts
 * import { dayTheme, nightTheme, pixelGrid, zIndex } from "@/lib/theme";
 * ```
 *
 * @module theme
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Shape of a theme object. All consuming components should type their theme
 * prop or context value against this interface to ensure type-safe access to
 * every color token.
 *
 * @example
 * ```ts
 * function MyComponent({ theme }: { theme: ThemeType }) {
 *   return <div style={{ background: theme.colors.sky }} />;
 * }
 * ```
 */
export type ThemeType = {
  /** Human-readable identifier for the theme. */
  name: "day" | "night";
  colors: {
    /** Sky / hero background — Mario daytime sky blue. */
    sky: string;
    /** Ground / platform color — Mario dirt brown. */
    ground: string;
    /** Brick block color — Mario brick orange. */
    brick: string;
    /** Coin / accent color — Mario coin gold. */
    coin: string;
    /** Pipe / success color — Mario pipe green. */
    pipe: string;
    /** Mario / primary action color — Mario red. */
    mario: string;
    /** Primary text color. */
    text: string;
    /** Page / section background color. */
    bg: string;
    /** Border / outline color used for pixel-art borders. */
    border: string;
  };
};

// ---------------------------------------------------------------------------
// Day Theme
// ---------------------------------------------------------------------------

/**
 * Default daytime Mario color palette.
 *
 * Matches the classic Super Mario Bros. daytime world aesthetic with bright
 * sky blue, warm brick tones, and vivid accent colors.
 *
 * @example
 * ```ts
 * import { dayTheme } from "@/lib/theme";
 * const skyColor = dayTheme.colors.sky; // "#5c94fc"
 * ```
 */
export const dayTheme: ThemeType = {
  name: "day",
  colors: {
    sky: "#5c94fc",
    ground: "#c84b0c",
    brick: "#d07030",
    coin: "#f8b800",
    pipe: "#00a800",
    mario: "#e40058",
    text: "#ffffff",
    bg: "#5c94fc",
    border: "#000000",
  },
};

// ---------------------------------------------------------------------------
// Night Theme
// ---------------------------------------------------------------------------

/**
 * Alternative nighttime Mario color palette.
 *
 * A complete dark-mode palette that can replace `dayTheme` across all
 * components without any component-level edits. Glowing accents and muted
 * backgrounds evoke the Mario night-world aesthetic.
 *
 * @example
 * ```ts
 * import { nightTheme } from "@/lib/theme";
 * const skyColor = nightTheme.colors.sky; // "#0d1b2a"
 * ```
 */
export const nightTheme: ThemeType = {
  name: "night",
  colors: {
    sky: "#0d1b2a",
    ground: "#3b1f0a",
    brick: "#7a3b10",
    coin: "#ffd700",
    pipe: "#005500",
    mario: "#c0003a",
    text: "#e8e8e8",
    bg: "#0d1b2a",
    border: "#444444",
  },
};

// ---------------------------------------------------------------------------
// Pixel Grid
// ---------------------------------------------------------------------------

/**
 * Pixel-grid spacing scale built on multiples of 4 px.
 *
 * Use these named steps instead of raw pixel values in component styles to
 * maintain pixel-authentic proportions across the entire site.
 *
 * | Key   | Value |
 * |-------|-------|
 * | px1   | 4px   |
 * | px2   | 8px   |
 * | px3   | 12px  |
 * | px4   | 16px  |
 * | px6   | 24px  |
 * | px8   | 32px  |
 * | px12  | 48px  |
 * | px16  | 64px  |
 *
 * @example
 * ```ts
 * import { pixelGrid } from "@/lib/theme";
 * const padding = pixelGrid.px4; // "16px"
 * ```
 */
export const pixelGrid = {
  px1: "4px",
  px2: "8px",
  px3: "12px",
  px4: "16px",
  px6: "24px",
  px8: "32px",
  px12: "48px",
  px16: "64px",
} as const;

// ---------------------------------------------------------------------------
// Z-Index Layers
// ---------------------------------------------------------------------------

/**
 * Named z-index layers for the Mario Pixel Portfolio.
 *
 * Assign these values to `z-index` in component styles to keep stacking
 * contexts predictable and easy to reason about.
 *
 * | Layer      | Value | Usage                                  |
 * |------------|-------|----------------------------------------|
 * | background | 0     | Sky gradient, parallax background      |
 * | ground     | 10    | Ground / platform strip                |
 * | entities   | 20    | Coins, blocks, clouds, game elements   |
 * | ui         | 30    | General UI components                  |
 * | hud        | 40    | HUD overlay (score, coins, world)      |
 * | overlay    | 50    | Full-screen overlays, mobile menus     |
 * | modal      | 60    | Modals and dialogs                     |
 *
 * @example
 * ```ts
 * import { zIndex } from "@/lib/theme";
 * const style = { zIndex: zIndex.hud }; // 40
 * ```
 */
export const zIndex = {
  background: 0,
  ground: 10,
  entities: 20,
  ui: 30,
  hud: 40,
  overlay: 50,
  modal: 60,
} as const;
