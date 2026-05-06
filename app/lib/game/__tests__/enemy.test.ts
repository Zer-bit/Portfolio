import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { type Enemy } from '../utils';

// Mirror of the enemy update logic from the game loop (MarioGame.tsx)
function updateEnemy(enemy: Enemy, dt: number, canvasWidth: number): Enemy {
  const newX = enemy.x + enemy.vx * dt;
  if (newX <= 0 || newX + enemy.width >= canvasWidth) {
    return {
      ...enemy,
      vx: -enemy.vx,
      x: Math.max(0, Math.min(newX, canvasWidth - enemy.width)),
    };
  }
  return { ...enemy, x: newX };
}

describe('Enemy direction reversal — property-based tests', () => {
  // Feature: mario-game-supabase, Property 11: Enemy direction reversal at canvas boundary
  // Validates: Requirements 5.2
  it('Property 11: enemy at or beyond canvas boundary has vx sign flipped after one tick', () => {
    // Generate an enemy that is AT or BEYOND the canvas boundary
    const atBoundaryArb = fc.record({
      canvasWidth: fc.float({ min: Math.fround(200), max: Math.fround(1600), noNaN: true }),
      enemyWidth: fc.float({ min: Math.fround(16), max: Math.fround(64), noNaN: true }),
      vx: fc.float({ min: Math.fround(10), max: Math.fround(200), noNaN: true }),
      dt: fc.float({ min: Math.fround(0.001), max: Math.fround(0.05), noNaN: true }),
    }).filter(({ canvasWidth, enemyWidth }) => enemyWidth < canvasWidth)
      .chain(({ canvasWidth, enemyWidth, vx, dt }) => {
        // Place enemy at right boundary: x + width >= canvasWidth
        const enemyX = canvasWidth - enemyWidth; // exactly at right edge
        const enemy: Enemy = {
          id: 'enemy-test',
          x: enemyX,
          y: 300,
          width: enemyWidth,
          height: 32,
          vx: vx, // moving right
          alive: true,
        };
        return fc.constant({ enemy, dt, canvasWidth });
      });

    fc.assert(
      fc.property(atBoundaryArb, ({ enemy, dt, canvasWidth }) => {
        const oldVx = enemy.vx;
        const result = updateEnemy(enemy, dt, canvasWidth);
        // vx sign should be flipped
        expect(result.vx).toBe(-oldVx);
      }),
      { numRuns: 100 }
    );
  });

  it('Property 11 (left boundary): enemy at left boundary has vx sign flipped', () => {
    const atLeftBoundaryArb = fc.record({
      canvasWidth: fc.float({ min: Math.fround(200), max: Math.fround(1600), noNaN: true }),
      enemyWidth: fc.float({ min: Math.fround(16), max: Math.fround(64), noNaN: true }),
      vx: fc.float({ min: Math.fround(-200), max: Math.fround(-10), noNaN: true }),
      dt: fc.float({ min: Math.fround(0.001), max: Math.fround(0.05), noNaN: true }),
    }).filter(({ canvasWidth, enemyWidth }) => enemyWidth < canvasWidth)
      .chain(({ canvasWidth, enemyWidth, vx, dt }) => {
        // Place enemy at left boundary: x <= 0
        const enemy: Enemy = {
          id: 'enemy-test',
          x: 0, // at left edge
          y: 300,
          width: enemyWidth,
          height: 32,
          vx: vx, // moving left (negative)
          alive: true,
        };
        return fc.constant({ enemy, dt, canvasWidth });
      });

    fc.assert(
      fc.property(atLeftBoundaryArb, ({ enemy, dt, canvasWidth }) => {
        const oldVx = enemy.vx;
        const result = updateEnemy(enemy, dt, canvasWidth);
        expect(result.vx).toBe(-oldVx);
      }),
      { numRuns: 100 }
    );
  });
});
