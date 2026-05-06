/**
 * app/lib/game/player.ts — Pure Player Module
 *
 * Defines the `PlayerState` interface and pure update functions for the
 * Mario mini-game player character.
 *
 * No React or Next.js imports — all exports are pure functions suitable for
 * independent unit and property-based testing.
 *
 * @module game/player
 */

import { type Rect } from './utils';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Horizontal movement speed in px/s. */
const MOVE_SPEED = 160;

/** Initial vertical velocity applied on jump in px/s (negative = upward). */
const JUMP_VELOCITY = -480;

/** Player width in pixels. */
const PLAYER_WIDTH = 32;

/** Player height in pixels. */
const PLAYER_HEIGHT = 48;

/** Duration of each animation frame in seconds. */
const ANIM_FRAME_DURATION = 0.1;

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

/**
 * The full mutable state of the player character.
 *
 * Extends `Rect` with velocity, grounded status, facing direction, and
 * animation state.
 */
export interface PlayerState extends Rect {
  /** Horizontal velocity in px/s. */
  vx: number;
  /** Vertical velocity in px/s (positive = downward). */
  vy: number;
  /** `true` when the player is standing on a platform. */
  isGrounded: boolean;
  /** `true` when the player is facing right. */
  facingRight: boolean;
  /** Current animation frame index: 0 or 1 for walk cycle. */
  animFrame: number;
  /** Seconds elapsed since the last animation frame switch. */
  animTimer: number;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * Creates a new `PlayerState` positioned near the left edge of the canvas,
 * just above the ground platform.
 *
 * The ground platform is assumed to be 32 px tall and flush with the bottom
 * of the canvas.
 *
 * @param canvasWidth  - Logical canvas width in pixels.
 * @param canvasHeight - Logical canvas height in pixels.
 * @returns A fresh `PlayerState` with zero velocity and default animation state.
 *
 * @example
 * const player = createPlayer(800, 450);
 * // player.x ≈ 40, player.y = 370, player.width = 32, player.height = 48
 */
export function createPlayer(canvasWidth: number, canvasHeight: number): PlayerState {
  return {
    x: Math.round(canvasWidth * 0.05),
    y: canvasHeight - 32 - PLAYER_HEIGHT, // ground is 32px tall
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    vx: 0,
    vy: 0,
    isGrounded: false,
    facingRight: true,
    animFrame: 0,
    animTimer: 0,
  };
}

// ---------------------------------------------------------------------------
// Input Handling
// ---------------------------------------------------------------------------

/**
 * Applies horizontal movement input to the player for one frame.
 *
 * Moves the player at `±MOVE_SPEED` (160 px/s) in the given direction.
 * Also updates `facingRight` based on the direction (unchanged when `direction === 0`).
 *
 * @param player    - Current player state.
 * @param direction - `-1` for left, `0` for no input, `1` for right.
 * @param dt        - Delta-time in seconds (should already be capped).
 * @returns New player state with updated `x` and `facingRight`.
 *
 * @example
 * const moved = applyHorizontalInput(player, 1, 0.016);
 * // moved.x === player.x + 160 * 0.016
 */
export function applyHorizontalInput(
  player: PlayerState,
  direction: -1 | 0 | 1,
  dt: number
): PlayerState {
  return {
    ...player,
    x: player.x + direction * MOVE_SPEED * dt,
    facingRight:
      direction === 1 ? true : direction === -1 ? false : player.facingRight,
  };
}

// ---------------------------------------------------------------------------
// Jump
// ---------------------------------------------------------------------------

/**
 * Applies a jump impulse to the player if they are currently grounded.
 *
 * Sets `vy` to `JUMP_VELOCITY` (-480 px/s) and clears `isGrounded`.
 * If the player is already airborne (`isGrounded === false`), this is a no-op
 * and the original state is returned unchanged.
 *
 * @param player - Current player state.
 * @returns New player state with jump velocity applied, or the same state if airborne.
 *
 * @example
 * const jumped = applyJump({ ...player, isGrounded: true });
 * // jumped.vy === -480, jumped.isGrounded === false
 *
 * const noOp = applyJump({ ...player, isGrounded: false });
 * // noOp === player (same reference)
 */
export function applyJump(player: PlayerState): PlayerState {
  if (!player.isGrounded) return player; // no-op when airborne
  return {
    ...player,
    vy: JUMP_VELOCITY,
    isGrounded: false,
  };
}

// ---------------------------------------------------------------------------
// Animation
// ---------------------------------------------------------------------------

/**
 * Advances the player's walk-cycle animation by `dt` seconds.
 *
 * Toggles `animFrame` between `0` and `1` every `ANIM_FRAME_DURATION` (0.1 s).
 * The `animTimer` accumulates elapsed time and resets (minus the frame duration)
 * when a frame switch occurs, preserving sub-frame precision.
 *
 * @param player - Current player state.
 * @param dt     - Delta-time in seconds.
 * @returns New player state with updated `animFrame` and `animTimer`.
 *
 * @example
 * // After 0.1 s, animFrame toggles from 0 to 1
 * const updated = updatePlayerAnimation({ ...player, animFrame: 0, animTimer: 0.09 }, 0.02);
 * // updated.animFrame === 1, updated.animTimer ≈ 0.01
 */
export function updatePlayerAnimation(player: PlayerState, dt: number): PlayerState {
  const newTimer = player.animTimer + dt;
  if (newTimer >= ANIM_FRAME_DURATION) {
    return {
      ...player,
      animFrame: player.animFrame === 0 ? 1 : 0,
      animTimer: newTimer - ANIM_FRAME_DURATION,
    };
  }
  return { ...player, animTimer: newTimer };
}
