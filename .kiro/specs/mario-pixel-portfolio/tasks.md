# Implementation Tasks: Mario Pixel Portfolio

## Task Overview

Tasks are ordered by dependency — foundation first, then primitives, then layout, then features. Each task references the requirements it satisfies.

---

- [x] 1. Set up folder structure and move CSS files
  - Create `app/styles/` directory and move `app/globals.css` to `app/styles/globals.css`
  - Update the import in `app/layout.tsx` from `"./globals.css"` to `"./styles/globals.css"`
  - Create empty placeholder files: `app/styles/pixel.css`, `app/lib/theme.ts`, `app/lib/animations.ts`
  - Create empty placeholder files: `app/hooks/use-animation.ts`, `app/hooks/use-sound.ts`
  - Create empty index files for new directories: `app/components/game/`, `app/features/hero/`, `app/features/skills/`, `app/features/projects/`, `app/features/contact/`
  - **Requirement:** 18

- [x] 2. Implement `lib/theme.ts` — Centralized Theme System
  - Define `ThemeType` TypeScript interface with `colors` (sky, ground, brick, coin, pipe, mario, text, bg, border) and `name` fields
  - Implement `dayTheme` object with all Day_Theme color tokens: sky `#5c94fc`, ground `#c84b0c`, brick `#d07030`, coin `#f8b800`, pipe `#00a800`, mario `#e40058`, text `#ffffff`
  - Implement `nightTheme` object as a complete alternative palette conforming to `ThemeType`
  - Export `pixelGrid` spacing scale: `px1=4px` through `px16=64px`
  - Export `zIndex` named layers: `background=0`, `ground=10`, `entities=20`, `ui=30`, `hud=40`, `overlay=50`, `modal=60`
  - Add JSDoc comments on all exports
  - **Requirement:** 1, 19, 20

- [x] 3. Implement `lib/animations.ts` — Animation Presets
  - Import `Variants` type from `framer-motion`
  - Implement `bounceVariant`: Y axis 0 → -8 → 0, spring easing, `repeat: Infinity`
  - Implement `floatVariant`: Y axis 0 → -6 → 0, 3-second duration, `repeat: Infinity`, ease `"easeInOut"`
  - Implement `spinVariant`: rotate 0 → 360, 1-second linear duration, `repeat: Infinity`
  - Implement `fadeUpVariant`: initial `{ opacity: 0, y: 20 }`, animate `{ opacity: 1, y: 0 }`, 0.5s ease-out
  - Export `AnimationPresetName` union type: `"bounce" | "float" | "spin" | "fade-up"`
  - Export a `presets` map keyed by `AnimationPresetName` for lookup
  - Add JSDoc comments on all exports
  - **Requirement:** 15, 19

- [x] 4. Implement `styles/pixel.css` — Pixel-Art CSS Foundation
  - Add `@import url(...)` for "Press Start 2P" from Google Fonts
  - Apply `image-rendering: pixelated; image-rendering: crisp-edges;` to all `img` and `canvas` elements
  - Define CSS custom properties `--pixel-border` (2px solid) and `--pixel-border-emphasis` (4px double)
  - Implement `.pixel-shadow` utility: multi-layer `box-shadow` with 4px offsets, zero blur radius, using `#000`
  - Implement `.pixel-text` utility: pixel font family, `-webkit-font-smoothing: none`, `letter-spacing: 0.05em`
  - Add `@media (max-width: 767px)` rule scaling `.pixel-text` font-size down by 25%, minimum 10px
  - Import `pixel.css` in `app/styles/globals.css`
  - **Requirement:** 2, 16

- [x] 5. Implement `hooks/use-animation.ts` — Animation Hook
  - Accept `preset: AnimationPresetName` parameter
  - Look up the corresponding variant from `lib/animations.ts` presets map
  - Return object with `variants`, `initial: "hidden"`, `animate: "visible"`, and `transition` ready to spread onto a `motion.*` element
  - Export `useAnimation` as named export with JSDoc comment
  - **Requirement:** 15, 19

- [x] 6. Implement `hooks/use-sound.ts` — Sound Hook Stub
  - Define interface with `playBounce`, `playCoin`, `playPipe` methods (all `() => void`)
  - Return no-op implementations for all three methods
  - Export `useSound` as named export with JSDoc comment noting it is a stub
  - **Requirement:** 20

- [x] 7. Implement `components/ui/pixel-button.tsx` — PixelButton
  - Define `PixelButtonProps` interface extending `React.ButtonHTMLAttributes<HTMLButtonElement>` with `variant`, `size`, and `animation` props
  - Create variant map for `brick`, `coin`, `pipe` using color tokens from `lib/theme.ts`
  - Create size map for `sm`, `md`, `lg` using `pixelGrid` values from `lib/theme.ts`
  - Apply `.pixel-shadow` and `.pixel-text` CSS classes by default
  - Implement disabled state: `opacity-50 pointer-events-none` when `disabled={true}`
  - Implement active/pressed state: pixel shadow shifts down 2px on `:active`
  - Default `variant` to `"brick"` when not provided
  - Wrap in `motion.button` and apply animation preset via `useAnimation` when `animation` prop is set
  - Forward all standard HTML button props to the underlying `<button>` element
  - Export `PixelButton` with JSDoc comment
  - **Requirement:** 3, 19

- [x] 8. Implement `components/ui/pixel-card.tsx` — PixelCard
  - Define `PixelCardProps` interface with `variant`, `animation`, `className`, `style`, and `children` props
  - Create variant map for `default`, `elevated`, `flat` using theme border and shadow tokens
  - Apply `.pixel-shadow` by default; remove it for `variant="flat"`
  - Implement `variant="elevated"` hover: `whileHover={{ y: -4 }}` Framer Motion prop
  - Apply entrance animation via `useAnimation` + `whileInView` when `animation` prop is provided
  - Accept and merge `className` and `style` props without overriding base styles
  - Export `PixelCard` with JSDoc comment
  - **Requirement:** 4, 19

- [x] 9. Implement `components/ui/pixel-container.tsx` — PixelContainer
  - Define `PixelContainerProps` interface with `fullWidth`, `className`, `as`, and `children` props
  - Apply `max-w-[1280px] mx-auto px-6 md:px-8` by default
  - Remove `max-w-[1280px]` when `fullWidth={true}`, retain padding
  - Render as the element specified by `as` prop (default `"div"`)
  - Export `PixelContainer` with JSDoc comment
  - **Requirement:** 5, 19

- [x] 10. Implement `components/game/coin.tsx` — Coin Component
  - Create pixel-art SVG coin (yellow/gold square with pixel highlight details)
  - Accept `size` prop (default: 24)
  - Apply `spinVariant` from `lib/animations.ts` via `motion.div` wrapper for continuous spin
  - Export as default with dynamic import wrapper (`next/dynamic`, `{ ssr: false }`)
  - Add JSDoc comment
  - **Requirement:** 6, 17

- [x] 11. Implement `components/game/block.tsx` — Block Component
  - Accept `variant: "question" | "brick"` and `size` props
  - Render pixel-art SVG for each variant: `?` block (brown/orange with `?` character) and brick block (brick pattern)
  - On click of `variant="question"`: trigger `bounceVariant` animation via local state
  - Export as default with dynamic import wrapper (`next/dynamic`, `{ ssr: false }`)
  - Add JSDoc comment
  - **Requirement:** 6, 17

- [x] 12. Implement `components/game/cloud.tsx` — Cloud Component
  - Render pixel-art cloud shape using CSS or SVG (white/light blue pixel blocks)
  - Accept `size` prop (`"sm" | "md" | "lg"`) and `style` prop for positioning
  - Apply `floatVariant` from `lib/animations.ts` continuously via `motion.div`
  - Export as default with dynamic import wrapper (`next/dynamic`, `{ ssr: false }`)
  - Add JSDoc comment
  - **Requirement:** 6, 17

- [x] 13. Implement `components/game/hud.tsx` — HUD Component
  - Accept `score`, `coins`, and `worldLabel` props (worldLabel default: `"PORTFOLIO-1"`)
  - Render pixel-art styled bar with score counter, coin counter (Coin component + number), and world label
  - Apply `.pixel-text` class and theme coin/text colors from `lib/theme.ts`
  - Export as default with dynamic import wrapper (`next/dynamic`, `{ ssr: false }`)
  - Add JSDoc comment
  - **Requirement:** 6, 17

- [x] 14. Implement `components/layout/game-layout.tsx` — GameLayout
  - Define `GameLayoutContext` with `theme: "day" | "night"` and `scrollY: number`
  - Accept `theme` prop (default: `"day"`) and `children`
  - Apply active theme's CSS custom properties to root `div` element
  - Implement three parallax layers (sky, clouds, ground) using Framer Motion `useScroll` + `useTransform`
  - Apply `will-change: transform` to all parallax layer elements
  - Render Cloud components in the cloud parallax layer; limit to ≤3 on mobile (viewport < 768px)
  - Render Block platform strip in the ground layer
  - Wrap `<Navbar>`, `<ScrollProgress>`, `<Footer>`, and `children` within the themed context
  - Export `GameLayoutContext` and `GameLayout` with JSDoc comments
  - **Requirement:** 7, 17, 20

- [x] 15. Implement `components/layout/section-wrapper.tsx` — SectionWrapper
  - Accept `id`, `className`, `background`, and `children` props
  - Apply `py-16 md:py-24` padding
  - Apply `fade-up` entrance animation via `useAnimation("fade-up")` + `whileInView={{ once: true }}`
  - Apply background color from `dayTheme.colors` based on `background` prop (`"transparent"`, `"ground"`, `"sky"`)
  - Forward `id` prop to root element for anchor-link navigation
  - Export `SectionWrapper` with JSDoc comment
  - **Requirement:** 8, 19

- [x] 16. Restyle `components/layout/navbar.tsx` — Navbar
  - Replace `<Sparkles>` icon with `<Coin size={16}>` in the logo area
  - Apply `.pixel-text` class to the "JEZER." logo text
  - Replace `layoutId="activeNav"` highlight with a pixel-art block cursor (2px solid bottom border using theme coin color)
  - Preserve scroll-based background transition behavior (transparent → opaque)
  - Restyle mobile menu overlay: add pixel borders, apply `.pixel-text` to link text, add Mario decorative elements
  - Ensure mobile nav link font renders at minimum 32px
  - Preserve all nav links, href values, and anchor-link behavior
  - **Requirement:** 13

- [x] 17. Restyle `components/layout/footer.tsx` — Footer
  - Apply `.pixel-text` class to "JEZER." logo
  - Apply theme coin color to the "." in the logo
  - Add a row of `<Block variant="brick">` components along the top edge of the footer
  - Apply theme ground color as footer background
  - Preserve copyright text content
  - **Requirement:** 14

- [x] 18. Restyle `components/ui/scroll-progress.tsx` — ScrollProgress
  - Replace `strokeLinecap="round"` with `strokeLinecap="square"` for pixel-art styling
  - Apply theme coin color to the progress stroke and theme border color to the background circle
  - When `scrollProgress >= 100`, render `<Coin>` or a pixel star SVG instead of the percentage text
  - Preserve existing scroll tracking logic and fixed positioning
  - **Requirement:** 14

- [x] 19. Restyle `components/ui/notification-toast.tsx` — NotificationToast
  - Replace `<AlertCircle>` icon with `<Coin>` component
  - Apply `.pixel-shadow` and 2px solid pixel border to the toast container
  - Apply `.pixel-text` class to the message text
  - Preserve auto-close timer (1300ms), progress bar animation, and close button behavior
  - **Requirement:** 11

- [x] 20. Implement `features/hero/index.tsx` — Hero Section
  - Migrate logic from `app/components/sections/hero.tsx`
  - Display "Jezer Parales" name using `.pixel-text` font styled as a Mario title card
  - Add pixel-art character sprite (SVG or PNG sprite sheet) positioned right on desktop, centered on mobile
  - Replace "Hire Me" anchor with `<PixelButton variant="coin">` linking to `#contact`
  - Replace "View Work" anchor with `<PixelButton variant="pipe">` linking to `#projects`
  - Add horizontal row of `<Block variant="brick">` at the bottom of the section as a ground platform
  - Restyle "Available for projects" badge as a pixel-art HUD badge using theme colors and `.pixel-text`
  - Wire scroll-down arrow to smooth scroll to `#skills` on click
  - Wrap section in `<SectionWrapper id="home">`
  - **Requirement:** 9

- [x] 21. Implement `features/skills/index.tsx` — Skills Section
  - Migrate logic from `app/components/sections/skills.tsx`
  - Import `technicalSkills` and `professionalSkills` from `lib/data.ts` (no data changes)
  - Render each technical skill category as `<PixelCard variant="elevated">` with power-up icon badge
  - Render individual skill tags as `<PixelButton variant="coin" size="sm">` with `tabIndex={-1}` (non-interactive)
  - Render each professional skill as `<PixelCard variant="default">` preserving icon and description layout
  - Apply staggered entrance: `transition={{ delay: index * 0.1 }}` per card
  - Wrap section in `<SectionWrapper id="skills">`
  - **Requirement:** 10

- [x] 22. Implement `features/projects/index.tsx` — Projects Section
  - Migrate logic from `app/components/sections/projects.tsx`
  - Import `projects` from `lib/data.ts` (no data changes)
  - Replace `bg-white/80 rounded-3xl` card with `<PixelCard variant="elevated">`
  - Replace `<img>` tags with Next.js `<Image>` component for all project images
  - Render tech stack tags as `<PixelButton variant="brick" size="sm">` with `tabIndex={-1}` (non-interactive)
  - Render "Live Project" / "Coming Soon" link as `<PixelButton variant="coin" size="sm">`
  - Preserve `useTilt` hook on project cards
  - Preserve `NotificationToast` behavior for `link="#"` projects
  - Preserve hover overlay with full description; add pixel-art scrollbar class
  - Preserve 3-col / 2-col / 1-col responsive grid
  - Wrap section in `<SectionWrapper id="projects">`
  - **Requirement:** 11, 17

- [x] 23. Implement `features/contact/index.tsx` — Contact Section
  - Migrate logic from `app/components/sections/contact.tsx`
  - Replace `bg-white/80 rounded-[2rem]` form container with `<PixelCard variant="elevated">`
  - Apply `.pixel-shadow` and theme border tokens to all form inputs (name, email, message)
  - Replace "Send Message" button with `<PixelButton variant="coin" size="lg">`
  - Preserve form submission logic: Google Apps Script URL, `no-cors` POST, success/error state management
  - Replace success state `<CheckCircle2>` with pixel-art dialogue box containing `<Coin>` animation
  - Replace loading `<Loader2>` spinner with `<Coin>` spinning animation
  - Restyle social links (GitHub, LinkedIn, Instagram, Viber) as pixel-art icon buttons using theme colors
  - Preserve email address and all `href` values
  - Wrap section in `<SectionWrapper id="contact">`
  - **Requirement:** 12

- [x] 24. Update `app/layout.tsx` — Root Layout
  - Add Google Fonts import for "Press Start 2P" via `next/font/google` or `<link>` tag
  - Import `GameLayout` and wrap the body content with `<GameLayout theme="day">`
  - Update CSS import path from `"./globals.css"` to `"./styles/globals.css"`
  - Preserve existing `<Metadata>`, `scroll-smooth`, and `overflow-x-hidden` settings
  - **Requirement:** 2, 7

- [-] 25. Update `app/page.tsx` — Main Page
  - Replace imports from `app/components/sections/*` with imports from `app/features/*/index`
  - Replace `<Footer>` import source to `app/components/layout/footer`
  - Ensure section order is preserved: Hero → Skills → Projects → Contact → Footer
  - Remove hardcoded `bg-[#f0f0f0]` background (now handled by GameLayout)
  - **Requirement:** 7, 18

- [~] 26. Responsive design audit and pixel scaling
  - Verify all sections render without horizontal scrollbars at 320px viewport width
  - Confirm pixel font scales down 25% on mobile (< 768px) with minimum 10px rendered size
  - Confirm project grid is 3-col (≥1024px), 2-col (≥768px), 1-col (mobile)
  - Hide or reposition any decorative elements that cause overflow on mobile
  - Confirm all pixel-art images and sprites have `image-rendering: pixelated` applied
  - **Requirement:** 16

- [~] 27. Performance audit
  - Confirm all game components (Coin, Block, Cloud, HUD) use `next/dynamic` with `{ ssr: false }`
  - Confirm `will-change: transform` is applied to all parallax layers in GameLayout
  - Confirm all project images use `<Image>` from `next/image`
  - Confirm no animated GIFs are used; sprite sheets or CSS animations only
  - Run `next build` and verify no TypeScript or build errors
  - **Requirement:** 17
