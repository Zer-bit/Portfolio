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
  // Ground platform — full width, 32 px tall, flush with the bottom edge.
  // -------------------------------------------------------------------------
  const groundY = canvasHeight - PLATFORM_HEIGHT_GROUND;
  const ground = createPlatform(0, groundY, canvasWidth, PLATFORM_HEIGHT_GROUND, true);
  platforms.push(ground);

  // -------------------------------------------------------------------------
  // Floating platforms — 4 platforms at proportional positions.
  //
  // Heights are distributed across the upper 60 % of the canvas so the player
  // can reach every platform with a single jump from the ground or from another
  // platform.
  //
  // Layout (all values are fractions of canvas dimensions):
  //   P1: x=0.05, y=0.65, w=0.20
  //   P2: x=0.35, y=0.50, w=0.20
  //   P3: x=0.60, y=0.35, w=0.20
  //   P4: x=0.20, y=0.25, w=0.20
  // -------------------------------------------------------------------------
  const floatingDefs: Array<{ xFrac: number; yFrac: number; wFrac: number }> = [
    { xFrac: 0.05, yFrac: 0.65, wFrac: 0.20 },
    { xFrac: 0.35, yFrac: 0.50, wFrac: 0.20 },
    { xFrac: 0.60, yFrac: 0.35, wFrac: 0.20 },
    { xFrac: 0.20, yFrac: 0.25, wFrac: 0.20 },
  ];

  const floatingPlatforms: Platform[] = floatingDefs.map(({ xFrac, yFrac, wFrac }) =>
    createPlatform(
      Math.round(xFrac * canvasWidth),
      Math.round(yFrac * canvasHeight),
      Math.round(wFrac * canvasWidth),
      PLATFORM_HEIGHT_FLOATING,
      false
    )
  );
  platforms.push(...floatingPlatforms);

  // -------------------------------------------------------------------------
  // Coins — 2 coins on each of the first 3 floating platforms + 1 on the 4th.
  // Total: 7 coins (≥ 5 required).
  //
  // Each coin is placed centred horizontally on its platform, slightly above
  // the platform surface so it is visually distinct.
  // -------------------------------------------------------------------------
  const coinOffsets: Array<{ platIndex: number; xOffsetFrac: number }> = [
    // Platform 0 (P1)
    { platIndex: 0, xOffsetFrac: 0.25 },
    { platIndex: 0, xOffsetFrac: 0.65 },
    // Platform 1 (P2)
    { platIndex: 1, xOffsetFrac: 0.25 },
    { platIndex: 1, xOffsetFrac: 0.65 },
    // Platform 2 (P3)
    { platIndex: 2, xOffsetFrac: 0.25 },
    { platIndex: 2, xOffsetFrac: 0.65 },
    // Platform 3 (P4)
    { platIndex: 3, xOffsetFrac: 0.45 },
  ];

  for (const { platIndex, xOffsetFrac } of coinOffsets) {
    const plat = floatingPlatforms[platIndex];
    const coinX = Math.round(plat.x + xOffsetFrac * plat.width - COIN_SIZE / 2);
    // Place coin 8 px above the platform surface.
    const coinY = plat.y - COIN_SIZE - 8;
    coins.push(createCoin(coinX, coinY));
  }

  // -------------------------------------------------------------------------
  // Enemy — 1 enemy on the ground platform, starting near the centre.
  // -------------------------------------------------------------------------
  const enemyX = Math.round(canvasWidth * 0.55);
  const enemyY = groundY - ENEMY_SIZE;
  enemies.push(createEnemy(enemyX, enemyY));

  // -------------------------------------------------------------------------
  // Player start — above the ground platform, near the left edge.
  // -------------------------------------------------------------------------
  const playerStart = {
    x: Math.round(canvasWidth * 0.05),
    y: groundY - 48, // 48 px above ground (player height is typically 32–48 px)
  };

  return { platforms, coins, enemies, playerStart };
}
