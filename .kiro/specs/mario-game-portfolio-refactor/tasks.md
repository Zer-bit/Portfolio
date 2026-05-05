# Implementation Plan: Mario Game Portfolio Refactor

## Overview

Convert the existing single-page Mario pixel-art portfolio into a multi-page Next.js App Router application. Each portfolio section becomes its own route styled as a game world level. All existing visual tokens, components, animations, and styles are preserved — only routing architecture, page structure, and component organization change.

Implementation language: **TypeScript / Next.js (App Router)**

---

## Tasks

- [x] 1. Update constants and data layer for multi-page routing
  - Add `ROUTES` constant to `app/lib/constants.ts` mapping each route name to its path (`/`, `/world`, `/about`, `/projects`, `/skills`, `/experience`, `/contact`, `/settings`)
  - Update `NAV_LINKS` in `app/lib/constants.ts` to use the new route paths (`/world`, `/about`, `/projects`, `/skills`, `/experience`, `/contact`) with Next.js `<Link>`-compatible `href` values
  - Add a `toSlug(title: string): string` pure function to `app/lib/data.ts` (or `app/lib/constants.ts`) that converts a project title to kebab-case for use as a URL slug
  - Add experience data array to `app/lib/data.ts` (job title, company, dates, description) so the ExperiencePage has a single data source
  - _Requirements: 13.4, 17.1, 17.2, 17.3, 19.1, 19.2_

- [x] 2. Create new game components
  - [x] 2.1 Create `app/components/game/StartScreen.tsx`
    - Render developer name "JEZER PARALES" using `.pixel-text` class and `dayTheme.colors.coin`
    - Render a "PRESS START" `<PixelButton variant="coin">` that navigates to `/world` using Next.js `useRouter`
    - Add a blinking cursor/animation using existing `bounceVariant` or `fadeUpVariant` from `app/lib/animations.ts`
    - Export as both named `StartScreenComponent` and `default` dynamic (`next/dynamic`, `ssr: false`)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 14.1_

  - [x] 2.2 Create `app/components/game/GameMap.tsx`
    - Accept a `routes` prop (array from `ROUTES` constant) and render each as a `LevelNode`
    - Style each `LevelNode` using existing `PixelCard` or `PixelButton` — no new CSS classes or color values
    - Wire each `LevelNode` click to navigate to its corresponding route using Next.js `<Link>`
    - Responsive layout: single column on mobile (< 768px), grid on desktop (≥ 768px)
    - Add `aria-label` to each `LevelNode` describing its destination
    - Export as both named `GameMapComponent` and `default` dynamic (`next/dynamic`, `ssr: false`)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.7, 12.1, 14.1, 18.2, 19.4_

  - [x] 2.3 Create `app/components/game/LevelCard.tsx`
    - Accept a `project` prop (type from `app/lib/data.ts` `projects` array)
    - Display project title, tech stack tags, accent color, and thumbnail image using existing `PixelCard` styling
    - On click, navigate to `/projects/[slug]` using the `toSlug` function
    - Preserve `NotificationToast` trigger for projects with `link: "#"`
    - Add `aria-label` describing the project
    - Export as both named `LevelCardComponent` and `default` dynamic (`next/dynamic`, `ssr: false`)
    - _Requirements: 5.1, 5.2, 5.3, 5.7, 12.1, 14.1, 18.2_

  - [x] 2.4 Create `app/components/game/PlayerHUD.tsx`
    - Use the existing `HUD` component from `app/components/game/hud.tsx` as the rendering primitive
    - Read the current pathname via `usePathname()` and map it to a world label string (e.g., `/` → `"WORLD-1"`, `/world` → `"WORLD-2"`, etc.)
    - Position with `zIndex.hud` (value: 40) from `app/lib/theme.ts`
    - Export as both named `PlayerHUDComponent` and `default` dynamic (`next/dynamic`, `ssr: false`)
    - _Requirements: 10.1, 10.2, 10.3, 10.5, 12.1, 14.1_

- [x] 3. Update game component index exports
  - Update `app/components/game/index.ts` to export `StartScreen`, `GameMap`, `LevelCard`, and `PlayerHUD` alongside existing exports
  - _Requirements: 12.5, 12.6_

- [x] 4. Update GameLayout to include PlayerHUD
  - Import and render `<PlayerHUD>` inside `app/components/layout/game-layout.tsx`, positioned above the `<Navbar>` or within the page content wrapper
  - Ensure `PlayerHUD` appears on every page without per-page configuration
  - _Requirements: 10.1, 10.5_

- [x] 5. Update Navbar for multi-page routing
  - Replace anchor `href` values in `navLinks` with Next.js `<Link>` components using the new route paths from `NAV_LINKS` in `app/lib/constants.ts`
  - Use `usePathname()` to determine the active route and apply the coin-color bottom border to the matching link
  - Preserve all existing visual styles, pixel-art borders, hover effects, and responsive behavior without modification
  - _Requirements: 13.1, 13.2, 13.3, 17.3_

- [x] 6. Create the Landing Page (Start Screen)
  - Replace `app/page.tsx` content with a render of `<StartScreen>` as the primary content
  - Ensure the page is wrapped in `GameLayout` via the root `app/layout.tsx` (already in place)
  - Add Next.js `metadata` export with a unique `<title>` (e.g., "Jezer Parales | Start")
  - _Requirements: 2.1, 3.1, 3.6, 18.3_

- [x] 7. Create the World Map page
  - Create `app/world/page.tsx` rendering `<GameMap>` with the full routes array
  - Wrap in `GameLayout` (inherited from root layout)
  - Add Next.js `metadata` export with title "Jezer Parales | World Map"
  - _Requirements: 2.2, 4.1, 4.6, 18.3_

- [x] 8. Create the About page
  - Create `app/about/page.tsx`
  - Display developer name, bio, and avatar using `.pixel-text` and existing `PixelCard` components
  - Present personal attributes (role, availability, location) as gamified stat labels using existing theme color tokens
  - Include a "Hire Me" `<PixelButton variant="coin">` navigating to `/contact`
  - Include a "View Projects" `<PixelButton variant="pipe">` navigating to `/projects`
  - Add Next.js `metadata` export with title "Jezer Parales | About"
  - _Requirements: 2.3, 6.1, 6.2, 6.3, 6.4, 6.5, 18.3_

- [x] 9. Create the Projects page and dynamic Project Detail page
  - [x] 9.1 Create `app/projects/page.tsx`
    - Import all projects from `app/lib/data.ts` and render each as a `<LevelCard>` component
    - Manage `NotificationToast` state for coming-soon projects
    - Add Next.js `metadata` export with title "Jezer Parales | Projects"
    - _Requirements: 2.4, 5.1, 5.7, 17.1, 18.3_

  - [x] 9.2 Create `app/projects/[slug]/page.tsx`
    - Implement `generateStaticParams` that maps each project title to its kebab-case slug using `toSlug`
    - Look up the matching project by slug; if not found, render a pixel-art "Level Not Found" message using `.pixel-text` and `dayTheme` colors
    - Display full project description, tech stack, live link, and thumbnail for the matched project
    - Include a "Back to Projects" `<PixelButton>` navigating to `/projects`
    - Use `next/dynamic` with React Suspense for the page content
    - Add Next.js `metadata` export with the project title
    - _Requirements: 2.4, 5.3, 5.4, 5.5, 5.6, 5.8, 14.2, 17.1, 18.3_

  - [x] 9.3 Write unit tests for `toSlug` utility function
    - Test that spaces become hyphens, uppercase becomes lowercase, special characters are stripped
    - Test that `generateStaticParams` output matches `toSlug` applied to each project title
    - _Requirements: 19.1, 5.3_

- [x] 10. Checkpoint — Ensure all tests pass
  - Run `next build` to verify no TypeScript or build errors
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Create the Skills page
  - Create `app/skills/page.tsx`
  - Render the existing `<Skills>` feature component from `app/features/skills/index.tsx` without modification
  - Add Next.js `metadata` export with title "Jezer Parales | Skills"
  - _Requirements: 2.6, 7.1, 7.2, 7.3, 18.3_

- [-] 12. Create the Experience page
  - Create `app/experience/page.tsx`
  - Render experience entries from `app/lib/data.ts` in a vertical timeline layout using existing `PixelCard` components
  - Use `.pixel-text` for all headings and labels; use only existing theme color tokens
  - Add Next.js `metadata` export with title "Jezer Parales | Experience"
  - _Requirements: 2.7, 8.1, 8.2, 8.3, 8.4, 8.5, 18.3_

- [~] 13. Create the Contact page
  - Create `app/contact/page.tsx`
  - Render the existing `<ContactSection>` feature component from `app/features/contact/index.tsx` without modification
  - Add Next.js `metadata` export with title "Jezer Parales | Contact"
  - _Requirements: 2.8, 9.1, 9.2, 9.3, 18.3_

- [~] 14. Implement page transition animations
  - Create a `PageTransition` client component (or use a layout wrapper) that wraps `{children}` in a Framer Motion `motion.div` with a fade or slide animation using only existing presets from `app/lib/animations.ts` or Framer Motion built-in variants
  - Ensure transition duration does not exceed 400ms
  - Apply `PageTransition` in `app/layout.tsx` around `{children}` so all routes benefit
  - Do not modify any existing per-component animations
  - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [~] 15. Create the 404 Not Found page
  - Create `app/not-found.tsx`
  - Render a pixel-art styled 404 message using `.pixel-text`, `dayTheme` color tokens, and existing `PixelButton` with a "Go Home" link to `/`
  - _Requirements: 2.10, 18.3_

- [ ] 16. Implement optional Progress Tracker
  - Create `app/lib/progress-tracker.tsx` (React Context + `localStorage`) that records visited routes
  - Provide a `useProgressTracker` hook returning `{ visitedRoutes: string[], markVisited: (route: string) => void }`
  - Wrap the app in the `ProgressTrackerProvider` inside `app/layout.tsx`
  - Update `GameMap` to visually mark visited `LevelNode` elements as "completed" using `dayTheme.colors.coin` vs `dayTheme.colors.text`
  - Update `PlayerHUD` to pass visited route count as the `coins` prop to `<HUD>`
  - Do not modify any existing component's internal state or props
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

- [ ] 17. Create the optional Settings page
  - Create `app/settings/page.tsx`
  - Render a pixel-art settings panel using existing `PixelCard` and `PixelButton` components
  - Provide a theme toggle (day/night) that updates the `theme` prop passed to `GameLayout` via a shared context or state lifted to `app/layout.tsx`
  - Provide a sound toggle that enables/disables the existing `use-sound` hook behavior
  - Use only existing theme color tokens and CSS classes — no new design values
  - Add Next.js `metadata` export with title "Jezer Parales | Settings"
  - _Requirements: 2.9, 16.1, 16.2, 16.3, 16.4, 18.3_

- [~] 18. Accessibility and metadata audit
  - Verify all new interactive elements (`LevelNode`, `LevelCard`, navigation links) have descriptive `aria-label` attributes
  - Verify all new page routes have a unique `<title>` via Next.js `metadata` exports
  - Verify keyboard navigation (Tab, Enter, Space) works for all new interactive elements
  - Verify no existing `aria-label`, `role`, or `aria-hidden` attributes were modified
  - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_

- [~] 19. Final checkpoint — Build and verify
  - Run `next build` to confirm zero TypeScript errors and successful static generation of all project slugs
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- All new game components (`StartScreen`, `GameMap`, `LevelCard`, `PlayerHUD`) must use `next/dynamic` with `ssr: false` to match the existing pattern in `hud.tsx`
- No existing files in `app/components/game/`, `app/components/ui/`, `app/features/`, `app/lib/theme.ts`, `app/lib/animations.ts`, or `app/styles/` may be modified except as explicitly listed in a task
- All route paths must be defined as constants in `app/lib/constants.ts` — never hardcoded in components
- The `toSlug` function must be a pure function of the project title so new projects automatically receive valid slugs without additional code changes
