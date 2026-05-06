/**
 * app/lib/game/utils.ts — Game Utility Module
 *
 * Pure helper functions for the Mario mini-game: AABB collision detection,
 * entity factory functions, and level layout generation.
 *
 * No React or Next.js imports — all exports are pure functions suitable for
 * independent unit and property-based testing.
 *
 * @module game/utils
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Enemy horizontal speed in px/s. */
export const ENEMY_SPEED = 80;

/** Coin dimensions in pixels. */
export const COIN_SIZE = 16;

/** Enemy dimensions in pixels. */
export const ENEMY_SIZE = 32;

/** Floating platform height in pixels. */
export const PLATFORM_HEIGHT_FLOATING = 16;

/** Ground platform height in pixels. */
export const PLATFORM_HEIGHT_GROUND = 32;

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

/**
 * Base axis-aligned bounding box used by all game entities and collision
 * detection functions.
 */
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * A solid rectangular surface the player can stand on.
 * The ground platform spans the full canvas width; floating platforms are
 * narrower and positioned at varying heights.
 */
export interface Platform extends Rect {
  id: string;
  /** `true` for the full-width ground platform, `false` for floating ones. */
  isGround: boolean;
}

/**
 * A collectible entity that increments the score when the player touches it.
 */
export interface Coin extends Rect {
  id: string;
  /** `true` once the player has collected this coin. */
  collected: boolean;
  /** Seconds elapsed since last animation frame switch (for spin animation). */
  animTimer: number;
}

/**
 * A simple moving obstacle. Reverses direction at platform edges and canvas
 * boundaries. Ends the game session on side/bottom collision with the player.
 */
export interface Enemy extends Rect {
  id: string;
  /** Horizontal velocity in px/s (sign encodes direction). */
  vx: number;
  /** `false` once the player has defeated this enemy by landing on it. */
  alive: boolean;
}

/**
 * The complete set of entities returned by `layoutLevel()` to initialise a
 * fresh game world.
 */
export interface LevelLayout {
  platforms: Platform[];
  coins: Coin[];
  enemies: Enemy[];
  playerStart: { x: number; y: number };
}

// ---------------------------------------------------------------------------
// AABB Collision Detection
// ---------------------------------------------------------------------------

/**
 * Returns `true` if rectangles `a` and `b` overlap.
 *
 * Uses strict inequality so that touching edges (zero-width overlap) are NOT
 * considered a collision. This matches the requirement for exclusive-edge AABB.
 *
 * @example
 * ```ts
 * aabb({ x: 0, y: 0, width: 10, height: 10 }, { x: 5, y: 5, width: 10, height: 10 }); // true
 * aabb({ x: 0, y: 0, width: 10, height: 10 }, { x: 10, y: 0, width: 10, height: 10 }); // false (touching)
 * ```
 */
export function aabb(a: Rect, b: Rect): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// ---------------------------------------------------------------------------
// Entity Factory Functions
// ---------------------------------------------------------------------------

/** Internal counter for generating unique entity IDs. */
let _idCounter = 0;

/** Resets the internal ID counter (useful in tests). */
export function resetIdCounter(): void {
  _idCounter = 0;
}

/**
 * Creates a `Platform` entity with the given position and dimensions.
 *
 * @param x - Left edge in canvas pixels.
 * @param y - Top edge in canvas pixels.
 * @param w - Width in canvas pixels.
 * @param h - Height in canvas pixels.
 * @param isGround - Whether this is the full-width ground platform.
 */
export function createPlatform(
  x: number,
  y: number,
  w: number,
  h: number,
  isGround = false
): Platform {
  return {
    id: `platform-${++_idCounter}`,
    x,
    y,
    width: w,
    height: h,
    isGround,
  };
}

/**
 * Creates a `Coin` entity centred at the given position.
 *
 * The coin is 16×16 px. The provided `x` and `y` are the top-left corner.
 *
 * @param x - Left edge in canvas pixels.
 * @param y - Top edge in canvas pixels.
 */
export function createCoin(x: number, y: number): Coin {
  return {
    id: `coin-${++_idCounter}`,
    x,
    y,
    width: COIN_SIZE,
    height: COIN_SIZE,
    collected: false,
    animTimer: 0,
  };
}

/**
 * Creates an `Enemy` entity at the given position.
 *
 * The enemy is 32×32 px and starts moving in the positive-x direction.
 *
 * @param x - Left edge in canvas pixels.
 * @param y - Top edge in canvas pixels.
 * @param speed - Horizontal speed in px/s (defaults to `ENEMY_SPEED`).
 */
export function createEnemy(x: number, y: number, speed = ENEMY_SPEED): Enemy {
  return {
    id: `enemy-${++_idCounter}`,
    x,
    y,
    width: ENEMY_SIZE,
    height: ENEMY_SIZE,
    vx: speed,
    alive: true,
  };
}

// ---------------------------------------------------------------------------
// Level Layout
// ---------------------------------------------------------------------------

/**
 * Generates a complete level layout proportional to the given canvas dimensions.
 *
 * Layout guarantees:
 * - 1 ground platform spanning the full canvas width at the bottom.
 * - ≥ 3 floating platforms at varying heights and horizontal positions.
 * - ≥ 5 coins distributed across the platforms.
 * - ≥ 1 enemy on the ground platform.
 * - Player start position above the ground platform, near the left edge.
 *
 * All positions are expressed as fractions of `canvasWidth`/`canvasHeight` so
 * the layout scales correctly when the canvas is resized.
 *
 * @param canvasWidth  - Logical canvas width in pixels.
 * @param canvasHeight - Logical canvas height in pixels.
 */
export function layoutLevel(
  canvasWidth: number,
  canvasHeight: number
): LevelLayout {
  // Reset ID counter so layouts are deterministic across resets.
  resetIdCounter();

  const platforms: Platform[] = [];
  const coins: Coin[] = [];
  const enemies: Enemy[] = [];

  // -------------------------------------------------------------------------
  // Ground platform — full width, flush with the bottom edge.
  // -------------------------------------------------------------------------
  const groundY = canvasHeight - PLATFORM_HEIGHT_GROUND;
  const ground = createPlatform(0, groundY, canvasWidth, PLATFORM_HEIGHT_GROUND, true);
  platforms.push(ground);

  // -------------------------------------------------------------------------
  // Jump height calculation (used for mobile staircase layout).
  // Physics: jumpVelocity = 550 * scale, gravity = 1200 * scale
  // Max jump height = v² / (2g) = 550² / (2 * 1200) * scale ≈ 126 * scale px
  // -------------------------------------------------------------------------
  const scale = canvasHeight / 450;
  const maxJumpPx = (550 * 550) / (2 * 1200) * scale;
  const safeStep = Math.round(maxJumpPx * 0.68);

  // Mobile: canvas narrower than 500px logical width
  const isMobileLayout = canvasWidth < 500;

  // Platform width: wider on mobile so they're easier to land on
  const platW = isMobileLayout
    ? Math.round(Math.max(canvasWidth * 0.28, 64))
    : Math.round(canvasWidth * 0.20);

  let floatingPlatforms: Platform[];

  if (isMobileLayout) {
    // -----------------------------------------------------------------------
    // MOBILE — staircase layout: each platform is exactly one safe jump above
    // the previous, alternating left/right so the player chains jumps.
    // -----------------------------------------------------------------------
    const minY = Math.round(canvasHeight * 0.08);

    const p1Y = Math.max(minY, groundY - safeStep);
    const p2Y = Math.max(minY, p1Y - safeStep);
    const p3Y = Math.max(minY, p2Y - safeStep);
    const p4Y = Math.max(minY, p3Y - safeStep);

    const mobileDefs: Array<{ x: number; y: number }> = [
      { x: Math.round(canvasWidth * 0.04), y: p1Y },           // low-left
      { x: Math.round(canvasWidth * 0.55), y: p2Y },           // mid-right
      { x: Math.round(canvasWidth * 0.18), y: p3Y },           // mid-left
      { x: Math.round(canvasWidth * 0.58), y: p4Y },           // high-right
    ];

    floatingPlatforms = mobileDefs.map(({ x, y }) =>
      createPlatform(x, y, platW, PLATFORM_HEIGHT_FLOATING, false)
    );
  } else {
    // -----------------------------------------------------------------------
    // DESKTOP — original proportional layout with varied heights.
    // -----------------------------------------------------------------------
    const desktopDefs: Array<{ xFrac: number; yFrac: number }> = [
      { xFrac: 0.05, yFrac: 0.65 },
      { xFrac: 0.35, yFrac: 0.50 },
      { xFrac: 0.60, yFrac: 0.35 },
      { xFrac: 0.20, yFrac: 0.25 },
    ];

    floatingPlatforms = desktopDefs.map(({ xFrac, yFrac }) =>
      createPlatform(
        Math.round(xFrac * canvasWidth),
        Math.round(yFrac * canvasHeight),
        platW,
        PLATFORM_HEIGHT_FLOATING,
        false
      )
    );
  }

  platforms.push(...floatingPlatforms);

  // -------------------------------------------------------------------------
  // Coins — 2 per platform (1 on the last), placed just above the surface.
  // -------------------------------------------------------------------------
  const coinOffsets: Array<{ platIndex: number; xOffsetFrac: number }> = [
    { platIndex: 0, xOffsetFrac: 0.25 },
    { platIndex: 0, xOffsetFrac: 0.65 },
    { platIndex: 1, xOffsetFrac: 0.25 },
    { platIndex: 1, xOffsetFrac: 0.65 },
    { platIndex: 2, xOffsetFrac: 0.25 },
    { platIndex: 2, xOffsetFrac: 0.65 },
    { platIndex: 3, xOffsetFrac: 0.45 },
  ];

  for (const { platIndex, xOffsetFrac } of coinOffsets) {
    const plat = floatingPlatforms[platIndex];
    const coinX = Math.round(plat.x + xOffsetFrac * plat.width - COIN_SIZE / 2);
    const coinY = plat.y - COIN_SIZE - 6;
    coins.push(createCoin(coinX, coinY));
  }

  // -------------------------------------------------------------------------
  // Enemy — on the ground, right side, away from player start.
  // -------------------------------------------------------------------------
  const enemyX = Math.round(canvasWidth * 0.60);
  const enemyY = groundY - ENEMY_SIZE;
  enemies.push(createEnemy(enemyX, enemyY));

  // -------------------------------------------------------------------------
  // Player start — left edge, just above ground.
  // -------------------------------------------------------------------------
  const playerStart = {
    x: Math.round(canvasWidth * 0.05),
    y: groundY - 48,
  };

  return { platforms, coins, enemies, playerStart };
}
