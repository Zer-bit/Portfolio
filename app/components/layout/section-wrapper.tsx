"use client";

// A standard section wrapper that applies consistent vertical padding and a `fade-...

import { motion } from "framer-motion";
import { useAnimation } from "../../hooks/use-animation";
import { dayTheme } from "../../lib/theme";

// Types
// Props for the SectionWrapper component.
export interface SectionWrapperProps {
  // Optional id forwarded to the root element for anchor-link navigation (e.g., `#skills`).
  id?: string;
  // Optional additional CSS class names to merge onto the root element.
  className?: string;
  // Background color token to apply from the Day Theme palette.
  background?: "transparent" | "ground" | "sky";
  // Section content.
  children: React.ReactNode;
}

// Background token map
// Maps the `background` prop value to the corresponding CSS color string.
const backgroundMap: Record<NonNullable<SectionWrapperProps["background"]>, string> = {
  transparent: "transparent",
  ground: dayTheme.colors.ground,
  sky: dayTheme.colors.sky,
};

// Component
// SectionWrapper Renders a `<motion.
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
