# Requirements Document

## Introduction

This feature adds a playable Super Mario-style mini-game to the existing Next.js pixel-art portfolio. The game runs on an HTML5 Canvas inside a dedicated portfolio section and integrates with Supabase to persist player scores and display a live leaderboard. The implementation must blend seamlessly with the existing Mario pixel theme, reuse established design tokens (`dayTheme`, `pixelGrid`, `zIndex`, `.pixel-text`, `.pixel-shadow`), and follow the project's component conventions (`next/dynamic` with `ssr: false`, modular file structure).

---

## Glossary

- **Game**: The Super Mario-style mini-game rendered on an HTML5 Canvas element.
- **Canvas**: The HTML5 `<canvas>` element used as the Game's rendering surface.
- **Player**: The Mario-style character controlled by the user via keyboard or on-screen controls.
- **Platform**: A solid rectangular surface (ground or floating) the Player can stand on.
- **Coin**: A collectible entity on a Platform that increases the Score when the Player touches it.
- **Enemy**: A simple moving obstacle that ends the current Game Session when the Player collides with it.
- **Score**: An integer value representing the number of Coins collected in the current Game Session.
- **Game Session**: A single play-through from game start until the Player dies or falls off-screen.
- **Physics Engine**: The module (`lib/game/physics.ts`) responsible for gravity, velocity, and collision resolution.
- **Player Module**: The module (`lib/game/player.ts`) that manages Player state, movement, and animation frames.
- **Game Utils**: The module (`lib/game/utils.ts`) containing shared helper functions (e.g., AABB collision detection, entity spawning).
- **MarioGame**: The top-level React component (`components/game/MarioGame.tsx`) that owns the Canvas, game loop, and UI overlays.
- **Leaderboard**: A ranked list of the top 10 Score entries retrieved from Supabase.
- **Supabase Client**: The singleton Supabase JS client initialised in `lib/supabaseClient.ts`.
- **Scores Table**: The `scores` table in Supabase with columns `id` (uuid, PK), `player_name` (text), `score` (integer), `created_at` (timestamp, default `now()`).
- **Player Name**: A text string entered by the user to identify their Leaderboard entry.
- **Submit Score Flow**: The sequence of UI interactions and API calls that saves a Score to the Scores Table after a Game Session ends.
- **Game Loop**: The `requestAnimationFrame`-driven update-and-render cycle that runs while the Game is active.
- **HUD Overlay**: The in-canvas score counter and lives display rendered on top of the game scene.
- **Portfolio Section**: The Next.js page or section component that hosts the MarioGame component.
- **Press Start 2P**: The pixel font already loaded globally via `globals.css`, used for all in-game text.

---

## Requirements

### Requirement 1: Player Movement

**User Story:** As a player, I want to move my character left, right, and jump, so that I can navigate the game world and collect coins.

#### Acceptance Criteria

1. WHEN the left arrow key or `A` key is held, THE Player Module SHALL move the Player left at a constant horizontal velocity of 160 px/s.
2. WHEN the right arrow key or `D` key is held, THE Player Module SHALL move the Player right at a constant horizontal velocity of 160 px/s.
3. WHEN the spacebar, up arrow key, or `W` key is pressed AND the Player is standing on a Platform, THE Player Module SHALL apply an upward vertical velocity of −480 px/s to the Player.
4. IF the Player attempts to jump WHILE already airborne, THEN THE Player Module SHALL ignore the jump input.
5. WHILE the Player is airborne, THE Physics Engine SHALL apply a downward gravitational acceleration of 1200 px/s² to the Player's vertical velocity each frame.
6. THE Player Module SHALL clamp the Player's horizontal position so the Player cannot move beyond the left or right boundary of the Canvas.

---

### Requirement 2: Gravity and Collision System

**User Story:** As a player, I want the character to fall realistically and land on platforms, so that the game feels physically consistent.

#### Acceptance Criteria

1. WHILE the Player is not standing on a Platform, THE Physics Engine SHALL apply gravity (1200 px/s²) to the Player's vertical velocity each frame.
2. WHEN the Player's bounding box overlaps the top surface of a Platform from above, THE Physics Engine SHALL set the Player's vertical velocity to 0 and position the Player flush on top of the Platform.
3. IF the Player's bounding box overlaps the bottom surface of a Platform, THEN THE Physics Engine SHALL set the Player's vertical velocity to 0 and push the Player below the Platform.
4. IF the Player's bounding box overlaps the left or right surface of a Platform, THEN THE Physics Engine SHALL stop horizontal movement and push the Player to the side of the Platform.
5. THE Game Utils SHALL expose an AABB (axis-aligned bounding box) collision detection function that accepts two rectangular entities and returns a boolean indicating overlap.

---

### Requirement 3: Platform Layout

**User Story:** As a player, I want a ground platform and floating platforms to navigate, so that the game has a traversable level structure.

#### Acceptance Criteria

1. THE MarioGame SHALL render a ground Platform spanning the full width of the Canvas at the bottom.
2. THE MarioGame SHALL render at least three floating Platforms at varying heights and horizontal positions above the ground.
3. THE MarioGame SHALL position Coins on or above Platforms so that the Player can reach every Coin by jumping.
4. WHEN the Canvas is resized, THE MarioGame SHALL recalculate Platform and Coin positions to maintain relative layout proportions.

---

### Requirement 4: Coins and Score

**User Story:** As a player, I want to collect coins and see my score increase in real time, so that I have a clear goal and feedback during play.

#### Acceptance Criteria

1. THE MarioGame SHALL render at least five Coins distributed across the Platform layout at game start.
2. WHEN the Player's bounding box overlaps a Coin, THE MarioGame SHALL remove the Coin from the active entity list and increment the Score by 1.
3. WHILE a Game Session is active, THE HUD Overlay SHALL display the current Score as an integer using the Press Start 2P font.
4. WHEN all Coins have been collected, THE MarioGame SHALL display a level-complete message and end the Game Session.
5. WHERE the `useSound` hook's `playCoin` method is available, THE MarioGame SHALL call `playCoin` each time a Coin is collected.

---

### Requirement 5: Enemy

**User Story:** As a player, I want a simple enemy that I must avoid, so that the game has a challenge beyond just collecting coins.

#### Acceptance Criteria

1. THE MarioGame SHALL render at least one Enemy on the ground Platform at game start.
2. WHILE a Game Session is active, THE Enemy SHALL move horizontally at a constant speed of 80 px/s and reverse direction when it reaches a Platform edge or Canvas boundary.
3. WHEN the Player's bounding box overlaps an Enemy from the side or below, THE MarioGame SHALL end the Game Session and trigger the death sequence.
4. WHEN the Player lands on top of an Enemy (Player's bottom edge overlaps Enemy's top edge while Player's vertical velocity is positive), THE MarioGame SHALL remove the Enemy and increment the Score by 2.
5. WHERE the `useSound` hook's `playBounce` method is available, THE MarioGame SHALL call `playBounce` when the Player defeats an Enemy by landing on it.

---

### Requirement 6: Game Session Lifecycle

**User Story:** As a player, I want the game to reset cleanly when I die or complete the level, so that I can play again without refreshing the page.

#### Acceptance Criteria

1. WHEN the Player falls below the bottom edge of the Canvas, THE MarioGame SHALL end the Game Session and trigger the death sequence.
2. WHEN a Game Session ends (death or level complete), THE MarioGame SHALL pause the Game Loop and display the Submit Score overlay.
3. WHEN the user clicks the "Play Again" button on the Submit Score overlay, THE MarioGame SHALL reset all entity positions, reset the Score to 0, and restart the Game Loop.
4. THE MarioGame SHALL track the number of lives remaining, starting at 3, and decrement by 1 each time the Player dies.
5. WHEN the Player's lives reach 0, THE MarioGame SHALL display a "Game Over" state instead of allowing an immediate restart.
6. WHILE the Game Loop is running, THE MarioGame SHALL use `requestAnimationFrame` as the sole timing mechanism for updates and rendering.

---

### Requirement 7: Game Loop Performance

**User Story:** As a developer, I want the game loop to use requestAnimationFrame with delta-time updates, so that gameplay is smooth and frame-rate independent.

#### Acceptance Criteria

1. THE Game Loop SHALL compute a delta-time value (seconds elapsed since the previous frame) each tick and pass it to all physics and movement calculations.
2. THE Game Loop SHALL cap the delta-time value at 0.05 seconds per frame to prevent large position jumps after tab-switch or focus loss.
3. THE MarioGame SHALL cancel the active `requestAnimationFrame` handle when the component unmounts to prevent memory leaks.
4. THE MarioGame SHALL not trigger React state updates inside the Game Loop; all in-loop rendering SHALL be performed directly on the Canvas context.

---

### Requirement 8: Rendering and Visual Style

**User Story:** As a player, I want the game to look like a pixel-art Mario game consistent with the portfolio's theme, so that it feels like a cohesive part of the site.

#### Acceptance Criteria

1. THE MarioGame SHALL render all game entities (Player, Platforms, Coins, Enemies) using the Canvas 2D API with pixel-art style rectangles and sprite-like shapes.
2. THE MarioGame SHALL use color tokens from `dayTheme` (imported from `app/lib/theme.ts`) for all game entity colors: sky background (`dayTheme.colors.sky`), ground (`dayTheme.colors.ground`), brick platforms (`dayTheme.colors.brick`), coins (`dayTheme.colors.coin`), pipe/enemy (`dayTheme.colors.pipe`), and player (`dayTheme.colors.mario`).
3. THE HUD Overlay SHALL render score and lives text using the Press Start 2P font via the Canvas `font` property.
4. THE MarioGame SHALL set `imageRendering: pixelated` on the Canvas element to prevent anti-aliasing.
5. WHERE the user's device pixel ratio (`window.devicePixelRatio`) is greater than 1, THE MarioGame SHALL scale the Canvas backing store to match the device pixel ratio for sharp rendering on high-DPI screens.

---

### Requirement 9: Responsive Container

**User Story:** As a user, I want the game canvas to fit within the portfolio layout on any screen size, so that I can play on both desktop and mobile.

#### Acceptance Criteria

1. THE MarioGame SHALL render the Canvas inside a responsive container that constrains the Canvas width to a maximum of 800 px and scales it down proportionally on smaller viewports.
2. THE MarioGame SHALL maintain a fixed 16:9 aspect ratio for the Canvas at all viewport widths.
3. WHEN the browser window is resized, THE MarioGame SHALL update the Canvas dimensions and recalculate all entity positions within 100 ms.
4. THE MarioGame SHALL use `pixelGrid` spacing tokens (from `app/lib/theme.ts`) for all container padding and margin values.

---

### Requirement 10: Supabase Client Setup

**User Story:** As a developer, I want a singleton Supabase client configured via environment variables, so that all database operations share a single authenticated connection.

#### Acceptance Criteria

1. THE Supabase Client SHALL be initialised once in `app/lib/supabaseClient.ts` using `createClient` from `@supabase/supabase-js`.
2. THE Supabase Client SHALL read the Supabase project URL from the `NEXT_PUBLIC_SUPABASE_URL` environment variable.
3. THE Supabase Client SHALL read the Supabase anon public key from the `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variable.
4. IF either environment variable is missing at runtime, THEN THE Supabase Client SHALL throw a descriptive error identifying which variable is absent.
5. THE Supabase Client module SHALL export a single named constant `supabase` of type `SupabaseClient`.

---

### Requirement 11: Score Submission

**User Story:** As a player, I want to submit my score with my name after a game session ends, so that my result is saved to the leaderboard.

#### Acceptance Criteria

1. WHEN a Game Session ends, THE MarioGame SHALL display a Submit Score overlay containing a Player Name text input and a "Submit Score" button.
2. WHEN the user submits a score, THE MarioGame SHALL insert a row into the Scores Table with the provided `player_name` and the final `score` value using the Supabase Client.
3. IF the `player_name` field is empty when the user clicks "Submit Score", THEN THE MarioGame SHALL display an inline validation message and SHALL NOT submit to Supabase.
4. IF the `player_name` exceeds 20 characters, THEN THE MarioGame SHALL truncate the input to 20 characters.
5. WHILE a score submission is in progress, THE MarioGame SHALL display a loading indicator and disable the "Submit Score" button to prevent duplicate submissions.
6. IF the Supabase insert operation returns an error, THEN THE MarioGame SHALL display a human-readable error message and allow the user to retry.
7. WHEN the score is successfully submitted, THE MarioGame SHALL hide the Submit Score overlay and refresh the Leaderboard data.

---

### Requirement 12: Leaderboard Display

**User Story:** As a player, I want to see the top 10 scores on a leaderboard, so that I can compare my performance with others.

#### Acceptance Criteria

1. THE MarioGame SHALL fetch the top 10 rows from the Scores Table ordered by `score` descending using the Supabase Client.
2. THE MarioGame SHALL display the Leaderboard below the Canvas, showing rank, `player_name`, and `score` for each entry.
3. WHILE Leaderboard data is loading, THE MarioGame SHALL display a loading skeleton or "Loading…" text in the Leaderboard area.
4. IF the Supabase fetch operation returns an error, THEN THE MarioGame SHALL display a "Failed to load scores" message with a retry button.
5. THE MarioGame SHALL re-fetch the Leaderboard after each successful score submission.
6. IF the Scores Table contains fewer than 10 rows, THEN THE MarioGame SHALL display only the available rows without padding.
7. THE Leaderboard SHALL use the Press Start 2P font and `dayTheme` color tokens consistent with the portfolio theme.

---

### Requirement 13: Portfolio Section Integration

**User Story:** As a visitor, I want to find the game in a clearly labelled portfolio section, so that I can easily discover and play it.

#### Acceptance Criteria

1. THE Portfolio Section SHALL be titled "PLAY MY MARIO GAME" using the Press Start 2P font and `dayTheme.colors.coin` color.
2. THE Portfolio Section SHALL contain, in order: the section title, the MarioGame Canvas, the Score display, the Submit Score overlay (shown only after a Game Session ends), and the Leaderboard.
3. THE MarioGame component SHALL be imported using `next/dynamic` with `{ ssr: false }` to prevent server-side rendering of Canvas-dependent code.
4. THE Portfolio Section SHALL be accessible via a dedicated route (`/game`) added to the Next.js `app` directory.
5. THE Portfolio Section route (`/game`) SHALL be added to the `ROUTES` constant in `app/lib/constants.ts` and to the `WORLD_LABEL_MAP` in `PlayerHUD.tsx`.

---

### Requirement 14: Component and Module Structure

**User Story:** As a developer, I want the game code organized into clearly separated modules, so that game logic, rendering, and API calls are easy to maintain independently.

#### Acceptance Criteria

1. THE MarioGame component SHALL reside at `app/components/game/MarioGame.tsx` and be responsible solely for orchestrating the Canvas, game loop, and UI overlays.
2. THE Physics Engine SHALL reside at `app/lib/game/physics.ts` and export only pure functions with no React dependencies.
3. THE Player Module SHALL reside at `app/lib/game/player.ts` and export the player state type and update functions.
4. THE Game Utils SHALL reside at `app/lib/game/utils.ts` and export shared helper functions (AABB collision, entity factory functions).
5. THE Supabase Client SHALL reside at `app/lib/supabaseClient.ts`.
6. THE MarioGame component SHALL import physics, player, and utility functions from their respective modules and SHALL NOT inline game logic directly in the component file.

---

### Requirement 15: Keyboard and Mobile Controls

**User Story:** As a player, I want to control the game with both keyboard and on-screen buttons, so that I can play on desktop and mobile devices.

#### Acceptance Criteria

1. THE MarioGame SHALL support keyboard controls: left/right arrow keys and `A`/`D` for horizontal movement; spacebar, up arrow, and `W` for jump.
2. THE MarioGame SHALL render on-screen control buttons (left, right, jump) below the Canvas on viewports narrower than 768 px.
3. WHEN an on-screen control button is pressed (`touchstart` or `mousedown`), THE MarioGame SHALL apply the corresponding movement input to the Player.
4. WHEN an on-screen control button is released (`touchend` or `mouseup`), THE MarioGame SHALL stop the corresponding movement input.
5. THE MarioGame SHALL add keyboard event listeners on mount and remove them on unmount to prevent memory leaks.

---

### Requirement 16: Accessibility

**User Story:** As a user with accessibility needs, I want the game section to have proper labels and focus management, so that I can navigate the page with assistive technologies.

#### Acceptance Criteria

1. THE Canvas element SHALL have an `aria-label` attribute describing the game (e.g., "Mario mini-game canvas").
2. THE Submit Score overlay SHALL trap focus within the overlay while it is visible.
3. THE Player Name input SHALL have an associated `<label>` element with a descriptive text.
4. THE Leaderboard table SHALL use semantic `<table>`, `<thead>`, `<tbody>`, `<th>`, and `<td>` elements with appropriate `scope` attributes.
5. THE "Submit Score" and "Play Again" buttons SHALL have descriptive `aria-label` attributes.

---

### Requirement 17: Error Handling and Loading States

**User Story:** As a player, I want clear feedback when something goes wrong or is loading, so that I understand the current state of the application.

#### Acceptance Criteria

1. WHILE the MarioGame component is loading (dynamic import), THE Portfolio Section SHALL display a pixel-art styled loading placeholder.
2. IF the Supabase Client cannot be initialised due to missing environment variables, THEN THE MarioGame SHALL display a configuration error message instead of the Canvas.
3. IF a network error occurs during score submission or Leaderboard fetch, THEN THE MarioGame SHALL display a user-readable error message using the existing `dayTheme` color tokens.
4. THE MarioGame SHALL not throw unhandled exceptions to the React error boundary; all async errors SHALL be caught and surfaced via component state.

