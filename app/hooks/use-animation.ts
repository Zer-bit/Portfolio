/**
 * @file use-animation.ts — Animation Hook
 *
 * Accepts an `AnimationPresetName` and returns spread-ready Framer Motion props.
 * Normalizes variant key names so callers always receive consistent `initial`
 * and `animate` strings regardless of which preset is used.
 *
 * @example
 * const animProps = useAnimation("bounce");
 * <motion.div {...animProps} />
 *
 * @example
 * const animProps = useAnimation("fade-up");
 * <motion.div {...animProps} />
 */

import { type Transition, type Variants } from "framer-motion";
import { type AnimationPresetName, presets } from "../lib/animations";

/**
 * Maps each preset name to the `initial` key used in its variant definition.
 * `fade-up` uses `"hidden"` / `"visible"`, while the others use `"initial"` / `"animate"`.
 */
const initialKeyMap: Record<AnimationPresetName, string> = {
  "fade-up": "hidden",
  bounce: "initial",
  float: "initial",
  spin: "initial",
};

/**
 * Maps each preset name to the `animate` key used in its variant definition.
 */
const animateKeyMap: Record<AnimationPresetName, string> = {
  "fade-up": "visible",
  bounce: "animate",
  float: "animate",
  spin: "animate",
};

/**
 * Returns spread-ready Framer Motion props for the given animation preset.
 *
 * The returned object contains `variants`, `initial`, `animate`, and an
 * optional `transition` field. Spread it directly onto any `motion.*` element.
 *
 * @param preset - The name of the animation preset to use.
 * @returns An object with `variants`, `initial`, `animate`, and optional `transition`.
 *
 * @example
 * const animProps = useAnimation("bounce");
 * return <motion.div {...animProps}>Hello</motion.div>;
 */
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
