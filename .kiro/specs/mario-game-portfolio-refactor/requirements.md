# Requirements Document

## Introduction

This feature refactors the existing single-page Mario pixel-art portfolio website into a multi-page, game-style experience using the Next.js App Router. The current site renders all sections (Hero, Skills, Projects, Contact) on a single `app/page.tsx` using anchor-link navigation. The goal is to convert this into a structured, routed application where each section becomes its own page — styled as a game world with a landing screen, world map hub, and individual level pages — while preserving every existing visual element: colors, fonts, pixel-art sprites, animations, UI components, and the Mario theme.

No design tokens, CSS classes, component styles, or animation presets may be altered. Only the routing architecture, page structure, and component organization are in scope.

---

## Glossary

- **App_Router**: The Next.js App Router (`/app` directory) used for file-system-based routing.
- **GameLayout**: The existing `app/components/layout/game-layout.tsx` root wrapper that provides the Mario-themed parallax background, Navbar, Footer, ScrollProgress, and `GameLayoutContext`.
- **HUD**: The existing `app/components/game/hud.tsx` Heads-Up Display bar showing score, coin count, and world label.
- **LandingPage**: The new `/app/page.tsx` route — a game intro/start screen with a "Press Start" call-to-action.
- **WorldMap**: The new `/app/world/page.tsx` route — a central navigation hub styled as a game world map with clickable level nodes.
- **LevelNode**: A clickable element on the WorldMap that routes to a specific section page.
- **ProjectsPage**: The new `/app/projects/page.tsx` route — a level-selection screen listing all projects.
- **ProjectDetailPage**: The new `/app/projects/[slug]/page.tsx` dynamic route — an individual project detail page.
- **AboutPage**: The new `/app/about/page.tsx` route — a character profile screen with bio and gamified stats.
- **SkillsPage**: The new `/app/skills/page.tsx` route — a power-ups/abilities screen displaying technical and professional skills.
- **ExperiencePage**: The new `/app/experience/page.tsx` route — a game-progression timeline screen.
- **ContactPage**: The new `/app/contact/page.tsx` route — the final level / boss room contact form.
- **SettingsPage**: The optional `/app/settings/page.tsx` route — a settings screen for sound and theme toggles.
- **GameMap**: A new component (`/app/components/game/GameMap.tsx`) rendering the world map with LevelNodes.
- **LevelCard**: A new component (`/app/components/game/LevelCard.tsx`) rendering a selectable project stage card.
- **PlayerHUD**: A new component (`/app/components/game/PlayerHUD.tsx`) rendering the persistent HUD-style header across all pages.
- **StartScreen**: A new component (`/app/components/game/StartScreen.tsx`) rendering the landing page intro screen.
- **Slug**: A URL-safe, kebab-case identifier derived from a project title used in dynamic routing.
- **ProgressTracker**: An optional client-side state mechanism (Zustand or React Context) that records which pages the user has visited, styled as completed levels.
- **SectionWrapper**: The existing `app/components/layout/section-wrapper.tsx` component used to wrap page sections with consistent padding and anchor IDs.
- **PixelButton**: The existing `app/components/ui/pixel-button.tsx` component.
- **PixelCard**: The existing `app/components/ui/pixel-card.tsx` component.
- **Press_Start_2P**: The existing Google Font loaded in `app/layout.tsx` via `next/font/google`, applied globally via the `--font-press-start-2p` CSS variable.

---

## Requirements

### Requirement 1: Preserve Existing Visual Design

**User Story:** As a visitor, I want the refactored site to look identical to the current Mario pixel-art design, so that the brand identity and visual experience are not disrupted.

#### Acceptance Criteria

1. THE App_Router SHALL preserve all existing color tokens defined in `app/lib/theme.ts` (`dayTheme`, `nightTheme`) without modification.
2. THE App_Router SHALL preserve all existing CSS classes defined in `app/styles/globals.css` and `app/styles/pixel.css` without modification.
3. THE App_Router SHALL preserve all existing animation presets defined in `app/lib/animations.ts` (`bounceVariant`, `floatVariant`, `spinVariant`, `fadeUpVariant`) without modification.
4. THE App_Router SHALL preserve all existing UI components (`PixelButton`, `PixelCard`, `PixelContainer`, `ScrollProgress`, `NotificationToast`) without modification to their props, styles, or behavior.
5. THE App_Router SHALL preserve all existing game components (`Block`, `Cloud`, `Coin`, `HUD`) without modification to their props, styles, or behavior.
6. THE App_Router SHALL preserve the `Press_Start_2P` font loading configuration in `app/layout.tsx` without modification.
7. THE App_Router SHALL preserve the `GameLayout` component's parallax background layers, theme context, Navbar, Footer, and ScrollProgress without modification.

---

### Requirement 2: Multi-Page Routing Structure

**User Story:** As a visitor, I want each section of the portfolio to have its own URL, so that I can navigate directly to any section and share links.

#### Acceptance Criteria

1. THE App_Router SHALL serve the LandingPage at the `/` route.
2. THE App_Router SHALL serve the WorldMap at the `/world` route.
3. THE App_Router SHALL serve the AboutPage at the `/about` route.
4. THE App_Router SHALL serve the ProjectsPage at the `/projects` route.
5. THE App_Router SHALL serve the ProjectDetailPage at the `/projects/[slug]` dynamic route.
6. THE App_Router SHALL serve the SkillsPage at the `/skills` route.
7. THE App_Router SHALL serve the ExperiencePage at the `/experience` route.
8. THE App_Router SHALL serve the ContactPage at the `/contact` route.
9. WHERE the Settings feature is enabled, THE App_Router SHALL serve the SettingsPage at the `/settings` route.
10. IF a visitor navigates to an undefined route, THEN THE App_Router SHALL render a pixel-art styled 404 page consistent with the Mario theme.

---

### Requirement 3: Landing Page (Start Screen)

**User Story:** As a visitor, I want to land on a game intro screen when I first visit the site, so that the game-style experience begins immediately.

#### Acceptance Criteria

1. THE LandingPage SHALL render the `StartScreen` component as its primary content.
2. THE StartScreen SHALL display the developer's name ("JEZER PARALES") using the `.pixel-text` CSS class and `dayTheme.colors.coin` color token.
3. THE StartScreen SHALL display a "PRESS START" call-to-action using the existing `PixelButton` component with `variant="coin"`.
4. WHEN a visitor clicks the "PRESS START" button, THE App_Router SHALL navigate to the `/world` route.
5. THE StartScreen SHALL preserve the existing blinking cursor or animation effect consistent with the Mario title screen aesthetic using existing animation presets from `app/lib/animations.ts`.
6. THE LandingPage SHALL be wrapped in `GameLayout` via the root `app/layout.tsx` so the parallax background and Navbar are present.

---

### Requirement 4: World Map Navigation Hub

**User Story:** As a visitor, I want a central world map screen where I can see all portfolio sections as level nodes, so that navigation feels like choosing a game level.

#### Acceptance Criteria

1. THE WorldMap SHALL render the `GameMap` component displaying all available section routes as `LevelNode` elements.
2. THE GameMap SHALL display LevelNodes for: About, Projects, Skills, Experience, and Contact.
3. WHEN a visitor clicks a LevelNode, THE App_Router SHALL navigate to the corresponding route (`/about`, `/projects`, `/skills`, `/experience`, `/contact`).
4. THE GameMap SHALL style each LevelNode using existing `PixelCard` or `PixelButton` components without introducing new CSS classes or color values.
5. WHERE the ProgressTracker is enabled, THE GameMap SHALL visually distinguish visited LevelNodes from unvisited ones using existing theme color tokens.
6. THE WorldMap SHALL be wrapped in `GameLayout` so the parallax background, Navbar, and HUD are present.
7. THE GameMap SHALL be responsive, displaying LevelNodes in a single column on mobile viewports (< 768px) and in a grid layout on desktop viewports (≥ 768px).

---

### Requirement 5: Projects Page and Dynamic Routing

**User Story:** As a visitor, I want to browse projects on a level-selection screen and click into individual project detail pages, so that I can explore each project in depth.

#### Acceptance Criteria

1. THE ProjectsPage SHALL render all projects from `app/lib/data.ts` as `LevelCard` components without duplicating or modifying the project data.
2. THE LevelCard SHALL display the project title, tech stack, accent color, and thumbnail image using existing `PixelCard` styling.
3. WHEN a visitor clicks a LevelCard, THE App_Router SHALL navigate to `/projects/[slug]` where `slug` is the kebab-case version of the project title.
4. THE ProjectDetailPage SHALL display the full project description, tech stack, live link, and thumbnail for the project matching the `slug` parameter.
5. IF a visitor navigates to `/projects/[slug]` with a slug that does not match any project, THEN THE App_Router SHALL render a pixel-art styled "Level Not Found" message consistent with the Mario theme.
6. THE ProjectDetailPage SHALL include a "Back to Projects" navigation element using the existing `PixelButton` component.
7. THE ProjectsPage SHALL preserve the existing `NotificationToast` behavior for projects with `link: "#"` (not yet deployed).
8. THE App_Router SHALL generate static params for all project slugs at build time using `generateStaticParams`.

---

### Requirement 6: About Page (Character Profile)

**User Story:** As a visitor, I want an About page styled as a character profile screen, so that the developer's bio and information are presented in a gamified format.

#### Acceptance Criteria

1. THE AboutPage SHALL display the developer's name, bio, and avatar using the `.pixel-text` CSS class and existing `PixelCard` components.
2. THE AboutPage SHALL present personal attributes (e.g., role, availability, location) as gamified stat labels using existing theme color tokens.
3. THE AboutPage SHALL include a "Hire Me" call-to-action `PixelButton` with `variant="coin"` that navigates to the `/contact` route.
4. THE AboutPage SHALL include a "View Projects" `PixelButton` with `variant="pipe"` that navigates to the `/projects` route.
5. THE AboutPage SHALL be wrapped in `GameLayout` so the parallax background and Navbar are present.

---

### Requirement 7: Skills Page (Power-ups)

**User Story:** As a visitor, I want to see skills displayed as collectible power-ups, so that the skills section feels like part of the game world.

#### Acceptance Criteria

1. THE SkillsPage SHALL render the existing `Skills` feature component from `app/features/skills/index.tsx` without modification.
2. THE SkillsPage SHALL be wrapped in `GameLayout` so the parallax background and Navbar are present.
3. THE SkillsPage SHALL source all skill data exclusively from `app/lib/data.ts` (`technicalSkills`, `professionalSkills`) without duplication.

---

### Requirement 8: Experience Page (Game Progression)

**User Story:** As a visitor, I want to see my work experience displayed as a game progression timeline, so that career history is presented in a gamified format.

#### Acceptance Criteria

1. THE ExperiencePage SHALL display work experience entries in a vertical timeline layout styled as completed game levels using existing `PixelCard` components.
2. THE ExperiencePage SHALL use the `.pixel-text` CSS class for all headings and labels.
3. THE ExperiencePage SHALL use existing theme color tokens from `app/lib/theme.ts` for all colors without introducing new values.
4. THE ExperiencePage SHALL be wrapped in `GameLayout` so the parallax background and Navbar are present.
5. WHEN experience data is defined in `app/lib/data.ts`, THE ExperiencePage SHALL source all data from that file without duplication.

---

### Requirement 9: Contact Page (Final Level)

**User Story:** As a visitor, I want the contact form on its own page styled as the final level, so that reaching out feels like completing the game.

#### Acceptance Criteria

1. THE ContactPage SHALL render the existing `ContactSection` feature component from `app/features/contact/index.tsx` without modification.
2. THE ContactPage SHALL be wrapped in `GameLayout` so the parallax background and Navbar are present.
3. THE ContactPage SHALL preserve all existing form submission logic, including the Google Apps Script endpoint, `no-cors` POST mode, and success/error state management.

---

### Requirement 10: Persistent PlayerHUD Header

**User Story:** As a visitor, I want a persistent HUD-style header visible on all pages, so that the game interface feels continuous across navigation.

#### Acceptance Criteria

1. THE PlayerHUD SHALL be rendered inside `GameLayout` so it appears on every page without per-page configuration.
2. THE PlayerHUD SHALL display the current route as the world label (e.g., "WORLD-1" for `/`, "WORLD-2" for `/world`) using the existing `HUD` component's `worldLabel` prop.
3. THE PlayerHUD SHALL use the existing `HUD` component from `app/components/game/hud.tsx` as its rendering primitive.
4. WHERE the ProgressTracker is enabled, THE PlayerHUD SHALL display the count of visited pages as the coin counter using the existing `HUD` component's `coins` prop.
5. THE PlayerHUD SHALL be positioned using `zIndex.hud` (value: 40) from `app/lib/theme.ts`.

---

### Requirement 11: Page Transitions

**User Story:** As a visitor, I want smooth transitions between pages, so that navigation feels fluid and game-like.

#### Acceptance Criteria

1. THE App_Router SHALL implement page transition animations using the existing Framer Motion library already installed in `package.json`.
2. THE App_Router SHALL use only existing animation presets from `app/lib/animations.ts` or Framer Motion's built-in variants for page transitions — no new animation values shall be introduced.
3. THE App_Router SHALL NOT modify existing per-component animations (e.g., hero entrance, card stagger, coin spin).
4. WHEN a visitor navigates between routes, THE App_Router SHALL apply a fade or slide transition with a duration not exceeding 400ms.

---

### Requirement 12: Component Architecture Reorganization

**User Story:** As a developer, I want the component structure reorganized into clearly named game and UI directories, so that the codebase is easier to navigate and extend.

#### Acceptance Criteria

1. THE App_Router SHALL organize new game-specific components (`GameMap`, `LevelCard`, `PlayerHUD`, `StartScreen`) under `app/components/game/`.
2. THE App_Router SHALL preserve all existing files in `app/components/game/` (`block.tsx`, `cloud.tsx`, `coin.tsx`, `hud.tsx`, `index.ts`) without modification.
3. THE App_Router SHALL preserve all existing files in `app/components/ui/` without modification.
4. THE App_Router SHALL preserve all existing feature modules in `app/features/` (`hero`, `skills`, `projects`, `contact`) without modification.
5. THE App_Router SHALL update `app/components/game/index.ts` to export all new game components alongside existing exports.
6. WHEN a new component is added to `app/components/game/`, THE component SHALL be exported from `app/components/game/index.ts`.

---

### Requirement 13: Navigation Updates

**User Story:** As a visitor, I want the Navbar to reflect the new multi-page routing structure, so that navigation links route to the correct pages.

#### Acceptance Criteria

1. THE Navbar SHALL update navigation links to use Next.js `<Link>` components routing to `/world`, `/about`, `/projects`, `/skills`, `/experience`, and `/contact`.
2. THE Navbar SHALL preserve all existing visual styles, pixel-art borders, hover effects, and responsive behavior without modification.
3. THE Navbar SHALL highlight the active route link using an existing theme color token to indicate the current page.
4. THE App_Router SHALL update `app/lib/constants.ts` `NAV_LINKS` to reflect the new route paths.

---

### Requirement 14: Code Splitting and Performance

**User Story:** As a visitor, I want heavy sections to load quickly, so that the site remains performant as new pages are added.

#### Acceptance Criteria

1. THE App_Router SHALL use `next/dynamic` with `{ ssr: false }` for all game components that use Framer Motion animations, consistent with the existing pattern in `app/components/game/hud.tsx`.
2. THE App_Router SHALL lazy-load the `ProjectDetailPage` content using React Suspense or Next.js dynamic imports.
3. THE App_Router SHALL leverage Next.js App Router's built-in per-route code splitting so each page route is a separate JavaScript chunk.
4. THE App_Router SHALL NOT bundle all page content into a single JavaScript chunk.

---

### Requirement 15: Optional Progress Tracker

**User Story:** As a visitor, I want the site to remember which pages I've visited, styled as completed levels, so that the game progression metaphor is reinforced.

#### Acceptance Criteria

1. WHERE the ProgressTracker feature is enabled, THE ProgressTracker SHALL record each visited route in client-side state using either Zustand or React Context API.
2. WHERE the ProgressTracker feature is enabled, THE ProgressTracker SHALL persist visited routes in `localStorage` so progress is retained across browser sessions.
3. WHERE the ProgressTracker feature is enabled, THE GameMap SHALL visually mark visited LevelNodes as "completed" using an existing theme color token (e.g., `dayTheme.colors.coin` for completed, `dayTheme.colors.text` for unvisited).
4. WHERE the ProgressTracker feature is enabled, THE PlayerHUD SHALL display the visited page count as the coin counter.
5. WHERE the ProgressTracker feature is enabled, THE ProgressTracker SHALL NOT modify any existing component's internal state or props.

---

### Requirement 16: Optional Settings Page

**User Story:** As a visitor, I want a settings screen where I can toggle sound and theme, so that I can customize the experience.

#### Acceptance Criteria

1. WHERE the Settings feature is enabled, THE SettingsPage SHALL render a pixel-art styled settings panel using existing `PixelCard` and `PixelButton` components.
2. WHERE the Settings feature is enabled, THE SettingsPage SHALL provide a theme toggle that switches between `dayTheme` and `nightTheme` by updating the `theme` prop passed to `GameLayout`.
3. WHERE the Settings feature is enabled, THE SettingsPage SHALL provide a sound toggle that enables or disables the existing `use-sound` hook behavior.
4. WHERE the Settings feature is enabled, THE SettingsPage SHALL use only existing theme color tokens and CSS classes — no new design values shall be introduced.

---

### Requirement 17: Data Layer Integrity

**User Story:** As a developer, I want all page content to be sourced from the existing data layer, so that adding new projects or skills only requires updating one file.

#### Acceptance Criteria

1. THE App_Router SHALL source all project data exclusively from `app/lib/data.ts` (`projects` array) for both the ProjectsPage and ProjectDetailPage.
2. THE App_Router SHALL source all skills data exclusively from `app/lib/data.ts` (`technicalSkills`, `professionalSkills` arrays) for the SkillsPage.
3. THE App_Router SHALL source all navigation link data exclusively from `app/lib/constants.ts` (`NAV_LINKS`) for the Navbar.
4. WHEN a developer adds a new project object to the `projects` array in `app/lib/data.ts`, THE ProjectsPage SHALL automatically render the new project without any additional code changes.
5. WHEN a developer adds a new project object to the `projects` array in `app/lib/data.ts`, THE App_Router SHALL automatically generate a static route for the new project's slug via `generateStaticParams`.

---

### Requirement 18: Accessibility Preservation

**User Story:** As a visitor using assistive technology, I want the refactored site to maintain the same accessibility standards as the current site, so that the experience is inclusive.

#### Acceptance Criteria

1. THE App_Router SHALL preserve all existing `aria-label`, `role`, and `aria-hidden` attributes on existing components without modification.
2. THE App_Router SHALL ensure all new interactive elements (LevelNodes, LevelCards, navigation links) have descriptive `aria-label` attributes.
3. THE App_Router SHALL ensure all new page routes have a unique `<title>` element set via Next.js `metadata` exports.
4. THE App_Router SHALL ensure keyboard navigation (Tab, Enter, Space) works correctly for all new interactive elements.
5. THE App_Router SHALL ensure color contrast ratios for new text elements meet WCAG 2.1 AA standards using the existing theme color tokens.

---

### Requirement 19: Future-Proofing

**User Story:** As a developer, I want the routing and component structure to be extensible, so that adding new projects, pages, or features requires minimal changes.

#### Acceptance Criteria

1. THE App_Router SHALL define project slugs as a pure function of the project title (kebab-case transformation) so new projects automatically receive valid slugs.
2. THE App_Router SHALL define all route paths as constants in `app/lib/constants.ts` so route changes require updating only one file.
3. THE App_Router SHALL structure new page components to accept data as props or read from `app/lib/data.ts` directly, avoiding hardcoded content.
4. THE GameMap SHALL render LevelNodes dynamically from the route constants array so adding a new route automatically adds a new LevelNode.
5. THE App_Router SHALL NOT introduce any page-specific global CSS that would conflict with future pages.
