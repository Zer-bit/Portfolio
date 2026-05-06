import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  applyHorizontalInput,
  applyJump,
  createPlayer,
  updatePlayerAnimation,
  type PlayerState,
} from '../player';

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

/** Valid delta-time values in (0, 0.05] */
const dtArb = fc.float({ min: Math.fround(0.001), max: Math.fround(0.05), noNaN: true });

/** A minimal PlayerState with configurable fields */
const playerArb = fc.record({
  x: fc.float({ min: Math.fround(0), max: Math.fround(700), noNaN: true }),
  y: fc.float({ min: Math.fround(0), max: Math.fround(500), noNaN: true }),
  width: fc.constant(32),
  height: fc.constant(48),
  vx: fc.float({ min: Math.fround(-300), max: Math.fround(300), noNaN: true }),
  vy: fc.float({ min: Math.fround(-600), max: Math.fround(600), noNaN: true }),
  isGrounded: fc.boolean(),
  facingRight: fc.boolean(),
  animFrame: fc.constantFrom(0 as const, 1 as const),
  animTimer: fc.float({ min: Math.fround(0), max: Math.fround(1), noNaN: true }),
});

/** A PlayerState that is airborne (isGrounded === false) */
const airbornePlayerArb = playerArb.map((p) => ({ ...p, isGrounded: false }));

// ---------------------------------------------------------------------------
// Unit tests — createPlayer
// ---------------------------------------------------------------------------

describe('createPlayer', () => {
  it('positions player near the left edge of the canvas', () => {
    const player = createPlayer(800, 450);
    expect(player.x).toBe(Math.round(800 * 0.05)); // 40
    expect(player.y).toBe(450 - 32 - 48); // 370
    expect(player.width).toBe(32);
    expect(player.height).toBe(48);
  });

  it('initialises with zero velocity and default animation state', () => {
    const player = createPlayer(800, 450);
    expect(player.vx).toBe(0);
    expect(player.vy).toBe(0);
    expect(player.isGrounded).toBe(false);
    expect(player.facingRight).toBe(true);
    expect(player.animFrame).toBe(0);
    expect(player.animTimer).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Unit tests — applyJump
// ---------------------------------------------------------------------------

describe('applyJump', () => {
  it('applies vy = -480 when player is grounded', () => {
    const player: PlayerState = {
      x: 40, y: 370, width: 32, height: 48,
      vx: 0, vy: 0,
      isGrounded: true,
      facingRight: true,
      animFrame: 0, animTimer: 0,
    };
    const result = applyJump(player);
    expect(result.vy).toBe(-480);
    expect(result.isGrounded).toBe(false);
  });

  it('is a no-op when player is airborne', () => {
    const player: PlayerState = {
      x: 40, y: 200, width: 32, height: 48,
      vx: 0, vy: -200,
      isGrounded: false,
      facingRight: true,
      animFrame: 0, animTimer: 0,
    };
    const result = applyJump(player);
    expect(result).toBe(player); // same reference — no-op
  });
});

// ---------------------------------------------------------------------------
// Unit tests — updatePlayerAnimation
// ---------------------------------------------------------------------------

describe('updatePlayerAnimation', () => {
  it('toggles animFrame from 0 to 1 when timer exceeds 0.1 s', () => {
    const player: PlayerState = {
      x: 0, y: 0, width: 32, height: 48,
      vx: 0, vy: 0,
      isGrounded: true, facingRight: true,
      animFrame: 0, animTimer: 0.09,
    };
    const result = updatePlayerAnimation(player, 0.02);
    expect(result.animFrame).toBe(1);
    expect(result.animTimer).toBeCloseTo(0.01, 5);
  });

  it('toggles animFrame from 1 to 0 when timer exceeds 0.1 s', () => {
    const player: PlayerState = {
      x: 0, y: 0, width: 32, height: 48,
      vx: 0, vy: 0,
      isGrounded: true, facingRight: true,
      animFrame: 1, animTimer: 0.09,
    };
    const result = updatePlayerAnimation(player, 0.02);
    expect(result.animFrame).toBe(0);
  });

  it('does not toggle animFrame when timer has not reached 0.1 s', () => {
    const player: PlayerState = {
      x: 0, y: 0, width: 32, height: 48,
      vx: 0, vy: 0,
      isGrounded: true, facingRight: true,
      animFrame: 0, animTimer: 0.05,
    };
    const result = updatePlayerAnimation(player, 0.02);
    expect(result.animFrame).toBe(0);
    expect(result.animTimer).toBeCloseTo(0.07, 5);
  });
});

// ---------------------------------------------------------------------------
// Property 3: Horizontal movement linearity
// Validates: Requirements 1.1
// ---------------------------------------------------------------------------

describe('applyHorizontalInput — property-based tests', () => {
  // Feature: mario-game-supabase, Property 3: Horizontal movement scales linearly with delta-time
  // Validates: Requirements 1.1
  it('Property 3: changes x by exactly ±160 * dt for direction ±1 and any dt ∈ (0, 0.05]', () => {
    const directionArb = fc.constantFrom(-1 as const, 1 as const);

    fc.assert(
      fc.property(playerArb, directionArb, dtArb, (player, direction, dt) => {
        const result = applyHorizontalInput(player, direction, dt);
        const expectedDx = direction * 160 * dt;
        expect(result.x).toBeCloseTo(player.x + expectedDx, 5);
      }),
      { numRuns: 100 }
    );
  });

  it('Property 3 (zero direction): x is unchanged when direction is 0', () => {
    fc.assert(
      fc.property(playerArb, dtArb, (player, dt) => {
        const result = applyHorizontalInput(player, 0, dt);
        expect(result.x).toBeCloseTo(player.x, 5);
      }),
      { numRuns: 100 }
    );
  });

  it('updates facingRight correctly based on direction', () => {
    const player: PlayerState = {
      x: 100, y: 0, width: 32, height: 48,
      vx: 0, vy: 0,
      isGrounded: true, facingRight: true,
      animFrame: 0, animTimer: 0,
    };
    expect(applyHorizontalInput(player, 1, 0.016).facingRight).toBe(true);
    expect(applyHorizontalInput(player, -1, 0.016).facingRight).toBe(false);
    // direction 0 preserves existing facingRight
    expect(applyHorizontalInput(player, 0, 0.016).facingRight).toBe(true);
    expect(applyHorizontalInput({ ...player, facingRight: false }, 0, 0.016).facingRight).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Property 4: Jump ignored when airborne
// Validates: Requirements 1.3
// ---------------------------------------------------------------------------

describe('applyJump — property-based tests', () => {
  // Feature: mario-game-supabase, Property 4: Jump is ignored when player is airborne
  // Validates: Requirements 1.3
  it('Property 4: applyJump leaves vy unchanged when isGrounded === false', () => {
    fc.assert(
      fc.property(airbornePlayerArb, (player) => {
        const result = applyJump(player);
        expect(result.vy).toBe(player.vy);
        // Should return the exact same reference (no-op)
        expect(result).toBe(player);
      }),
      { numRuns: 100 }
    );
  });
});
