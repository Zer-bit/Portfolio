import { type Variants } from "framer-motion";

// Bounce Variant
// Bounce animation preset.
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

// Float Variant
// Float animation preset.
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

// Spin Variant
// Spin animation preset.
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

// Fade-Up Variant
// Fade-up animation preset.
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

// Preset Name Type
// Union type of all available animation preset names.
export type AnimationPresetName = "bounce" | "float" | "spin" | "fade-up";

// Presets Map
// A lookup map from `AnimationPresetName` to its corresponding Framer Motion `Vari...
export const presets: Record<AnimationPresetName, Variants> = {
  bounce: bounceVariant,
  float: floatVariant,
  spin: spinVariant,
  "fade-up": fadeUpVariant,
};
