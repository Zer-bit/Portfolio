"use client";

/**
 * @file section-wrapper.tsx — SectionWrapper
 *
 * A standard section wrapper that applies consistent vertical padding and a
 * `fade-up` entrance animation when the section scrolls into view. Accepts an
 * optional `background` prop to apply a Mario-themed background color from the
 * Day Theme palette, and an `id` prop for anchor-link navigation.
 *
 * @example
 * ```tsx
 * <SectionWrapper id="skills" background="sky" className="relative">
 *   <SkillsContent />
 * </SectionWrapper>
 * ```
 */

import { motion } from "framer-motion";
import { useAnimation } from "../../hooks/use-animation";
import { dayTheme } from "../../lib/theme";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Props for the SectionWrapper component.
 */
export interface SectionWrapperProps {
  /** Optional id forwarded to the root element for anchor-link navigation (e.g., `#skills`). */
  id?: string;
  /** Optional additional CSS class names to merge onto the root element. */
  className?: string;
  /**
   * Background color token to apply from the Day Theme palette.
   * - `"transparent"` — no background color (default)
   * - `"ground"` — `dayTheme.colors.ground` (#c84b0c)
   * - `"sky"` — `dayTheme.colors.sky` (#5c94fc)
   */
  background?: "transparent" | "ground" | "sky";
  /** Section content. */
  children: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Background token map
// ---------------------------------------------------------------------------

/**
 * Maps the `background` prop value to the corresponding CSS color string.
 * Uses `dayTheme.colors` tokens so the values stay in sync with the theme.
 */
const backgroundMap: Record<NonNullable<SectionWrapperProps["background"]>, string> = {
  transparent: "transparent",
  ground: dayTheme.colors.ground,
  sky: dayTheme.colors.sky,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * SectionWrapper
 *
 * Renders a `<motion.section>` with:
 * - `py-16 md:py-24` vertical padding for consistent section rhythm
 * - A `fade-up` entrance animation that triggers once when the section enters
 *   the viewport (`whileInView` + `viewport={{ once: true }}`)
 * - An optional background color from the Day Theme palette
 * - The `id` prop forwarded to the root element for anchor-link navigation
 *
 * @param props - {@link SectionWrapperProps}
 *
 * @example
 * ```tsx
 * <SectionWrapper id="projects" background="ground">
 *   <ProjectsGrid />
 * </SectionWrapper>
 * ```
 */
export function SectionWrapper({
  id,
  className,
  background = "transparent",
  children,
}: SectionWrapperProps) {
  const { variants, initial } = useAnimation("fade-up");

  const bgColor = backgroundMap[background];

  return (
    <motion.section
      id={id}
      className={`py-16 md:py-24${className ? ` ${className}` : ""}`}
      style={{ backgroundColor: bgColor }}
      variants={variants}
      initial={initial}
      whileInView="visible"
      viewport={{ once: true }}
    >
      {children}
    </motion.section>
  );
}
