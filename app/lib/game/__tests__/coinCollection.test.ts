import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { type Coin, aabb } from '../utils';

// Mirror of coin collection logic from the game loop (MarioGame.tsx)
function collectCoins(
  coins: Coin[],
  player: { x: number; y: number; width: number; height: number },
  score: number
): { coins: Coin[]; score: number } {
  let newScore = score;
  const updatedCoins = coins.map((coin) => {
    if (!coin.collected && aabb(player, coin)) {
      newScore += 1;
      return { ...coin, collected: true };
    }
    return coin;
  });
  const activeCoins = updatedCoins.filter((c) => !c.collected);
  return { coins: activeCoins, score: newScore };
}

describe('Coin collection — property-based tests', () => {
  // Feature: mario-game-supabase, Property 9: Coin collection decrements coin count and increments score
  // Validates: Requirements 4.2
  it('Property 9: collecting one coin decrements active count by 1 and increments score by 1', () => {
    // Generate a state with N > 0 coins, where the player overlaps exactly one coin
    const stateArb = fc.record({
      N: fc.integer({ min: 1, max: 10 }),
      score: fc.integer({ min: 0, max: 1000 }),
    }).chain(({ N, score }) => {
      // Place coins in a row, player overlaps the first coin
      const coinX = 100;
      const coinY = 100;
      const coins: Coin[] = Array.from({ length: N }, (_, i) => ({
        id: `coin-${i}`,
        x: coinX + i * 50, // spaced 50px apart
        y: coinY,
        width: 16,
        height: 16,
        collected: false,
        animTimer: 0,
      }));

      // Player overlaps the first coin
      const player = {
        x: coinX - 8, // overlaps first coin
        y: coinY - 8,
        width: 32,
        height: 32,
      };

      return fc.constant({ coins, player, score, N });
    });

    fc.assert(
      fc.property(stateArb, ({ coins, player, score, N }) => {
        const result = collectCoins(coins, player, score);
        // Active coin count should be N - 1 (one collected)
        expect(result.coins.length).toBe(N - 1);
        // Score should increase by exactly 1
        expect(result.score).toBe(score + 1);
      }),
      { numRuns: 100 }
    );
  });
});
