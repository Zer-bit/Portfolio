# Implementation Plan: Question Blocks & Achievements System

Implement two interactive game-like features:
1. **Interactive site-wide Question Blocks (Feature 1)**: Flashing `[?]` blocks placed next to page headings. Clicking a block triggers a bounce, synthesizes a coin sound, pops out a spinning coin, increments the user's coins count, and permanently transforms the block into a standard hit block.
2. **Quest Log & Achievement System (Feature 4)**: A checklist of retro quests. Clicking the HUD bar toggles a classic NES-style modal overlay listing active achievements. Unlocking achievements triggers a global toast notification and a chiptune victory fanfare.

---

## User Review Required

> [!NOTE]
> All progress (visited pages, clicked blocks, recorded actions, and unlocked achievements) is persisted in `localStorage` so it survives page reloads.

> [!IMPORTANT]
> The total coins display in the header HUD will now be computed as:
> `Total Coins = Visited Main Pages (up to 6) + Hitting Question Blocks (up to 5) = Max 11 Coins`.

---

## Proposed Changes

### [Component Name] Core State & Synthesizers

#### [MODIFY] [use-sound.ts](file:///home/zer/Documents/Portfolio/app/hooks/use-sound.ts)
- Add `playBump` to synthesize a short low-frequency retro bump note (for empty blocks).
- Add `playFanfare` to synthesize a victory arpeggio (C5 -> E5 -> G5 -> C6) using sequential oscillator time triggers.

#### [MODIFY] [progress-tracker.tsx](file:///home/zer/Documents/Portfolio/app/lib/progress-tracker.tsx)
- Expand `ProgressTrackerContext` to support:
  - `clickedBlocks: string[]` (stored block IDs).
  - `unlockedAchievements: string[]` (stored completed quest IDs).
  - `recordedActions: string[]` (custom actions like settings toggles or gameplay).
  - `hitBlock(blockId: string): void`
  - `recordAction(actionId: string): void`
- Add a static list of 10 achievements:
  1. `clear-about`: Visited About Page
  2. `clear-projects`: Visited Projects Page
  3. `clear-skills`: Visited Skills Page
  4. `clear-experience`: Visited Experience Page
  5. `clear-contact`: Visited Contact Page
  6. `clear-game`: Visited Game Page
  7. `hit-first-block`: Smack a Question Block
  8. `collect-all-blocks`: Smack all 5 Question Blocks
  9. `collect-five-coins`: Accumulate 5 total coins
  10. `gamer`: Start the Mario Mini-Game or submit a high score
- Set up a `useEffect` inside `ProgressTrackerProvider` that runs whenever `visitedRoutes`, `clickedBlocks`, or `recordedActions` change.
- Evaluate achievements. If a new achievement is completed, add it to the state, trigger `playFanfare()`, and set an `activeToast` state.
- Render the `AchievementToast` overlay globally inside `ProgressTrackerProvider` so it can display anywhere.

---

### [Component Name] Layout & Navigation

#### [MODIFY] [navbar.tsx](file:///home/zer/Documents/Portfolio/app/components/layout/navbar.tsx)
- Modify the total `coins` calculation to sum visited routes + clicked blocks.
- Update `HUDStrip` to accept an `onClick` callback. Wrap it in a button structure so hovering scales it slightly and clicking toggles the Quest Log modal.
- Implement and render `QuestLogModal` as a floating fullscreen modal overlay ( NES style box with white-on-black double borders: `border: 4px double #ffffff`, chiptune text, and a quest list with checkmark states).

#### [MODIFY] [theme-context.tsx](file:///home/zer/Documents/Portfolio/app/lib/theme-context.tsx)
- Import `useProgressTracker` and call `recordAction("activate-night-mode")` in `toggleTheme()` when the theme toggles to night.

#### [MODIFY] [MarioGame.tsx](file:///home/zer/Documents/Portfolio/app/components/game/MarioGame.tsx)
- Import `useProgressTracker` and call `recordAction("play-game")` inside `handleStart()` / `handlePlayAgain()`.

---

### [Component Name] Interactive Page Blocks

#### [NEW] [QuestionBlock.tsx](file:///home/zer/Documents/Portfolio/app/components/game/QuestionBlock.tsx)
- Create a client-side retro component using dynamic SSR-free import:
  - If its specific ID is in `clickedBlocks`, render a flat brown/gray empty block.
  - If not hit, render a yellow block with flashing colors/shadows.
  - Clicking a fresh block triggers:
    - Block bounce animation (y offsets `-8px -> 0px`).
    - Spinning `Coin` component popout animation (floating upward `y: [0, -48px]`, rotating, and fading to zero opacity).
    - `hitBlock(id)` callback.

#### [MODIFY] [AboutContent.tsx](file:///home/zer/Documents/Portfolio/app/about/AboutContent.tsx)
- Place `<QuestionBlock id="block-about" />` alongside the heading title.

#### [MODIFY] [ProjectsContent.tsx](file:///home/zer/Documents/Portfolio/app/projects/ProjectsContent.tsx)
- Place `<QuestionBlock id="block-projects" />` alongside the heading title.

#### [MODIFY] [index.tsx](file:///home/zer/Documents/Portfolio/app/features/skills/index.tsx)
- Place `<QuestionBlock id="block-skills" />` alongside the heading title.

#### [MODIFY] [ExperienceContent.tsx](file:///home/zer/Documents/Portfolio/app/experience/ExperienceContent.tsx)
- Place `<QuestionBlock id="block-experience" />` alongside the heading title.

#### [MODIFY] [index.tsx](file:///home/zer/Documents/Portfolio/app/features/contact/index.tsx)
- Place `<QuestionBlock id="block-contact" />` alongside the heading title.

---

## Verification Plan

### Automated Tests
- Run unit tests to verify existing physics, routing, and data coverage is unaffected:
  `npm test`

### Manual Verification
1. **Coin Count**: Open the portfolio and visit `/world`. The HUD coin count should reflect visited page progress.
2. **Question Blocks**:
   - Navigate to `/about`, click the block. It should play the coin note, show the coin popout, turn into a gray hit block, and increment coins in the HUD.
   - Refresh the page: the block should remain in its hit (inactive) state, preserving progress.
3. **Quest Log**:
   - Click the HUD bar. The Quest Log overlay should open showing details, completed checkmarks for cleared worlds/blocks, and locked question marks for unachieved goals.
   - Click close or press Escape: the log should close.
4. **Achievements**:
   - Go to settings and switch to **Night Mode**. An achievement notification "🏆 Achievement Unlocked: NIGHT OWL!" should pop up with a victory arpeggio sound.
   - Collect all 5 question blocks. A "🏆 Achievement Unlocked: BLOCK CHAMPION!" should trigger.
