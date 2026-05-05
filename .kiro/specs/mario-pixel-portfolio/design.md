# Design Document: Mario Pixel Portfolio

## Overview

This document describes the technical architecture and implementation plan for redesigning Jezer Parales' Next.js portfolio from its current clean minimal aesthetic into a Super Mario-inspired pixel-art game theme. The existing stack (Next.js, React, TypeScript, Tailwind CSS v4, Framer Motion) is retained. All existing content data is preserved unchanged.

The redesign introduces a new folder structure, a centralized theme system, reusable pixel-art UI primitives, game decorative components, and a root layout wrapper — all layered on top of the existing codebase with minimal disruption to working logic (form submission, tilt hook, notification toast behavior, etc.).

---

## Architecture Overview

### Current Structure (to be migrated)

```
app/
  components/
    layout/       → navbar.tsx, footer.tsx
    sections/     → hero.tsx, skills.tsx, projects.tsx, contact.tsx
    ui/           → scroll-progress.tsx, notification-toast.tsx
  hooks/          → use-tilt.tsx
  lib/            → data.ts, constants.ts
  globals.css
  layout.tsx
  page.tsx
```

### Target Structure (post-redesign)

```
app/
  components/
    ui/           → pixel-button.tsx, pixel-card.tsx, pixel-container.tsx,
                    notification-toast.tsx, scroll-progress.tsx
    game/         → coin.tsx, block.tsx, cloud.tsx, hud.tsx
    layout/       → game-layout.tsx, section-wrapper.tsx, navbar.tsx, footer.tsx
  features/
    hero/         → index.tsx
    skills/       → index.tsx
    projects/     → index.tsx
    contact/      → index.tsx
  hooks/          → use-animation.ts, use-tilt.tsx, use-sound.ts
  lib/            → data.ts (unchanged), constants.ts (unchanged),
                    theme.ts (new), animations.ts (new)
  styles/         → globals.css (updated), pixel.css (new)
  layout.tsx      → updated to use GameLayout
  page.tsx        → updated to use feature sections
```

---

## Module Designs

### 1. `lib/theme.ts` — Centralized Theme System

**Purpose:** Single source of truth for all visual tokens. Consumed by every component.

**Exports:**
- `dayTheme` — Day palette object
- `nightTheme` — Night palette object
- `pixelGrid` — Spacing scale object
- `zIndex` — Named z-index layers
- `ThemeType` — TypeScript type for the theme shape

**Theme shape:**
```ts
type ThemeType = {
  colors: {
    sky: string;        // #5c94fc
    ground: string;     // #c84b0c
    brick: string;      // #d07030
    coin: string;       // #f8b800
    pipe: string;       // #00a800
    mario: string;      // #e40058
    text: string;       // #ffffff
    bg: string;         // page background
    border: string;     // border color
  };
  name: "day" | "night";
};
```

**Pixel Grid:**
```ts
const pixelGrid = {
  px1: "4px",  px2: "8px",  px3: "12px", px4: "16px",
  px6: "24px", px8: "32px", px12: "48px", px16: "64px",
};
```

**Z-Index Layers:**
```ts
const zIndex = {
  background: 0, ground: 10, entities: 20,
  ui: 30, hud: 40, overlay: 50, modal: 60,
};
```

**Design Decision:** `lib/constants.ts` and `lib/data.ts` are left untouched. `theme.ts` is a new file that adds Mario-specific tokens without replacing the existing color constants used by data.ts.

---

### 2. `lib/animations.ts` — Animation Presets

**Purpose:** Centralized Framer Motion variant definitions. No component defines its own animation inline.

**Exports:**
```ts
export const bounceVariant: Variants      // Y: 0 → -8 → 0, spring, infinite
export const floatVariant: Variants       // Y: 0 → -6 → 0, 3s sinusoidal, infinite
export const spinVariant: Variants        // rotate 0 → 360, 1s linear, infinite
export const fadeUpVariant: Variants      // opacity 0→1, y 20→0, 0.5s ease-out
export type AnimationPresetName = "bounce" | "float" | "spin" | "fade-up"
```

---

### 3. `styles/pixel.css` — Pixel-Art CSS Foundation

**Purpose:** Global CSS utilities for pixel rendering, fonts, borders, and shadows.

**Contents:**
- `@font-face` or `@import` for "Press Start 2P" (via Google Fonts in `layout.tsx`)
- `img, canvas { image-rendering: pixelated; image-rendering: crisp-edges; }`
- CSS custom properties: `--pixel-border`, `--pixel-border-emphasis`
- `.pixel-shadow` — multi-layer box-shadow with 4px offsets, no blur
- `.pixel-text` — pixel font, `-webkit-font-smoothing: none`, `letter-spacing: 0.05em`
- `@media (max-width: 767px)` — 25% font-size reduction for `.pixel-text`

**Pixel Shadow Definition:**
```css
.pixel-shadow {
  box-shadow:
    4px 0 0 0 #000,
    0 4px 0 0 #000,
    4px 4px 0 0 #000,
    -4px 0 0 0 #000,
    0 -4px 0 0 #000;
}
```

---

### 4. `hooks/useAnimation.ts` — Animation Hook

**Purpose:** Accepts an `AnimationPresetName` and returns spread-ready Framer Motion props.

**Interface:**
```ts
function useAnimation(preset: AnimationPresetName): {
  variants: Variants;
  initial: string;
  animate: string;
  transition?: Transition;
}
```

---

### 5. `hooks/useSound.ts` — Sound Hook Stub

**Purpose:** Stub interface so components can import and call it without breaking when a real implementation is added later.

**Interface:**
```ts
function useSound(): {
  playBounce: () => void;
  playCoin: () => void;
  playPipe: () => void;
}
// Returns no-ops in stub implementation
```

---

### 6. `components/ui/pixel-button.tsx` — PixelButton

**Props:**
```ts
interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "brick" | "coin" | "pipe";   // default: "brick"
  size?: "sm" | "md" | "lg";
  animation?: AnimationPresetName;
}
```

**Variant Map (colors from theme.ts):**
| Variant | Background     | Border         | Text    |
|---------|---------------|----------------|---------|
| brick   | theme.brick   | theme.ground   | white   |
| coin    | theme.coin    | theme.ground   | #111    |
| pipe    | theme.pipe    | #005500        | white   |

**Size Map (Pixel_Grid values):**
| Size | Padding         | Font Size |
|------|----------------|-----------|
| sm   | px2 × px3      | 10px      |
| md   | px3 × px6      | 12px      |
| lg   | px4 × px8      | 14px      |

**Behavior:**
- Applies `.pixel-shadow` and `.pixel-text` by default
- Disabled: `opacity-50 pointer-events-none`
- Active/pressed: pixel shadow shifts down 2px (inset effect)
- Wraps in `motion.button` when `animation` prop is provided

---

### 7. `components/ui/pixel-card.tsx` — PixelCard

**Props:**
```ts
interface PixelCardProps {
  variant?: "default" | "elevated" | "flat";
  animation?: AnimationPresetName;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}
```

**Variant Map:**
| Variant  | Shadow         | Border              | Hover         |
|----------|---------------|---------------------|---------------|
| default  | pixel-shadow  | 2px solid border    | none          |
| elevated | pixel-shadow  | 4px double border   | translateY(-4px) |
| flat     | none          | 1px solid border    | none          |

**Behavior:**
- Uses `whileInView` with the provided `animation` preset for entrance
- `elevated` variant uses `whileHover={{ y: -4 }}` Framer Motion prop

---

### 8. `components/ui/pixel-container.tsx` — PixelContainer

**Props:**
```ts
interface PixelContainerProps {
  fullWidth?: boolean;
  className?: string;
  as?: keyof JSX.IntrinsicElements;  // default: "div"
  children: React.ReactNode;
}
```

**Behavior:**
- `max-w-[1280px] mx-auto px-6 md:px-8`
- When `fullWidth=true`: removes max-width, retains padding

---

### 9. `components/game/coin.tsx` — Coin

**Props:**
```ts
interface CoinProps {
  size?: number;  // default: 24
}
```

**Implementation:** SVG-based pixel-art coin (yellow square with pixel details) wrapped in `motion.div` using `spinVariant` from `animations.ts`. Loaded via dynamic import with `{ ssr: false }`.

---

### 10. `components/game/block.tsx` — Block

**Props:**
```ts
interface BlockProps {
  variant: "question" | "brick";
  size?: number;
}
```

**Behavior:**
- Renders pixel-art SVG block
- `question` variant: shows `?` character, on click triggers `bounceVariant` animation and optional coin pop
- `brick` variant: static brick pattern
- Loaded via dynamic import with `{ ssr: false }`

---

### 11. `components/game/cloud.tsx` — Cloud

**Props:**
```ts
interface CloudProps {
  size?: "sm" | "md" | "lg";
  style?: React.CSSProperties;
}
```

**Implementation:** CSS/SVG pixel-art cloud shape, continuously animated with `floatVariant`. Loaded via dynamic import with `{ ssr: false }`.

---

### 12. `components/game/hud.tsx` — HUD

**Props:**
```ts
interface HUDProps {
  score?: number;
  coins?: number;
  worldLabel?: string;  // default: "PORTFOLIO-1"
}
```

**Implementation:** Pixel-art styled bar with score, coin counter (Coin component + count), and world label. Uses `.pixel-text` and theme coin/text colors. Loaded via dynamic import with `{ ssr: false }`.

---

### 13. `components/layout/game-layout.tsx` — GameLayout

**Props:**
```ts
interface GameLayoutProps {
  theme?: "day" | "night";  // default: "day"
  children: React.ReactNode;
}
```

**Context:**
```ts
interface GameLayoutContextType {
  theme: "day" | "night";
  scrollY: number;
}
export const GameLayoutContext = createContext<GameLayoutContextType>(...);
```

**Parallax Layers (z-index from theme.ts):**
| Layer   | Z-Index     | Scroll Speed | Content              |
|---------|-------------|--------------|----------------------|
| Sky     | background  | 0.1×         | Gradient background  |
| Clouds  | background  | 0.3×         | Cloud components     |
| Ground  | ground      | 1.0×         | Block platform strip |

**Behavior:**
- Applies theme CSS custom properties to root `div`
- Uses Framer Motion `useScroll` + `useTransform` for parallax (60fps via GPU)
- Applies `will-change: transform` to parallax layers
- Reduces Cloud count to ≤3 on mobile (via `useMediaQuery` or CSS)
- Wraps `<Navbar>`, `<ScrollProgress>`, `<Footer>`, and page `children`

---

### 14. `components/layout/section-wrapper.tsx` — SectionWrapper

**Props:**
```ts
interface SectionWrapperProps {
  id?: string;
  className?: string;
  background?: "transparent" | "ground" | "sky";
  children: React.ReactNode;
}
```

**Behavior:**
- `py-16 md:py-24` padding (px16 mobile, ~96px desktop)
- `fade-up` entrance animation via `useAnimation("fade-up")` + `whileInView`
- Background token applied from `dayTheme.colors` based on `background` prop

---

### 15. Feature Sections

Each feature section is relocated from `app/components/sections/` to `app/features/{name}/index.tsx`. Logic is preserved; only visual styling is replaced.

#### `features/hero/index.tsx`
- Name displayed in `.pixel-text` font as a title card
- Pixel-art character sprite (SVG or PNG sprite sheet) on the right (desktop) / centered (mobile)
- "Hire Me" → `<PixelButton variant="coin">`
- "View Work" → `<PixelButton variant="pipe">`
- Ground platform: `<Block variant="brick">` repeated horizontally at section bottom
- "Available for projects" badge restyled as pixel HUD badge
- Scroll-down arrow triggers smooth scroll to `#skills`
- Cloud components rendered via GameLayout parallax layer

#### `features/skills/index.tsx`
- Technical skill categories → `<PixelCard variant="elevated">` with power-up icon badge
- Individual skill tags → `<PixelButton variant="coin" size="sm">` (non-interactive, `tabIndex={-1}`)
- Professional skills → `<PixelCard variant="default">`
- Staggered entrance: 100ms delay per card via `transition={{ delay: index * 0.1 }}`
- Data sourced from `lib/data.ts` (unchanged)

#### `features/projects/index.tsx`
- Each project → `<PixelCard variant="elevated">` replacing `bg-white/80 rounded-3xl`
- Tech tags → `<PixelButton variant="brick" size="sm">` (non-interactive)
- Live/Coming Soon link → `<PixelButton variant="coin" size="sm">`
- `useTilt` hook preserved on project cards
- `NotificationToast` behavior preserved, restyled with pixel borders
- Hover overlay with full description preserved, pixel-art scrollbar added
- `<Image>` component from `next/image` replaces `<img>` tags
- 3-col / 2-col / 1-col grid preserved

#### `features/contact/index.tsx`
- Form container → `<PixelCard variant="elevated">` replacing `bg-white/80 rounded-[2rem]`
- Inputs styled with `.pixel-shadow` and theme border tokens
- "Send Message" → `<PixelButton variant="coin" size="lg">`
- Form submission logic (Google Apps Script, `no-cors` POST) preserved unchanged
- Success state → pixel-art dialogue box with `<Coin>` animation
- Loading state → `<Coin>` spinning animation replaces `<Loader2>`
- Social links restyled as pixel-art icon buttons

---

### 16. Navbar Redesign (`components/layout/navbar.tsx`)

- Logo: `<Coin size={16}>` + "JEZER." in `.pixel-text`
- Active link indicator: pixel-art block cursor (2px solid bottom border) replacing `layoutId="activeNav"` highlight
- Scroll background transition: preserved
- Mobile menu: pixel borders, `.pixel-text` for link text, Mario decorative elements
- Mobile link font size: minimum 32px rendered

---

### 17. Footer Redesign (`components/layout/footer.tsx`)

- "JEZER." logo in `.pixel-text` with theme coin color
- Copyright text preserved
- `<Block variant="brick">` row along top edge of footer
- Background uses theme ground color

---

### 18. ScrollProgress Redesign (`components/ui/scroll-progress.tsx`)

- SVG circle replaced with square-cornered pixel-art progress ring (using `stroke-linecap="square"`)
- Colors from `theme.ts` coin/border tokens
- At 100%: renders `<Coin>` or pixel star SVG instead of percentage number

---

### 19. NotificationToast Redesign (`components/ui/notification-toast.tsx`)

- Container: pixel borders (`.pixel-shadow`, 2px solid border)
- Font: `.pixel-text`
- Icon: `<Coin>` replacing `<AlertCircle>`
- Behavior (auto-close at 1300ms, progress bar) preserved

---

## Data Flow

```
lib/theme.ts
  └─ consumed by: all components (colors, spacing, z-index)

lib/animations.ts
  └─ consumed by: hooks/useAnimation.ts
       └─ consumed by: PixelButton, PixelCard, SectionWrapper, game components

lib/data.ts (unchanged)
  └─ consumed by: features/hero, features/skills, features/projects, features/contact

components/game/* (dynamic imports, ssr:false)
  └─ consumed by: features/hero, features/contact, components/layout/game-layout

GameLayoutContext
  └─ provides: active theme, scrollY
       └─ consumed by: any future component needing theme or scroll position
```

---

## File Migration Map

| Old Path | New Path | Action |
|---|---|---|
| `app/components/sections/hero.tsx` | `app/features/hero/index.tsx` | Migrate + restyle |
| `app/components/sections/skills.tsx` | `app/features/skills/index.tsx` | Migrate + restyle |
| `app/components/sections/projects.tsx` | `app/features/projects/index.tsx` | Migrate + restyle |
| `app/components/sections/contact.tsx` | `app/features/contact/index.tsx` | Migrate + restyle |
| `app/components/layout/navbar.tsx` | `app/components/layout/navbar.tsx` | In-place restyle |
| `app/components/layout/footer.tsx` | `app/components/layout/footer.tsx` | In-place restyle |
| `app/components/ui/scroll-progress.tsx` | `app/components/ui/scroll-progress.tsx` | In-place restyle |
| `app/components/ui/notification-toast.tsx` | `app/components/ui/notification-toast.tsx` | In-place restyle |
| `app/hooks/use-tilt.tsx` | `app/hooks/use-tilt.tsx` | No change |
| `app/globals.css` | `app/styles/globals.css` | Move + update |
| _(new)_ | `app/styles/pixel.css` | Create |
| _(new)_ | `app/lib/theme.ts` | Create |
| _(new)_ | `app/lib/animations.ts` | Create |
| _(new)_ | `app/hooks/use-animation.ts` | Create |
| _(new)_ | `app/hooks/use-sound.ts` | Create (stub) |
| _(new)_ | `app/components/ui/pixel-button.tsx` | Create |
| _(new)_ | `app/components/ui/pixel-card.tsx` | Create |
| _(new)_ | `app/components/ui/pixel-container.tsx` | Create |
| _(new)_ | `app/components/game/coin.tsx` | Create |
| _(new)_ | `app/components/game/block.tsx` | Create |
| _(new)_ | `app/components/game/cloud.tsx` | Create |
| _(new)_ | `app/components/game/hud.tsx` | Create |
| _(new)_ | `app/components/layout/game-layout.tsx` | Create |
| _(new)_ | `app/components/layout/section-wrapper.tsx` | Create |

---

## Key Technical Decisions

1. **No new dependencies.** The redesign uses only the existing stack: Next.js, React, TypeScript, Tailwind CSS v4, Framer Motion, lucide-react. The pixel font is loaded via Google Fonts in `layout.tsx`.

2. **Dynamic imports for all game components.** `Coin`, `Block`, `Cloud`, and `HUD` are loaded with `next/dynamic({ ssr: false })` to keep the initial bundle lean and avoid SSR issues with animation-heavy components.

3. **Sprite sheets over GIFs.** Any pixel-art character animation uses a single PNG sprite sheet with CSS `background-position` stepping, not animated GIFs, for performance.

4. **Framer Motion `useScroll` for parallax.** The GameLayout uses `useScroll` + `useTransform` from Framer Motion rather than a raw `requestAnimationFrame` loop, keeping parallax declarative and GPU-composited.

5. **`lib/data.ts` and `lib/constants.ts` are untouched.** All existing color constants and data arrays remain as-is. `theme.ts` introduces Mario-specific tokens as an additive layer.

6. **Variant maps over conditionals.** All variant-specific styles use plain object maps keyed by variant name, consistent with Requirement 19.5.

7. **`app/styles/` directory.** `globals.css` is moved from `app/` to `app/styles/` and `pixel.css` is added alongside it. The import in `layout.tsx` is updated accordingly.

8. **`next/image` for project images.** All `<img>` tags in the projects section are replaced with Next.js `<Image>` for automatic optimization and lazy loading.
