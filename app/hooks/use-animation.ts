import { type Transition, type Variants } from "framer-motion";
import { type AnimationPresetName, presets } from "../lib/animations";

// Maps each preset name to the `initial` key used in its variant definition.
const initialKeyMap: Record<AnimationPresetName, string> = {
  "fade-up": "hidden",
  bounce: "initial",
  float: "initial",
  spin: "initial",
};

// Maps each preset name to the `animate` key used in its variant definition.
const animateKeyMap: Record<AnimationPresetName, string> = {
  "fade-up": "visible",
  bounce: "animate",
  float: "animate",
  spin: "animate",
};

// Returns spread-ready Framer Motion props for the given animation preset.
export function useAnimation(preset: AnimationPresetName): {
  variants: Variants;
  initial: string;
  animate: string;
  transition?: Transition;
} {
  const variants = presets[preset];
  const initial = initialKeyMap[preset];
  const animate = animateKeyMap[preset];

  return {
    variants,
    initial,
    animate,
  };
}
