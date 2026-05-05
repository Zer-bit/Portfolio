/**
 * Unit tests for `toSlug` utility and `generateStaticParams` output.
 * Validates: Requirements 19.1, 5.3
 */
import { describe, it, expect } from "vitest";
import { toSlug, projects } from "../data";

// ---------------------------------------------------------------------------
// toSlug — core transformation tests
// ---------------------------------------------------------------------------

describe("toSlug", () => {
  it("converts spaces to hyphens and lowercases the string", () => {
    expect(toSlug("Hello World")).toBe("hello-world");
  });

  it("lowercases an all-uppercase name", () => {
    expect(toSlug("JEZER PARALES")).toBe("jezer-parales");
  });

  it("handles a multi-word title with mixed case", () => {
    expect(toSlug("Inspire Holdings Incorporated")).toBe(
      "inspire-holdings-incorporated"
    );
  });

  it("handles an acronym-prefixed title", () => {
    expect(toSlug("SHS Club Management System")).toBe(
      "shs-club-management-system"
    );
  });

  it("returns a single lowercase word unchanged", () => {
    expect(toSlug("jezsic")).toBe("jezsic");
  });

  it("strips special characters (punctuation)", () => {
    expect(toSlug("Hello, World!")).toBe("hello-world");
  });

  it("collapses multiple spaces into a single hyphen", () => {
    expect(toSlug("Hello   World")).toBe("hello-world");
  });

  it("strips leading and trailing whitespace", () => {
    expect(toSlug("  hello world  ")).toBe("hello-world");
  });
});

// ---------------------------------------------------------------------------
// generateStaticParams — output matches toSlug applied to each project title
// ---------------------------------------------------------------------------

describe("generateStaticParams", () => {
  /**
   * Replicates the logic from app/projects/[slug]/page.tsx so the test
   * validates the contract without importing Next.js server-only code.
   * Validates: Requirements 5.3, 19.1
   */
  it("produces a slug for every project", () => {
    const params = projects.map((p) => ({ slug: toSlug(p.title) }));
    expect(params).toHaveLength(projects.length);
    params.forEach(({ slug }) => {
      expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    });
  });

  it("matches the expected slugs for all known projects", () => {
    const params = projects.map((p) => ({ slug: toSlug(p.title) }));
    const slugs = params.map((p) => p.slug);

    expect(slugs).toContain("inspire-holdings-incorporated");
    expect(slugs).toContain("ipageant-inspire");
    expect(slugs).toContain("shs-club-management-system");
    expect(slugs).toContain("jezsic");
    expect(slugs).toContain("youtube-mp3-api");
    expect(slugs).toContain("inspire-book-slider");
  });

  it("each slug is unique (no two projects share a slug)", () => {
    const slugs = projects.map((p) => toSlug(p.title));
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });
});
