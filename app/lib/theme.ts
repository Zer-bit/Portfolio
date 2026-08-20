// Types
// Shape of a theme object.
export type ThemeType = {
  // Human-readable identifier for the theme.
  name: "day" | "night";
  colors: {
    // Sky / hero background — Mario daytime sky blue.
    sky: string;
    // Ground / platform color — Mario dirt brown.
    ground: string;
    // Brick block color — Mario brick orange.
    brick: string;
    // Coin / accent color — Mario coin gold.
    coin: string;
    // Pipe / success color — Mario pipe green.
    pipe: string;
    // Mario / primary action color — Mario red.
    mario: string;
    // Primary text color.
    text: string;
    // Page / section background color.
    bg: string;
    // Border / outline color used for pixel-art borders.
    border: string;
  };
};

// Day Theme
// Default daytime Mario color palette.
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

// Night Theme
// Alternative nighttime Mario color palette.
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

// Pixel Grid
// Pixel-grid spacing scale built on multiples of 4 px.
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

// Z-Index Layers
// Named z-index layers for the Mario Pixel Portfolio.
export const zIndex = {
  background: 0,
  ground: 10,
  entities: 20,
  ui: 30,
  hud: 40,
  overlay: 50,
  modal: 60,
} as const;
