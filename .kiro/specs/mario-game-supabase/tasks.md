# Implementation Plan: mario-game-supabase

## Overview

Implement a playable Super Mario-style mini-game on an HTML5 Canvas at `/game`, backed by Supabase for score persistence and a live leaderboard. The work is split into pure game logic modules (testable with Vitest + fast-check), a canvas orchestrator component, Supabase integration, and route/navigation wiring.

## Tasks

- [x] 1. Install dependencies
  - Run `npm install @supabase/supabase-js` to add the Supabase JS client
  - Run `npm install --save-dev fast-check` to add the property-based testing library
  - Verify both packages appear in `package.json` dependencies
  - _Requirements: 10.1, 14.2_

- [x] 2. Create pure game utility module (`app/lib/game/utils.ts`)
  - Create the directory `app/lib/game/`
  - Define and export the `Rect`, `Platform`, `Coin`, `Enemy`, and `LevelLayout` interfaces
  - Implement and export `aabb(a: Rect, b: Rect): boolean` — AABB overlap check (exclusive of touching edges)
  - Implement and export `createPlatform`, `createCoin`, `createEnemy` factory functions
  - Implement and export `layoutLevel(canvasWidth, canvasHeight): LevelLayout` — returns ground platform, ≥3 floating platforms, ≥5 coins, ≥1 enemy with proportional positions
  - _Requirements: 2.5, 3.1, 3.2, 3.3, 4.1, 5.1, 14.4_

  - [x] 2.1 Write property tests for `utils.ts`
    - **Property 6: AABB symmetry** — `aabb(A, B) === aabb(B, A)` for any two rectangles
    - **Property 7: AABB non-overlap returns false** — rectangles separated on at least one axis always return `false`
    - **Validates: Requirements 2.5**
    - Place tests in `app/lib/game/__tests__/utils.test.ts`

- [x] 3. Create pure physics module (`app/lib/game/physics.ts`)
  - Implement and export `capDeltaTime(rawDt: number): number` — clamps to 0.05 s max
  - Implement and export `applyGravity(vy: number, dt: number): number` — returns `vy + 1200 * dt`
  - Define and export the `CollisionResult` interface
  - Implement and export `resolveAABBCollision(player: PlayerState, platform: Platform): CollisionResult` — MTV resolution with top/bottom/left/right face detection; sets `isGrounded = true` on top-face hit
  - Implement and export `clampX(x: number, width: number, canvasWidth: number): number` — keeps player within `[0, canvasWidth - width]`
  - _Requirements: 1.5, 1.6, 2.1, 2.2, 2.3, 2.4, 7.1, 7.2, 14.2_

  - [x] 3.1 Write property tests for `physics.ts`
    - **Property 1: Gravity proportionality** — `applyGravity(vy, dt)` equals `vy + 1200 * dt` for any `vy` and `dt ∈ (0, 0.05]`
    - **Property 2: Delta-time cap** — `capDeltaTime(rawDt) ≤ 0.05` for any `rawDt > 0`; equals `rawDt` when `rawDt ≤ 0.05`
    - **Property 5: Horizontal clamp validity** — `clampX(x, pw, W)` always returns a value in `[0, W - pw]` for any valid inputs
    - **Property 8: Top-face collision resolution** — after `resolveAABBCollision` for a top-face hit, `player.y + player.height === platform.y` and `player.vy === 0`
    - **Validates: Requirements 1.5, 2.1, 2.2, 7.1, 7.2**
    - Place tests in `app/lib/game/__tests__/physics.test.ts`

- [x] 4. Create pure player module (`app/lib/game/player.ts`)
  - Define and export the `PlayerState` interface (extends `Rect` with `vx`, `vy`, `isGrounded`, `facingRight`, `animFrame`, `animTimer`)
  - Implement and export `createPlayer(canvasWidth, canvasHeight): PlayerState` — positions player at a sensible start point
  - Implement and export `applyHorizontalInput(player, direction: -1 | 0 | 1, dt): PlayerState` — moves at ±160 px/s
  - Implement and export `applyJump(player): PlayerState` — applies `vy = -480` only when `isGrounded === true`; no-op when airborne
  - Implement and export `updatePlayerAnimation(player, dt): PlayerState` — toggles `animFrame` between 0 and 1 on a timer
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 14.3_

  - [x] 4.1 Write property tests for `player.ts`
    - **Property 3: Horizontal movement linearity** — `applyHorizontalInput` changes `x` by exactly `±160 * dt` for any `dt ∈ (0, 0.05]`
    - **Property 4: Jump ignored when airborne** — `applyJump` leaves `vy` unchanged when `isGrounded === false`
    - **Validates: Requirements 1.1, 1.3**
    - Place tests in `app/lib/game/__tests__/player.test.ts`

- [x] 5. Checkpoint — Ensure all pure module tests pass
  - Run `npm test` and confirm all tests in `app/lib/game/__tests__/` pass
  - Ask the user if any questions arise before proceeding to the component layer

- [x] 6. Create Supabase client (`app/lib/supabaseClient.ts`)
  - Import `createClient` and `SupabaseClient` from `@supabase/supabase-js`
  - Read `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from `process.env`
  - Throw a descriptive `Error` if either variable is missing (identify which one)
  - Export a single named constant `supabase: SupabaseClient`
  - Add a comment block with the required `.env.local` variable names (do not commit actual values)
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 14.5_

  - [x] 6.1 Write unit tests for `supabaseClient.ts`
    - Test that the module throws with a message containing `NEXT_PUBLIC_SUPABASE_URL` when that variable is absent
    - Test that the module throws with a message containing `NEXT_PUBLIC_SUPABASE_ANON_KEY` when that variable is absent
    - Mock `process.env` in each test case
    - Place tests in `app/lib/__tests__/supabaseClient.test.ts`
    - _Requirements: 10.4_

- [x] 7. Create `MarioGame.tsx` — canvas setup and game loop skeleton (`app/components/game/MarioGame.tsx`)
  - Add `"use client"` directive
  - Import `dayTheme`, `pixelGrid`, `zIndex` from `@/lib/theme`; import `useSound` from `@/hooks/use-sound`
  - Import all pure functions from `physics.ts`, `player.ts`, `utils.ts`
  - Import `supabase` from `@/lib/supabaseClient`
  - Define all TypeScript interfaces local to this file: `GameState`, `InputState`, `OverlayState`, `SubmitState`, `ScoreRow`
  - Set up refs: `canvasRef`, `gameStateRef: React.MutableRefObject<GameState>`, `rafRef`, `containerRef`
  - Set up React state: `overlayState`, `leaderboard`, `leaderboardLoading`, `leaderboardError`, `submitState`, `isMobile`
  - Implement `initGameState(canvasWidth, canvasHeight): GameState` — calls `layoutLevel`, `createPlayer`, sets `status: "idle"`, `lives: 3`, `score: 0`
  - Implement the `tick(timestamp)` game loop function following the 12-step sequence from the design (input → gravity → integrate → collide → clamp → coins → enemies → enemy update → fall-off → level-complete → render → schedule next frame); wrap in try/catch
  - Implement canvas setup in `useEffect` on mount: compute logical size from container, apply DPR scaling, call `initGameState`, attach `ResizeObserver` (debounced 100 ms), start RAF loop
  - Implement keyboard event listeners (`keydown`/`keyup`) for ArrowLeft/ArrowRight/ArrowUp/A/D/W/Space; write directly to `gameStateRef.current.inputState`
  - Implement `useEffect` cleanup: cancel RAF, remove keyboard listeners, disconnect `ResizeObserver`
  - Render the responsive 16:9 container with the `<canvas>` element (`aria-label="Mario mini-game canvas"`, `imageRendering: pixelated`)
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1–2.5, 3.1–3.4, 4.1–4.5, 5.1–5.5, 6.1–6.6, 7.1–7.4, 8.1–8.5, 9.1–9.4, 14.1, 14.6, 15.1, 15.5, 16.1_

- [x] 8. Implement canvas rendering in `MarioGame.tsx`
  - Implement `renderFrame(ctx, gs)` — painter's-algorithm render: clear → sky background → platforms → coins → enemies → player → HUD overlay
  - Use `dayTheme` color tokens for every entity: `sky` for background, `ground`/`brick` for platforms, `coin` for coins, `pipe` for enemies, `mario` for player
  - Draw player with a simple pixel-art face (eyes, cap brim) using `ctx.fillRect` calls
  - Draw enemy with a simple face using `ctx.fillRect` calls
  - Draw coin as a spinning square (toggle width on `animTimer`)
  - Render HUD text: `SCORE 000000` and `♥ × N` using `ctx.font = '10px "Press Start 2P"'` and `ctx.fillStyle = "#ffffff"`
  - Apply DPR scaling correctly so all coordinates remain in logical pixels
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 9. Implement mobile controls in `MarioGame.tsx`
  - Detect `isMobile` on mount: `window.innerWidth < 768`; update on resize
  - Implement `setInput(key, value)` helper that writes to `gameStateRef.current.inputState` without triggering React state
  - Render three `<button>` elements (◀ ▶ ▲) below the canvas when `isMobile` is true
  - Use `onPointerDown`/`onPointerUp`/`onPointerLeave` handlers on each button
  - Apply `aria-label` attributes: "Move left", "Move right", "Jump"
  - Style buttons using `pixelGrid` spacing and `pixel-text pixel-shadow` class names
  - _Requirements: 15.2, 15.3, 15.4_

- [x] 10. Implement score submission UI in `MarioGame.tsx`
  - Implement `handleSubmitScore(playerName: string, finalScore: number)` async function:
    - Validate `playerName` is non-empty; set inline error if empty (no Supabase call)
    - Truncate `playerName` to 20 characters
    - Set `submitState.loading = true`, disable button
    - Call `supabase.from("scores").insert({ player_name, score })`
    - On success: hide overlay, call `fetchLeaderboard()`
    - On error: set `submitState.error` to human-readable message, re-enable button
  - Implement `sanitizeName(s: string): string` — returns `s.slice(0, 20)`
  - Render the Submit Score overlay (shown when `overlayState.type === "submitScore"` or `"gameOver"`):
    - `<label>` + `<input maxLength={20}>` for player name with `aria-label`
    - "Submit Score" button with `aria-label="Submit Score"` and loading state
    - "Play Again" button with `aria-label="Play Again"` (resets game state, restarts loop)
    - Inline validation/error message
    - Focus trap: first focusable element receives focus when overlay appears
  - _Requirements: 6.2, 6.3, 11.1–11.7, 16.2, 16.3, 16.5_

  - [x] 10.1 Write unit tests for score submission helpers
    - Test `sanitizeName` with strings of length 0, 20, and >20 characters
    - **Property 10: Player name truncation** — `sanitizeName(s).length === Math.min(s.length, 20)` for any string `s`
    - **Validates: Requirements 11.4**
    - Place tests in `app/lib/game/__tests__/sanitizeName.test.ts`

- [x] 11. Implement leaderboard UI in `MarioGame.tsx`
  - Implement `fetchLeaderboard()` async function:
    - Set `leaderboardLoading = true`, clear `leaderboardError`
    - Query `supabase.from("scores").select(...).order("score", { ascending: false }).limit(10)`
    - On success: set `leaderboard` state
    - On error: set `leaderboardError` to `error.message`
    - Always set `leaderboardLoading = false`
  - Call `fetchLeaderboard()` in the mount `useEffect`
  - Render leaderboard below the canvas:
    - Semantic `<table>` with `<thead>`, `<tbody>`, `<th scope="col">`, `<td>` elements
    - Columns: Rank, Name, Score
    - Loading state: "LOADING…" text in Press Start 2P font
    - Error state: "FAILED TO LOAD SCORES" message + "RETRY" button
    - Use `dayTheme` color tokens and `pixel-text` class for all text
  - _Requirements: 12.1–12.7, 16.4_

- [x] 12. Checkpoint — Verify MarioGame component renders correctly
  - Run `npm run build` to confirm no TypeScript or build errors
  - Ensure all tests still pass with `npm test`
  - Ask the user if any questions arise before wiring up the route

- [x] 13. Create `/game` route page (`app/game/page.tsx`)
  - Import `dynamic` from `next/dynamic`; import `dayTheme`, `pixelGrid` from `@/lib/theme`
  - Dynamically import `MarioGame` with `{ ssr: false }` and a pixel-art styled loading fallback
  - Render a `<main>` with:
    - `<h1 className="pixel-text">` titled "PLAY MY MARIO GAME" in `dayTheme.colors.coin`
    - The dynamic `<MarioGame />` component
  - Center the layout with `pixelGrid` spacing tokens
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 17.1_

- [x] 14. Update `ROUTES` constant and navigation (`app/lib/constants.ts` and `app/components/game/PlayerHUD.tsx`)
  - Add `game: "/game"` to the `ROUTES` object in `app/lib/constants.ts`
  - Add `[ROUTES.game]: "WORLD-9"` (or next available world number) to `WORLD_LABEL_MAP` in `app/components/game/PlayerHUD.tsx`
  - Optionally add a `{ name: "Game", href: ROUTES.game, id: "game" }` entry to `NAV_LINKS` in `app/lib/constants.ts` if the game should appear in the navigation
  - _Requirements: 13.5_

- [ ] 15. Integration and accessibility polish
  - [x] 15.1 Verify canvas `aria-label` is present and correct
    - Confirm `<canvas aria-label="Mario mini-game canvas">` is rendered in the DOM
    - _Requirements: 16.1_

  - [x] 15.2 Verify leaderboard uses semantic table markup
    - Confirm `<table>`, `<thead>`, `<tbody>`, `<th scope="col">`, `<td>` are used
    - Confirm `<th scope="row">` is used for rank cells
    - _Requirements: 16.4_

  - [x] 15.3 Verify error handling paths
    - Confirm `MarioGame` renders a configuration error message (not the canvas) when Supabase env vars are absent — test by temporarily removing vars or checking the error boundary path in code
    - Confirm all async errors in `fetchLeaderboard` and `handleSubmitScore` are caught and surfaced via state (no unhandled rejections)
    - _Requirements: 17.2, 17.3, 17.4_

  - [x] 15.4 Write property test for enemy direction reversal
    - **Property 11: Enemy direction reversal at canvas boundary** — after one update tick, an enemy at or beyond the canvas boundary has its `vx` sign flipped
    - **Validates: Requirements 5.2**
    - Place test in `app/lib/game/__tests__/enemy.test.ts`

  - [x] 15.5 Write property test for coin collection state transition
    - **Property 9: Coin collection decrements coin count and increments score** — after collecting one coin from a state with N > 0 coins, active coin count is N − 1 and score increases by 1
    - **Validates: Requirements 4.2**
    - Place test in `app/lib/game/__tests__/coinCollection.test.ts`

- [x] 16. Final checkpoint — Ensure all tests pass and build succeeds
  - Run `npm test` and confirm all test suites pass
  - Run `npm run build` and confirm no TypeScript errors or build failures
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Checkpoints (tasks 5, 12, 16) ensure incremental validation at key milestones
- Property tests validate universal correctness properties across randomized inputs; unit tests validate specific examples and edge cases
- The Supabase `scores` table DDL (from the design document) must be run manually in the Supabase dashboard before score submission will work
- `.env.local` must be created manually with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` — never commit this file (it is already in `.gitignore`)
- All game state mutations happen via `gameStateRef` — `setState` is never called inside the RAF callback
