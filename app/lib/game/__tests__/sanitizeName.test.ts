/**
 * Tests for sanitizeName helper
 *
 * Validates: Requirements 11.4
 */

import { describe, it, expect, vi } from "vitest";
import fc from "fast-check";

// Mock supabase client before importing MarioGame to avoid env var errors
vi.mock("../../../lib/supabaseClient", () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(),
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve({ data: [], error: null })),
        })),
      })),
    })),
  },
}));

import { sanitizeName } from "../../../components/game/MarioGame";

describe("sanitizeName", () => {
  // Unit tests — specific examples

  it("returns empty string for empty input", () => {
    expect(sanitizeName("")).toBe("");
  });

  it("returns the string unchanged when length is exactly 20", () => {
    const name = "A".repeat(20);
    expect(sanitizeName(name)).toBe(name);
    expect(sanitizeName(name).length).toBe(20);
  });

  it("truncates a string longer than 20 characters to 20", () => {
    const name = "A".repeat(25);
    expect(sanitizeName(name).length).toBe(20);
    expect(sanitizeName(name)).toBe("A".repeat(20));
  });

  it("returns the string unchanged when length is less than 20", () => {
    const name = "Mario";
    expect(sanitizeName(name)).toBe("Mario");
  });

  it("preserves unicode characters within the 20-char slice", () => {
    const name = "🎮".repeat(5); // each emoji is 2 code units
    const result = sanitizeName(name);
    expect(result.length).toBeLessThanOrEqual(20);
  });

  // Property 10: Player name truncation
  // **Validates: Requirements 11.4**
  it("Property 10: sanitizeName always returns at most 20 characters for any string", () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        const result = sanitizeName(s);
        return result.length === Math.min(s.length, 20);
      }),
      { numRuns: 100 }
    );
  });
});
