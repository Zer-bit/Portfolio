import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import { aabb } from '../utils';

// Arbitrary for a Rect with positive dimensions
const rectArb = fc.record({
  x: fc.float({ min: -500, max: 500, noNaN: true }),
  y: fc.float({ min: -500, max: 500, noNaN: true }),
  width: fc.float({ min: 1, max: 200, noNaN: true }),
  height: fc.float({ min: 1, max: 200, noNaN: true }),
});

describe('aabb — property-based tests', () => {
  // Feature: mario-game-supabase, Property 6: AABB symmetry
  // Validates: Requirements 2.5
  it('Property 6: aabb(A, B) === aabb(B, A) for any two rectangles', () => {
    fc.assert(
      fc.property(rectArb, rectArb, (a, b) => {
        return aabb(a, b) === aabb(b, a);
      }),
      { numRuns: 100 }
    );
  });

  // Feature: mario-game-supabase, Property 7: AABB non-overlap returns false
  // Validates: Requirements 2.5
  it('Property 7: rectangles separated on at least one axis always return false', () => {
    // Generate two rectangles guaranteed NOT to overlap by separating them on the x-axis.
    // Rect A ends at (ax + aw), rect B starts at (ax + aw + gap) where gap >= 1.
    const separatedRectsArb = fc.record({
      ax: fc.float({ min: -400, max: 300, noNaN: true }),
      ay: fc.float({ min: -400, max: 400, noNaN: true }),
      aw: fc.float({ min: 1, max: 100, noNaN: true }),
      ah: fc.float({ min: 1, max: 100, noNaN: true }),
      gap: fc.float({ min: 1, max: 100, noNaN: true }),
      bw: fc.float({ min: 1, max: 100, noNaN: true }),
      bh: fc.float({ min: 1, max: 100, noNaN: true }),
      by: fc.float({ min: -400, max: 400, noNaN: true }),
    }).map(({ ax, ay, aw, ah, gap, bw, bh, by }) => {
      const a = { x: ax, y: ay, width: aw, height: ah };
      // B starts exactly where A ends plus the gap — guaranteed no x-axis overlap
      const b = { x: ax + aw + gap, y: by, width: bw, height: bh };
      return { a, b };
    });

    fc.assert(
      fc.property(separatedRectsArb, ({ a, b }) => {
        return aabb(a, b) === false;
      }),
      { numRuns: 100 }
    );
  });
});
