"use client";

/**
 * @file pixel-card.tsx — PixelCard Component
 *
 * A reusable pixel-art styled card component that wraps any content in a
 * Mario-themed container. Supports three visual variants (default, elevated,
 * flat), optional Framer Motion entrance animations via `whileInView`, and
 * an elevated hover effect.
 *
 * @example
 * // Basic usage
 * <PixelCard variant="default">
 *   <p>Some content</p>
 * </PixelCard>
 *
 * @example
 * // Elevated card with entrance animation
 * <PixelCard variant="elevated" animation="fade-up">
 *   <ProjectCard />
 * </PixelCard>
 *
 * @example
 * // Flat card with custom class
 * <PixelCard variant="flat" className="p-4">
 *   <SkillTag />
 * </PixelCard>
 */

import React from "react";
import { motion } from "framer-motion";
import { dayTheme } from "../../lib/theme";
import { type AnimationPresetName } from "../../lib/animations";
import { useAnimation } from "../../hooks/use-animation";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Props for the PixelCard component.
 */
export interface PixelCardProps {
  /**
   * Visual style variant. Determines border style, shadow, and hover behavior.
   * Defaults to `"default"` when not provided.
   */
  variant?: "default" | "elevated" | "flat";
  /**
   * Optional Framer Motion animation preset applied as an entrance animation
   * when the card enters the viewport (`whileInView`). Triggers once per page load.
   */
  animation?: AnimationPresetName;
  /**
   * Additional CSS class names to merge with the base card styles.
   */
  className?: string;
  /**
   * Additional inline styles to merge with the base card styles.
   */
  style?: React.CSSProperties;
  /**
   * Content to render inside the card container.
   */
  children: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Variant Map
// ---------------------------------------------------------------------------

/**
 * Maps each variant name to its corresponding inline style tokens sourced
 * from `lib/theme.ts`. Using a variant map instead of conditionals keeps
 * the component compliant with Requirement 19.5.
 *
 * | Variant  | Shadow        | Border              | Hover            |
 * |----------|---------------|---------------------|------------------|
 * | default  | pixel-shadow  | 2px solid border    | none             |
 * | elevated | pixel-shadow  | 4px double border   | translateY(-4px) |
 * | flat     | none          | 1px solid border    | none             |
 */
const variantStyles: Record<
  NonNullable<PixelCardProps["variant"]>,
  { style: React.CSSProperties; shadowClass: boolean }
> = {
  default: {
    style: {
      border: `2px solid ${dayTheme.colors.border}`,
    },
    shadowClass: true,
  },
  elevated: {
    style: {
      border: `4px double ${dayTheme.colors.border}`,
    },
    shadowClass: true,
  },
  flat: {
    style: {
      border: `1px solid ${dayTheme.colors.border}`,
    },
    shadowClass: false,
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * PixelCard — A pixel-art styled card container component.
 *
 * Always renders as a `motion.div` to support both `whileInView` entrance
 * animations and `whileHover` effects. The `.pixel-shadow` utility class is
 * applied by default and removed for `variant="flat"`. The `elevated` variant
 * animates upward by 4px on hover.
 *
 * @param props - {@link PixelCardProps}
 *
 * @example
 * <PixelCard variant="elevated" animation="fade-up" className="p-6">
 *   <h2>Project Title</h2>
 * </PixelCard>
 */
export function PixelCard({
  variant = "default",
  animation,
  className = "",
  style,
  children,
}: PixelCardProps) {
  // Always call the hook unconditionally (Rules of Hooks compliance).
  // The animation props are only spread onto the element when `animation` is set.
  const animationProps = useAnimation(animation ?? "fade-up");

  const { style: variantStyle, shadowClass } = variantStyles[variant];

  // Compose class names — apply pixel-shadow unless variant is "flat"
  const classes = [
    shadowClass ? "pixel-shadow" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Merge inline styles: variant → caller overrides
  const mergedStyle: React.CSSProperties = {
    ...variantStyle,
    ...style,
  };

  // Hover animation: only "elevated" variant lifts on hover
  const hoverProps =
    variant === "elevated" ? { whileHover: { y: -4 } } : {};

  // Entrance animation: only applied when `animation` prop is provided
  const entranceProps = animation
    ? {
        variants: animationProps.variants,
        initial: animationProps.initial,
        whileInView: animationProps.animate,
        viewport: { once: true },
      }
    : {};

  return (
    <motion.div
      className={classes}
      style={mergedStyle}
      {...hoverProps}
      {...entranceProps}
    >
      {children}
    </motion.div>
  );
}

export default PixelCard;
