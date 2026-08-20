import { type Rect } from './utils';

// Constants
// Horizontal movement speed in px/s.
const MOVE_SPEED = 160;

// Initial vertical velocity applied on jump in px/s (negative = upward).
const JUMP_VELOCITY = -480;

// Player width in pixels.
const PLAYER_WIDTH = 32;

// Player height in pixels.
const PLAYER_HEIGHT = 48;

// Duration of each animation frame in seconds.
const ANIM_FRAME_DURATION = 0.1;

// Interfaces
// The full mutable state of the player character.
export interface PlayerState extends Rect {
  // Horizontal velocity in px/s.
  vx: number;
  // Vertical velocity in px/s (positive = downward).
  vy: number;
  // `true` when the player is standing on a platform.
  isGrounded: boolean;
  // `true` when the player is facing right.
  facingRight: boolean;
  // Current animation frame index: 0 or 1 for walk cycle.
  animFrame: number;
  // Seconds elapsed since the last animation frame switch.
  animTimer: number;
}

// Factory
// Creates a new `PlayerState` positioned near the left edge of the canvas, just ab...
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

// Input Handling
// Applies horizontal movement input to the player for one frame.
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

// Jump
// Applies a jump impulse to the player if they are currently grounded.
export function applyJump(player: PlayerState): PlayerState {
  if (!player.isGrounded) return player; // no-op when airborne
  return {
    ...player,
    vy: JUMP_VELOCITY,
    isGrounded: false,
  };
}

// Animation
// Advances the player's walk-cycle animation by `dt` seconds.
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
