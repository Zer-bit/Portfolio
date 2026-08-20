import { aabb, type Platform } from "./utils";
import { type PlayerState } from "./player";

// Re-export PlayerState so existing imports from physics.ts continue to work.
export type { PlayerState } from "./player";

// Constants
// Gravitational acceleration in px/s².
const GRAVITY = 1200;

// Maximum allowed delta-time in seconds (prevents large position jumps on tab resume).
const MAX_DELTA_TIME = 0.05;

// Interfaces
// Result returned by `resolveAABBCollision`.
export interface CollisionResult {
  resolved: boolean;
  face: "top" | "bottom" | "left" | "right" | null;
  player: PlayerState;
}

// Delta-Time Cap
// Clamps `rawDt` to at most `MAX_DELTA_TIME` (0.
export function capDeltaTime(rawDt: number): number {
  return Math.min(rawDt, MAX_DELTA_TIME);
}

// Gravity
// Applies gravitational acceleration to a vertical velocity component.
export function applyGravity(vy: number, dt: number): number {
  return vy + GRAVITY * dt;
}

// Horizontal Clamping
// Clamps the player's x position so the player stays within the canvas bounds.
export function clampX(x: number, width: number, canvasWidth: number): number {
  return Math.max(0, Math.min(x, canvasWidth - width));
}

// AABB Collision Resolution
// Resolves an AABB collision between the player and a platform using the Minimum T...
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
