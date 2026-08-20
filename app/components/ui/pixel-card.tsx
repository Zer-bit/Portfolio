"use client";

// A reusable pixel-art styled card component that wraps any content in a Mario-the...

import React from "react";
import { motion } from "framer-motion";
import { dayTheme } from "../../lib/theme";
import { type AnimationPresetName } from "../../lib/animations";
import { useAnimation } from "../../hooks/use-animation";

// Types
// Props for the PixelCard component.
export interface PixelCardProps {
  // Visual style variant.
  variant?: "default" | "elevated" | "flat";
  // Optional Framer Motion animation preset applied as an entrance animation when th...
  animation?: AnimationPresetName;
  // Additional CSS class names to merge with the base card styles.
  className?: string;
  // Additional inline styles to merge with the base card styles.
  style?: React.CSSProperties;
  // Content to render inside the card container.
  children: React.ReactNode;
}

// Variant Map
// Maps each variant name to its corresponding inline style tokens sourced from `li...
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

// Component
// PixelCard — A pixel-art styled card container component.
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
