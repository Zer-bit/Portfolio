/**
 * @file animations.ts — Animation Presets
 *
 * Centralized Framer Motion variant definitions for the Mario Pixel Portfolio.
 * No component should define its own animation inline — import from here instead.
 *
 * @example
 * import { bounceVariant } from "@/lib/animations";
 * <motion.div variants={bounceVariant} initial="initial" animate="animate" />
 */

import { type Variants } from "framer-motion";

// ---------------------------------------------------------------------------
// Bounce Variant
// ---------------------------------------------------------------------------

/**
 * Bounce animation preset.
 *
 * Moves the element along the Y axis: 0 → -8px → 0, using a spring easing,
 * repeating infinitely. Ideal for coins, interactive icons, and call-to-action
 * elements that need to draw attention.
 *
 * @example
 * <motion.div variants={bounceVariant} initial="initial" animate="animate" />
 */
export const bounceVariant: Variants = {
  initial: { y: 0 },
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 0.6,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop",
    },
  },
};

// ---------------------------------------------------------------------------
// Float Variant
// ---------------------------------------------------------------------------

/**
 * Float animation preset.
 *
 * Moves the element along the Y axis: 0 → -6px → 0 with a sinusoidal
 * (easeInOut) easing over a 3-second duration, repeating infinitely.
 * Ideal for clouds and background decorative elements.
 *
 * @example
 * <motion.div variants={floatVariant} initial="initial" animate="animate" />
 */
export const floatVariant: Variants = {
  initial: { y: 0 },
  animate: {
    y: [0, -6, 0],
    transition: {
      duration: 3,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop",
    },
  },
};

// ---------------------------------------------------------------------------
// Spin Variant
// ---------------------------------------------------------------------------

/**
 * Spin animation preset.
 *
 * Rotates the element continuously from 0° → 360° with a 1-second linear
 * duration, repeating infinitely. Ideal for coin components and loading
 * indicators.
 *
 * @example
 * <motion.div variants={spinVariant} initial="initial" animate="animate" />
 */
export const spinVariant: Variants = {
  initial: { rotate: 0 },
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      ease: "linear",
      repeat: Infinity,
      repeatType: "loop",
    },
  },
};

// ---------------------------------------------------------------------------
// Fade-Up Variant
// ---------------------------------------------------------------------------

/**
 * Fade-up animation preset.
 *
 * Transitions the element from `{ opacity: 0, y: 20 }` to
 * `{ opacity: 1, y: 0 }` over 0.5 seconds with an ease-out curve.
 * Ideal for section entrance animations and content reveals.
 *
 * @example
 * <motion.div variants={fadeUpVariant} initial="hidden" animate="visible" />
 */
export const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// ---------------------------------------------------------------------------
// Preset Name Type
// ---------------------------------------------------------------------------

/**
 * Union type of all available animation preset names.
 * Use this type for component props that accept an animation preset.
 *
 * @example
 * interface MyProps {
 *   animation?: AnimationPresetName;
 * }
 */
export type AnimationPresetName = "bounce" | "float" | "spin" | "fade-up";

// ---------------------------------------------------------------------------
// Presets Map
// ---------------------------------------------------------------------------

/**
 * A lookup map from `AnimationPresetName` to its corresponding Framer Motion
 * `Variants` object. Use this in hooks or components to resolve a preset by
 * name at runtime.
 *
 * @example
 * const variant = presets["bounce"]; // → bounceVariant
 * const variant = presets[animationProp]; // dynamic lookup
 */
export const presets: Record<AnimationPresetName, Variants> = {
  bounce: bounceVariant,
  float: floatVariant,
  spin: spinVariant,
  "fade-up": fadeUpVariant,
};
