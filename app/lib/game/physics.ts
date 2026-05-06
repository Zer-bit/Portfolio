/**
 * app/lib/game/physics.ts — Pure Physics Module
 *
 * Pure functions for the Mario mini-game physics engine: delta-time capping,
 * gravity application, AABB collision resolution, and horizontal clamping.
 *
 * No React or Next.js imports — all exports are pure functions suitable for
 * independent unit and property-based testing.
 *
 * @module game/physics
 */

import { aabb, type Platform } from "./utils";
import { type PlayerState } from "./player";

// Re-export PlayerState so existing imports from physics.ts continue to work.
export type { PlayerState } from "./player";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Gravitational acceleration in px/s². */
const GRAVITY = 1200;

/** Maximum allowed delta-time in seconds (prevents large position jumps on tab resume). */
const MAX_DELTA_TIME = 0.05;

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

/**
 * Result returned by `resolveAABBCollision`.
 *
 * - `resolved`: whether a collision was detected and resolved.
 * - `face`: which face of the platform was hit (`null` when `resolved` is `false`).
 * - `player`: the updated player state after resolution.
 */
export interface CollisionResult {
  resolved: boolean;
  face: "top" | "bottom" | "left" | "right" | null;
  player: PlayerState;
}

// ---------------------------------------------------------------------------
// Delta-Time Cap
// ---------------------------------------------------------------------------

/**
 * Clamps `rawDt` to at most `MAX_DELTA_TIME` (0.05 s).
 *
 * Prevents large position jumps when the browser tab loses focus and
 * `requestAnimationFrame` resumes after a long pause.
 *
 * @param rawDt - Raw delta-time in seconds since the last frame.
 * @returns Clamped delta-time, always in `[0, 0.05]`.
 *
 * @example
 * capDeltaTime(0.016) // → 0.016
 * capDeltaTime(1.0)   // → 0.05
 */
export function capDeltaTime(rawDt: number): number {
  return Math.min(rawDt, MAX_DELTA_TIME);
}

// ---------------------------------------------------------------------------
// Gravity
// ---------------------------------------------------------------------------

/**
 * Applies gravitational acceleration to a vertical velocity component.
 *
 * Positive `vy` is downward (canvas coordinate system). Gravity increases
 * `vy` by `GRAVITY * dt` each frame.
 *
 * @param vy - Current vertical velocity in px/s.
 * @param dt - Delta-time in seconds (should already be capped).
 * @returns New vertical velocity after applying gravity.
 *
 * @example
 * applyGravity(0, 0.016)   // → 19.2
 * applyGravity(-480, 0.05) // → -420
 */
export function applyGravity(vy: number, dt: number): number {
  return vy + GRAVITY * dt;
}

// ---------------------------------------------------------------------------
// Horizontal Clamping
// ---------------------------------------------------------------------------

/**
 * Clamps the player's x position so the player stays within the canvas bounds.
 *
 * The valid range is `[0, canvasWidth - width]`, ensuring the player's right
 * edge never exceeds the canvas right edge and the left edge never goes below 0.
 *
 * @param x - Current x position (left edge) in canvas pixels.
 * @param width - Player width in canvas pixels.
 * @param canvasWidth - Logical canvas width in pixels.
 * @returns Clamped x position in `[0, canvasWidth - width]`.
 *
 * @example
 * clampX(-10, 32, 800)  // → 0
 * clampX(900, 32, 800)  // → 768
 * clampX(400, 32, 800)  // → 400
 */
export function clampX(x: number, width: number, canvasWidth: number): number {
  return Math.max(0, Math.min(x, canvasWidth - width));
}

// ---------------------------------------------------------------------------
// AABB Collision Resolution
// ---------------------------------------------------------------------------

/**
 * Resolves an AABB collision between the player and a platform using the
 * Minimum Translation Vector (MTV) method.
 *
 * Resolution steps:
 * 1. Check for overlap using `aabb()`. If none, return unchanged player.
 * 2. Compute penetration depth on each axis.
 * 3. Resolve along the axis with the smaller overlap (minimum penetration).
 * 4. Push the player out, zero the corresponding velocity, and set
 *    `isGrounded = true` when the top face is resolved.
 *
 * Face detection:
 * - **top**: player was above the platform (player center Y < platform center Y) and
 *   vertical overlap is smaller → player lands on top.
 * - **bottom**: player was below the platform and vertical overlap is smaller.
 * - **left**: player center is to the left of platform center and horizontal
 *   overlap is smaller or equal.
 * - **right**: player center is to the right of platform center and horizontal
 *   overlap is smaller or equal.
 *
 * @param player - Current player state.
 * @param platform - The platform to test against.
 * @returns A `CollisionResult` with the resolved player state.
 */
export function resolveAABBCollision(
  player: PlayerState,
  platform: Platform
): CollisionResult {
  // Step 1: Early-out if there is no overlap.
  if (!aabb(player, platform)) {
    return { resolved: false, face: null, player };
  }

  // Step 2: Compute penetration depth on each axis.
  const overlapX = Math.min(
    player.x + player.width - platform.x,
    platform.x + platform.width - player.x
  );
  const overlapY = Math.min(
    player.y + player.height - platform.y,
    platform.y + platform.height - player.y
  );

  // Step 3 & 4: Resolve along the axis with the smaller overlap.
  const playerCenterX = player.x + player.width / 2;
  const playerCenterY = player.y + player.height / 2;
  const platformCenterX = platform.x + platform.width / 2;
  const platformCenterY = platform.y + platform.height / 2;

  let face: "top" | "bottom" | "left" | "right";
  let resolvedPlayer: PlayerState;

  if (overlapY < overlapX) {
    // Vertical resolution — smaller overlap is on the Y axis.
    if (playerCenterY < platformCenterY) {
      // Player was above the platform → top-face hit (landing).
      face = "top";
      resolvedPlayer = {
        ...player,
        y: platform.y - player.height,
        vy: 0,
        isGrounded: true,
      };
    } else {
      // Player was below the platform → bottom-face hit (head bump).
      face = "bottom";
      resolvedPlayer = {
        ...player,
        y: platform.y + platform.height,
        vy: 0,
      };
    }
  } else {
    // Horizontal resolution — smaller overlap is on the X axis (or equal).
    if (playerCenterX < platformCenterX) {
      // Player is to the left of the platform → left-face hit.
      face = "left";
      resolvedPlayer = {
        ...player,
        x: platform.x - player.width,
        vx: 0,
      };
    } else {
      // Player is to the right of the platform → right-face hit.
      face = "right";
      resolvedPlayer = {
        ...player,
        x: platform.x + platform.width,
        vx: 0,
      };
    }
  }

  return { resolved: true, face, player: resolvedPlayer };
}
