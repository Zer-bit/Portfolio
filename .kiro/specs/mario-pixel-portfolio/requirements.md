# Requirements Document

## Introduction

This feature redesigns the existing Next.js/React portfolio website (belonging to Jezer Parales) from its current clean, minimal aesthetic into a **Super Mario-inspired pixel-art game theme**. The redesign is purely a UI/UX and visual overhaul — all existing content (projects, skills, contact info, social links) is preserved. The goal is to produce a professional, modular, and scalable frontend architecture that feels like a Mario pixel game while remaining easy to extend with future features such as a blog, admin dashboard, CMS integration, game-like navigation, and achievement systems.

The existing stack (Next.js, React, TypeScript, Tailwind CSS v4, Framer Motion) is retained. No backend changes are required.

---

## Glossary

- **Portfolio_Site**: The complete Next.js/React portfolio website being redesigned.
- **Theme_System**: The centralized configuration in `lib/theme.ts` that defines colors, spacing, animations, z-index layers, and supports day/night mode switching.
- **Pixel_Grid**: The base spacing unit system built on multiples of 4px and 8px to maintain pixel-authentic proportions.
- **PixelButton**: A reusable button component located in `components/ui/` supporting variants (brick, coin, pipe), sizes (sm, md, lg), and animation types.
- **PixelCard**: A reusable card component located in `components/ui/` used for projects, skills, and about sections; accepts children and animation props.
- **PixelContainer**: A reusable layout wrapper component in `components/ui/` that applies pixel-grid-based padding and max-width constraints.
- **GameLayout**: The root layout wrapper component that handles the Mario-themed background, parallax layers, and active theme.
- **SectionWrapper**: A reusable section wrapper component that applies standard vertical spacing and entrance transitions.
- **Game_Elements**: Decorative interactive components in `components/game/` — Coin, Block, Cloud, HUD — that reinforce the Mario aesthetic.
- **HUD**: Heads-Up Display component styled after Mario game UI (lives, score, coins counter) used as a decorative/navigational element.
- **Animation_Preset**: A named, reusable motion configuration (bounce, float, spin, fade-up) defined centrally and consumed by components via props.
- **Sprite_Sheet**: A single optimized image file containing multiple pixel-art frames used instead of individual GIFs for performance.
- **Day_Theme**: The default Mario daytime color palette (sky blue, grass green, brick orange/brown, coin gold).
- **Night_Theme**: The dark-mode Mario nighttime color palette (dark sky, glowing elements, muted backgrounds).
- **Feature_Section**: One of the four main content sections — Hero, Skills, Projects, Contact — each living in `features/`.
- **Navbar**: The fixed top navigation bar, redesigned with pixel-art styling and Mario-themed active state indicators.
- **Footer**: The bottom site footer, redesigned with pixel-art styling.
- **ScrollProgress**: The existing circular scroll progress indicator, redesigned with pixel-art styling.
- **NotificationToast**: The existing notification toast component, redesigned with pixel-art styling.

---

## Requirements

---

### Requirement 1: Centralized Theme System

**User Story:** As a developer, I want a single source of truth for all visual tokens, so that I can change the entire site's look by editing one file and easily add new themes in the future.

#### Acceptance Criteria

1. THE Theme_System SHALL define all color tokens for the Day_Theme, including sky blue (`#5c94fc`), ground brown (`#c84b0c`), brick orange (`#d07030`), coin gold (`#f8b800`), pipe green (`#00a800`), Mario red (`#e40058`), and text white (`#ffffff`).
2. THE Theme_System SHALL define all color tokens for the Night_Theme as a complete alternative palette that can replace the Day_Theme without modifying component files.
3. THE Theme_System SHALL define a Pixel_Grid spacing scale where the base unit is 4px, with named steps: `px1=4px`, `px2=8px`, `px3=12px`, `px4=16px`, `px6=24px`, `px8=32px`, `px12=48px`, `px16=64px`.
4. THE Theme_System SHALL define named z-index layers: `background=0`, `ground=10`, `entities=20`, `ui=30`, `hud=40`, `overlay=50`, `modal=60`.
5. THE Theme_System SHALL define named Animation_Presets: `bounce`, `float`, `spin`, `fade-up`, each as an exportable Framer Motion `Variants` object or `Transition` configuration.
6. THE Theme_System SHALL export a TypeScript type for the theme shape so that all consuming components receive type-safe access to theme tokens.
7. WHEN a developer switches the active theme from Day_Theme to Night_Theme, THE Portfolio_Site SHALL apply the new palette across all components without requiring individual component edits.

---

### Requirement 2: Pixel-Art CSS Foundation

**User Story:** As a developer, I want a dedicated pixel-art CSS layer, so that all pixel-rendering, font, and border utilities are available globally without duplicating styles across components.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL load a `styles/pixel.css` file that defines pixel-rendering utilities: `image-rendering: pixelated` and `image-rendering: crisp-edges` applied to all `img` and `canvas` elements.
2. THE Portfolio_Site SHALL include at least one pixel-art compatible web font (such as "Press Start 2P" or "VT323") loaded via `next/font` or a `@font-face` declaration in `pixel.css`.
3. THE Portfolio_Site SHALL define CSS custom properties in `pixel.css` for pixel-border styles: a 2px solid border using the active theme's border color, and a 4px double-border variant for emphasis.
4. THE Portfolio_Site SHALL define a `.pixel-shadow` utility class that applies a multi-layer `box-shadow` simulating a pixel-art drop shadow (offset in 4px increments, no blur radius).
5. THE Portfolio_Site SHALL define a `.pixel-text` utility class that applies the pixel font, disables font smoothing (`-webkit-font-smoothing: none`), and sets `letter-spacing` to `0.05em`.
6. WHEN the viewport width is below 768px, THE Portfolio_Site SHALL scale pixel fonts down by 25% to maintain readability on mobile screens without distortion.

---

### Requirement 3: Reusable UI Component — PixelButton

**User Story:** As a developer, I want a single button component that covers all button use cases across the site, so that I never write inline button styles and can update all buttons from one place.

#### Acceptance Criteria

1. THE PixelButton SHALL accept a `variant` prop with values `"brick"`, `"coin"`, and `"pipe"`, each applying a distinct pixel-art visual style derived from Theme_System tokens.
2. THE PixelButton SHALL accept a `size` prop with values `"sm"`, `"md"`, and `"lg"`, mapping to Pixel_Grid-based padding and font-size values.
3. THE PixelButton SHALL accept an `animation` prop with values matching defined Animation_Preset names (`"bounce"`, `"float"`, `"spin"`, `"fade-up"`), applying the corresponding Framer Motion behavior on hover or mount.
4. THE PixelButton SHALL render a visually distinct disabled state when the `disabled` prop is `true`, reducing opacity to 50% and suppressing pointer events.
5. THE PixelButton SHALL render a visually distinct active/pressed state using a pixel-art inset shadow effect (shifting the pixel shadow downward by 2px) when the button is clicked.
6. THE PixelButton SHALL accept standard HTML button props (`onClick`, `type`, `aria-label`, `children`) and forward them to the underlying `<button>` element.
7. THE PixelButton SHALL apply the `.pixel-shadow` and `.pixel-text` utility classes from `pixel.css` by default.
8. WHEN the `variant` prop is not provided, THE PixelButton SHALL default to the `"brick"` variant.

---

### Requirement 4: Reusable UI Component — PixelCard

**User Story:** As a developer, I want a single card component that wraps any content in a pixel-art styled container, so that projects, skills, and other sections share a consistent visual language.

#### Acceptance Criteria

1. THE PixelCard SHALL accept a `variant` prop with values `"default"`, `"elevated"`, and `"flat"`, each applying a different pixel-art border and shadow treatment from Theme_System tokens.
2. THE PixelCard SHALL accept an `animation` prop with values matching Animation_Preset names, applying the corresponding entrance animation when the card enters the viewport.
3. THE PixelCard SHALL accept a `children` prop and render its children inside the styled container without imposing layout constraints on the children.
4. THE PixelCard SHALL accept `className` and `style` props to allow per-instance overrides without breaking the base styles.
5. THE PixelCard SHALL apply the `.pixel-shadow` utility class by default and remove it when `variant="flat"`.
6. WHEN the user hovers over a PixelCard with `variant="elevated"`, THE PixelCard SHALL animate upward by 4px (one Pixel_Grid unit) using a Framer Motion transition.

---

### Requirement 5: Reusable UI Component — PixelContainer

**User Story:** As a developer, I want a standard layout wrapper that enforces consistent max-width and pixel-grid padding, so that all sections are aligned without repeating layout code.

#### Acceptance Criteria

1. THE PixelContainer SHALL apply a maximum content width of 1280px and center itself horizontally on the page.
2. THE PixelContainer SHALL apply horizontal padding using Pixel_Grid values: `px6` (24px) on mobile and `px8` (32px) on desktop (≥768px).
3. THE PixelContainer SHALL accept a `fullWidth` boolean prop that, when `true`, removes the max-width constraint while retaining padding.
4. THE PixelContainer SHALL accept `children`, `className`, and `as` props, where `as` allows rendering as any valid HTML element (default: `"div"`).

---

### Requirement 6: Game Decorative Components

**User Story:** As a visitor, I want to see Mario-themed decorative elements throughout the site, so that the portfolio feels like an authentic pixel-art game world.

#### Acceptance Criteria

1. THE Coin component SHALL render an animated pixel-art coin using CSS or an SVG sprite, cycling through a spin animation defined in the Animation_Preset `"spin"`.
2. THE Block component SHALL render a pixel-art question-mark block (`?`) or brick block, accepting a `variant` prop of `"question"` or `"brick"`.
3. WHEN a user clicks the Block component with `variant="question"`, THE Block SHALL play a bounce animation and optionally emit a coin pop effect.
4. THE Cloud component SHALL render a pixel-art cloud shape and apply the `"float"` Animation_Preset continuously.
5. THE HUD component SHALL display a pixel-art styled score counter, coin counter, and a "WORLD" label (e.g., "PORTFOLIO-1"), styled after the classic Super Mario Bros. HUD.
6. THE HUD component SHALL accept props for `score`, `coins`, and `worldLabel` to allow dynamic data binding.
7. THE GameLayout component SHALL render Cloud components in a parallax background layer at z-index `background`, scrolling at a slower rate than the page content.
8. WHEN the viewport width is below 768px, THE GameLayout SHALL reduce the number of visible Cloud components to no more than 3 to maintain performance.

---

### Requirement 7: GameLayout — Root Layout Wrapper

**User Story:** As a developer, I want a single root layout component that manages the Mario-themed background, parallax, and theme context, so that every page inherits the game world aesthetic automatically.

#### Acceptance Criteria

1. THE GameLayout SHALL wrap all page content and apply the active Theme_System palette as CSS custom properties on a root element.
2. THE GameLayout SHALL render a multi-layer parallax background: a sky layer (farthest), a cloud layer (middle), and a ground/platform layer (nearest), each scrolling at distinct speeds.
3. THE GameLayout SHALL accept a `theme` prop of `"day"` or `"night"` and apply the corresponding Theme_System palette.
4. THE GameLayout SHALL default to the `"day"` theme when no `theme` prop is provided.
5. WHILE the page is scrolling, THE GameLayout SHALL update parallax layer positions using `requestAnimationFrame` or a Framer Motion scroll hook to maintain 60fps performance.
6. THE GameLayout SHALL preserve the existing `<Navbar>`, `<ScrollProgress>`, and `<Footer>` components as children, wrapping them within the themed context.

---

### Requirement 8: SectionWrapper — Standard Section Container

**User Story:** As a developer, I want a standard section wrapper that handles spacing and entrance animations, so that every section of the portfolio has consistent vertical rhythm and transitions.

#### Acceptance Criteria

1. THE SectionWrapper SHALL apply top and bottom padding of `px16` (64px) on mobile and `px12 * 2` (96px) on desktop using Pixel_Grid values.
2. THE SectionWrapper SHALL apply a `fade-up` entrance animation (from the Animation_Preset) when the section enters the viewport, triggering once per page load.
3. THE SectionWrapper SHALL accept an `id` prop and apply it to the root element to support anchor-link navigation.
4. THE SectionWrapper SHALL accept `children` and `className` props.
5. THE SectionWrapper SHALL accept a `background` prop of `"transparent"`, `"ground"`, or `"sky"` to apply the corresponding Theme_System background token.

---

### Requirement 9: Hero Section Redesign

**User Story:** As a visitor, I want the hero section to feel like the opening screen of a Mario game, so that I immediately understand the pixel-art game theme and feel engaged.

#### Acceptance Criteria

1. THE Hero section SHALL display the developer's name ("Jezer Parales") using the pixel font defined in the Theme_System, styled as a Mario-game title card.
2. THE Hero section SHALL display a pixel-art character sprite or avatar in the hero area, positioned to the right of the text content on desktop and centered on mobile.
3. THE Hero section SHALL render the "Hire Me" and "View Work" calls-to-action as PixelButton components with `variant="coin"` and `variant="pipe"` respectively.
4. THE Hero section SHALL display a pixel-art ground platform at the bottom of the section using the Block component with `variant="brick"` repeated horizontally.
5. THE Hero section SHALL display at least two Cloud components in the background using the GameLayout parallax layer.
6. THE Hero section SHALL preserve the existing "Available for projects" status indicator, restyled as a pixel-art HUD badge.
7. WHEN the user clicks the scroll-down indicator, THE Hero section SHALL smoothly scroll to the Skills section.

---

### Requirement 10: Skills Section Redesign

**User Story:** As a visitor, I want the skills section to present technical and professional skills in a game-inventory or power-up style, so that the content feels native to the Mario theme.

#### Acceptance Criteria

1. THE Skills section SHALL render each technical skill category as a PixelCard with `variant="elevated"` and an icon styled as a pixel-art power-up badge.
2. THE Skills section SHALL render individual skill tags (e.g., "React", "TypeScript") as small PixelButton components with `variant="coin"` and `size="sm"`, non-interactive (display only).
3. THE Skills section SHALL render each professional skill as a PixelCard with `variant="default"`, preserving the icon and description layout from the existing design.
4. THE Skills section SHALL preserve all existing skill data from `lib/data.ts` without modification.
5. WHEN a PixelCard in the Skills section enters the viewport, THE Skills section SHALL trigger the card's entrance animation with a staggered delay of 100ms per card.

---

### Requirement 11: Projects Section Redesign

**User Story:** As a visitor, I want the projects section to display my work as collectible game items or level cards, so that browsing projects feels like exploring a Mario world map.

#### Acceptance Criteria

1. THE Projects section SHALL render each project as a PixelCard with `variant="elevated"`, replacing the existing `bg-white/80 rounded-3xl` card style.
2. THE Projects section SHALL preserve the existing project image, title, description, tech stack tags, and live link for all six projects from `lib/data.ts`.
3. THE Projects section SHALL render tech stack tags as PixelButton components with `variant="brick"` and `size="sm"`, non-interactive (display only).
4. THE Projects section SHALL render the "Live Project" / "Coming Soon" link as a PixelButton with `variant="coin"` and `size="sm"`.
5. THE Projects section SHALL preserve the existing NotificationToast behavior for projects with `link="#"`, restyled with pixel-art borders and font.
6. THE Projects section SHALL preserve the existing 3-column grid layout on desktop, 2-column on tablet, and 1-column on mobile.
7. WHEN a project card is hovered, THE Projects section SHALL display the full project description in the hover overlay, consistent with the existing behavior, using pixel-art styled scrollbar.

---

### Requirement 12: Contact Section Redesign

**User Story:** As a visitor, I want the contact section to feel like a Mario game dialogue box or message screen, so that reaching out feels fun and on-theme.

#### Acceptance Criteria

1. THE Contact section SHALL render the contact form inside a PixelCard with `variant="elevated"`, replacing the existing `bg-white/80 rounded-[2rem]` container.
2. THE Contact section SHALL style all form inputs (name, email, message) with pixel-art borders using the `.pixel-shadow` utility and Theme_System border tokens.
3. THE Contact section SHALL render the "Send Message" button as a PixelButton with `variant="coin"` and `size="lg"`.
4. THE Contact section SHALL preserve the existing form submission logic (Google Apps Script URL, `no-cors` POST, success/error state management) without modification.
5. THE Contact section SHALL render the success state ("Message Sent!") as a pixel-art dialogue box with a coin icon animation.
6. THE Contact section SHALL preserve all existing social links (GitHub, LinkedIn, Instagram, Viber) and email address, restyled as pixel-art icon buttons.
7. WHEN the form is in the loading state, THE Contact section SHALL display a pixel-art animated loading indicator (e.g., spinning coin) instead of the existing `Loader2` spinner.

---

### Requirement 13: Navbar Redesign

**User Story:** As a visitor, I want the navigation bar to look like a Mario game HUD or level select screen, so that navigation feels part of the game world.

#### Acceptance Criteria

1. THE Navbar SHALL preserve all existing navigation links (Home, Skills, Projects, Contact) and their anchor-link behavior.
2. THE Navbar SHALL restyle the logo ("JEZER.") using the pixel font and a pixel-art coin or star icon instead of the existing `Sparkles` icon.
3. THE Navbar SHALL restyle the active navigation link indicator as a pixel-art underline or block cursor, replacing the existing Framer Motion `layoutId="activeNav"` highlight.
4. THE Navbar SHALL preserve the existing scroll-based background transition behavior (transparent → opaque on scroll).
5. THE Navbar SHALL preserve the existing mobile menu overlay, restyled with pixel-art borders, pixel font for link text, and Mario-themed decorative elements.
6. WHEN the mobile menu is open, THE Navbar SHALL display navigation links in the pixel font at a size readable on mobile (minimum 32px rendered size).

---

### Requirement 14: Footer and ScrollProgress Redesign

**User Story:** As a visitor, I want the footer and scroll indicator to match the pixel-art theme, so that every part of the site feels cohesive.

#### Acceptance Criteria

1. THE Footer SHALL preserve the copyright text and "JEZER." logo, restyled with the pixel font and Theme_System color tokens.
2. THE Footer SHALL add a pixel-art ground platform decoration (using the Block component with `variant="brick"`) along the top edge of the footer.
3. THE ScrollProgress component SHALL restyle the circular SVG progress indicator using Theme_System color tokens and pixel-art styling (square corners, pixel border).
4. WHEN scroll progress reaches 100%, THE ScrollProgress component SHALL display a pixel-art star or coin icon instead of the percentage number.

---

### Requirement 15: Animation System

**User Story:** As a developer, I want all animations defined and managed in one place, so that I can update motion behavior site-wide without hunting through individual component files.

#### Acceptance Criteria

1. THE Animation_Preset `"bounce"` SHALL define a Framer Motion variant that moves the element 0px → -8px → 0px on the Y axis with a spring easing, repeating infinitely.
2. THE Animation_Preset `"float"` SHALL define a Framer Motion variant that moves the element 0px → -6px → 0px on the Y axis with a sinusoidal easing, repeating infinitely with a 3-second duration.
3. THE Animation_Preset `"spin"` SHALL define a Framer Motion variant that rotates the element 0° → 360° continuously with a 1-second linear duration.
4. THE Animation_Preset `"fade-up"` SHALL define a Framer Motion variant with initial state `{ opacity: 0, y: 20 }` and animate state `{ opacity: 1, y: 0 }` with a 0.5-second ease-out transition.
5. THE Portfolio_Site SHALL import Animation_Presets exclusively from `lib/theme.ts` or a dedicated `lib/animations.ts` file; no component file SHALL define its own animation keyframes or Framer Motion variants inline.
6. THE `hooks/useAnimation.ts` hook SHALL accept an Animation_Preset name and return the corresponding Framer Motion props (`variants`, `initial`, `animate`, `transition`) ready for spread onto a `motion.*` element.

---

### Requirement 16: Responsive Design and Pixel Scaling

**User Story:** As a visitor on any device, I want the pixel-art theme to look sharp and correctly scaled, so that the portfolio is usable and visually consistent on mobile, tablet, and desktop.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL use a mobile-first CSS approach, defining base styles for mobile and overriding with `md:` and `lg:` Tailwind breakpoints for larger screens.
2. THE Portfolio_Site SHALL render all pixel-art images and sprites with `image-rendering: pixelated` to prevent blurring on non-integer scale factors.
3. WHEN the viewport width is below 768px, THE Portfolio_Site SHALL scale pixel font sizes down by 25% relative to their desktop values while maintaining a minimum of 10px rendered size.
4. THE Portfolio_Site SHALL maintain the existing responsive grid layouts: 3-column projects grid on desktop (≥1024px), 2-column on tablet (≥768px), 1-column on mobile.
5. THE Portfolio_Site SHALL not introduce horizontal scrollbars at any viewport width from 320px to 2560px.
6. WHEN a pixel-art sprite or decorative element would cause layout overflow on mobile, THE Portfolio_Site SHALL hide or reposition the element rather than allowing overflow.

---

### Requirement 17: Performance Optimization

**User Story:** As a visitor, I want the site to load quickly and animate smoothly, so that the pixel-art theme does not come at the cost of usability.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL use Next.js dynamic imports with `{ ssr: false }` for all Game_Elements components (Coin, Block, Cloud, HUD) to enable code splitting and reduce initial bundle size.
2. THE Portfolio_Site SHALL use Sprite_Sheets (single PNG files containing multiple animation frames) instead of animated GIFs for any pixel-art character or item animations.
3. THE Portfolio_Site SHALL use the Next.js `<Image>` component for all project images in the Projects section to enable automatic optimization, lazy loading, and correct `image-rendering` application.
4. WHILE the GameLayout parallax background is animating, THE Portfolio_Site SHALL use CSS `will-change: transform` on parallax layers to promote them to GPU compositing layers.
5. THE Portfolio_Site SHALL achieve a Lighthouse Performance score of 80 or above on desktop when measured on the production build.

---

### Requirement 18: Scalable Folder Structure

**User Story:** As a developer, I want the codebase organized into a clear, predictable folder structure, so that I can locate any file in under 10 seconds and onboard new contributors easily.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL organize reusable primitive UI components under `components/ui/` (PixelButton, PixelCard, PixelContainer, NotificationToast, ScrollProgress).
2. THE Portfolio_Site SHALL organize game-specific decorative components under `components/game/` (Coin, Block, Cloud, HUD).
3. THE Portfolio_Site SHALL organize layout components under `components/layout/` (GameLayout, SectionWrapper, Navbar, Footer).
4. THE Portfolio_Site SHALL organize feature sections under `features/` with one subdirectory per section: `features/hero/`, `features/skills/`, `features/projects/`, `features/contact/`.
5. THE Portfolio_Site SHALL place all custom React hooks under `hooks/` (useAnimation.ts, useTilt.tsx, and optionally useSound.ts).
6. THE Portfolio_Site SHALL place all shared utilities, constants, data, and theme configuration under `lib/` (utils.ts, constants.ts, data.ts, theme.ts).
7. THE Portfolio_Site SHALL place all global and utility CSS files under `styles/` (globals.css, pixel.css).
8. WHEN a new feature section is added in the future, THE Portfolio_Site's folder structure SHALL accommodate it by adding a new subdirectory under `features/` without restructuring existing directories.

---

### Requirement 19: Code Quality and Reusability Standards

**User Story:** As a developer, I want every component to be self-contained, well-commented, and prop-driven, so that I can reuse and extend components without reading their implementation.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL define TypeScript interfaces or types for all component props, exported from the component file or a co-located `types.ts` file.
2. THE Portfolio_Site SHALL include JSDoc comments on all exported components and hooks describing their purpose, props, and usage example.
3. THE Portfolio_Site SHALL not hardcode any color values, spacing values, or animation durations directly in component files; all such values SHALL be imported from `lib/theme.ts` or `lib/constants.ts`.
4. THE Portfolio_Site SHALL not use inline `style` props for values that are available as Theme_System tokens or Tailwind utility classes.
5. WHEN a component requires a variant-specific style, THE Portfolio_Site SHALL use a variant map (a plain object keyed by variant name) rather than a chain of `if`/`else` or ternary expressions.
6. THE Portfolio_Site SHALL preserve all existing content data in `lib/data.ts` (projects array, technicalSkills array, professionalSkills array) without modification to data values.

---

### Requirement 20: Extensibility for Future Features

**User Story:** As a developer, I want the architecture to support future additions without requiring refactoring of existing code, so that I can add a blog, admin dashboard, CMS, or game mechanics later.

#### Acceptance Criteria

1. THE Theme_System SHALL be designed so that a new theme (e.g., "underwater", "castle") can be added by defining a new palette object conforming to the existing TypeScript theme type, without modifying existing theme consumers.
2. THE SectionWrapper and PixelCard components SHALL be generic enough to wrap any future feature section or content type without modification.
3. THE GameLayout SHALL expose a context or prop API that future components can consume to read the active theme and parallax scroll position.
4. THE `features/` directory structure SHALL support adding new subdirectories (e.g., `features/blog/`, `features/achievements/`) that integrate with the existing GameLayout and SectionWrapper without structural changes.
5. WHERE a sound system is desired in the future, THE `hooks/useSound.ts` hook interface SHALL be defined (even as a stub returning no-ops) so that components can import and call it without breaking when the implementation is added later.
