import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  applyGravity,
  capDeltaTime,
  clampX,
  resolveAABBCollision,
  type PlayerState,
} from '../physics';
import { type Platform } from '../utils';

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

/** Valid delta-time values in (0, 0.05] */
const dtArb = fc.float({ min: Math.fround(0.001), max: Math.fround(0.05), noNaN: true });

/** Any finite vertical velocity */
const vyArb = fc.float({ min: Math.fround(-2000), max: Math.fround(2000), noNaN: true });

/** Any raw delta-time (including values well above the cap) */
const rawDtArb = fc.float({ min: Math.fround(0.001), max: Math.fround(10), noNaN: true });

/** A minimal PlayerState with configurable position/velocity */
const playerArb = fc.record({
  x: fc.float({ min: Math.fround(0), max: Math.fround(700), noNaN: true }),
  y: fc.float({ min: Math.fround(0), max: Math.fround(500), noNaN: true }),
  width: fc.constant(32),
  height: fc.constant(48),
  vx: fc.float({ min: Math.fround(-300), max: Math.fround(300), noNaN: true }),
  vy: fc.float({ min: Math.fround(-600), max: Math.fround(600), noNaN: true }),
  isGrounded: fc.boolean(),
  facingRight: fc.boolean(),
  animFrame: fc.constantFrom(0, 1),
  animTimer: fc.float({ min: Math.fround(0), max: Math.fround(1), noNaN: true }),
});

/** A platform with positive dimensions */
const platformArb = fc.record({
  id: fc.constant('platform-test'),
  x: fc.float({ min: Math.fround(0), max: Math.fround(600), noNaN: true }),
  y: fc.float({ min: Math.fround(0), max: Math.fround(500), noNaN: true }),
  width: fc.float({ min: Math.fround(32), max: Math.fround(200), noNaN: true }),
  height: fc.float({ min: Math.fround(16), max: Math.fround(64), noNaN: true }),
  isGround: fc.boolean(),
});

// ---------------------------------------------------------------------------
// Property 1: Gravity proportionality
// Validates: Requirements 1.4, 2.1
// ---------------------------------------------------------------------------

describe('applyGravity — property-based tests', () => {
  // Feature: mario-game-supabase, Property 1: Gravity increases vy proportionally to dt
  // Validates: Requirements 1.4, 2.1
  it('Property 1: applyGravity(vy, dt) equals vy + 1200 * dt for any vy and dt ∈ (0, 0.05]', () => {
    fc.assert(
      fc.property(vyArb, dtArb, (vy, dt) => {
        const result = applyGravity(vy, dt);
        const expected = vy + 1200 * dt;
        // Use a small epsilon for floating-point comparison
        expect(result).toBeCloseTo(expected, 5);
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 2: Delta-time cap
// Validates: Requirements 7.1, 7.2
// ---------------------------------------------------------------------------

describe('capDeltaTime — property-based tests', () => {
  // Feature: mario-game-supabase, Property 2: Delta-time cap never exceeds 0.05 seconds
  // Validates: Requirements 7.1, 7.2
  it('Property 2a: capDeltaTime(rawDt) ≤ 0.05 for any rawDt > 0', () => {
    fc.assert(
      fc.property(rawDtArb, (rawDt) => {
        const result = capDeltaTime(rawDt);
        expect(result).toBeLessThanOrEqual(0.05);
      }),
      { numRuns: 100 }
    );
  });

  it('Property 2b: capDeltaTime(rawDt) equals rawDt when rawDt ≤ 0.05', () => {
    fc.assert(
      fc.property(dtArb, (rawDt) => {
        // dtArb is already constrained to (0, 0.05]
        const result = capDeltaTime(rawDt);
        expect(result).toBeCloseTo(rawDt, 10);
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 5: Horizontal clamp validity
// Validates: Requirements 1.5, 1.6
// ---------------------------------------------------------------------------

describe('clampX — property-based tests', () => {
  // Feature: mario-game-supabase, Property 5: Horizontal position clamping always produces a valid x
  // Validates: Requirements 1.5, 1.6
  it('Property 5: clampX(x, pw, W) always returns a value in [0, W - pw] for any valid inputs', () => {
    // W > pw > 0 to ensure a valid range exists
    const validInputArb = fc.record({
      W: fc.float({ min: Math.fround(64), max: Math.fround(1600), noNaN: true }),
      pw: fc.float({ min: Math.fround(1), max: Math.fround(63), noNaN: true }),
      x: fc.float({ min: Math.fround(-500), max: Math.fround(2000), noNaN: true }),
    }).filter(({ W, pw }) => pw < W);

    fc.assert(
      fc.property(validInputArb, ({ x, pw, W }) => {
        const result = clampX(x, pw, W);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(W - pw);
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 8: Top-face collision resolution
// Validates: Requirements 2.2
// ---------------------------------------------------------------------------

describe('resolveAABBCollision — property-based tests', () => {
  // Feature: mario-game-supabase, Property 8: Top-face collision resolution positions player flush on platform
  // Validates: Requirements 2.2
  it('Property 8: after top-face resolution, player.y + player.height === platform.y and player.vy === 0', () => {
    // Construct a scenario where the player is falling from above and overlaps the platform top.
    // Player bottom edge is slightly below platform top (small vertical overlap),
    // and the horizontal overlap is larger (player is well within the platform width).
    const topFaceArb = fc.record({
      platX: fc.float({ min: Math.fround(0), max: Math.fround(500), noNaN: true }),
      platY: fc.float({ min: Math.fround(100), max: Math.fround(500), noNaN: true }),
      platW: fc.float({ min: Math.fround(80), max: Math.fround(200), noNaN: true }),
      platH: fc.float({ min: Math.fround(16), max: Math.fround(64), noNaN: true }),
      // Penetration depth: how far the player has sunk into the platform top (1–10 px)
      penetration: fc.float({ min: Math.fround(1), max: Math.fround(10), noNaN: true }),
    }).map(({ platX, platY, platW, platH, penetration }) => {
      const platform: Platform = {
        id: 'platform-test',
        x: platX,
        y: platY,
        width: platW,
        height: platH,
        isGround: false,
      };

      // Player is centered horizontally on the platform (large horizontal overlap)
      // and has sunk `penetration` pixels into the top surface.
      const playerW = 32;
      const playerH = 48;
      const player: PlayerState = {
        x: platX + platW / 2 - playerW / 2, // centered on platform
        y: platY - playerH + penetration,    // bottom edge = platY + penetration
        width: playerW,
        height: playerH,
        vx: 0,
        vy: 200, // falling downward
        isGrounded: false,
        facingRight: true,
        animFrame: 0,
        animTimer: 0,
      };

      return { player, platform };
    });

    fc.assert(
      fc.property(topFaceArb, ({ player, platform }) => {
        const result = resolveAABBCollision(player, platform);

        expect(result.resolved).toBe(true);
        expect(result.face).toBe('top');
        // Player bottom edge should be flush with platform top
        expect(result.player.y + result.player.height).toBeCloseTo(platform.y, 5);
        // Vertical velocity should be zeroed
        expect(result.player.vy).toBe(0);
        // Player should be grounded
        expect(result.player.isGrounded).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('no collision returns resolved: false and unchanged player', () => {
    // Player is clearly to the right of the platform with no overlap
    const platform: Platform = {
      id: 'p1',
      x: 0,
      y: 300,
      width: 100,
      height: 32,
      isGround: true,
    };
    const player: PlayerState = {
      x: 200,
      y: 300,
      width: 32,
      height: 48,
      vx: 0,
      vy: 0,
      isGrounded: false,
      facingRight: true,
      animFrame: 0,
      animTimer: 0,
    };

    const result = resolveAABBCollision(player, platform);
    expect(result.resolved).toBe(false);
    expect(result.face).toBeNull();
    expect(result.player).toEqual(player);
  });
});
