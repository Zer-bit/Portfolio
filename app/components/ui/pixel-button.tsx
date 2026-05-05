"use client";

/**
 * @file pixel-button.tsx — PixelButton Component
 *
 * A reusable pixel-art styled button supporting three visual variants (brick,
 * coin, pipe), three sizes (sm, md, lg), optional Framer Motion animation
 * presets, disabled state, and active/pressed state. Forwards all standard
 * HTML button props to the underlying element.
 *
 * @example
 * // Basic usage
 * <PixelButton variant="coin" size="md" onClick={handleClick}>
 *   Hire Me
 * </PixelButton>
 *
 * @example
 * // With animation
 * <PixelButton variant="brick" animation="bounce">
 *   Click Me
 * </PixelButton>
 *
 * @example
 * // Disabled state
 * <PixelButton variant="pipe" disabled>
 *   Unavailable
 * </PixelButton>
 */

import React from "react";
import { motion } from "framer-motion";
import { dayTheme, pixelGrid } from "../../lib/theme";
import { type AnimationPresetName } from "../../lib/animations";
import { useAnimation } from "../../hooks/use-animation";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Props for the PixelButton component.
 *
 * Extends all standard HTML button attributes so that `onClick`, `type`,
 * `aria-label`, `children`, and any other native button prop can be passed
 * through directly.
 */
export interface PixelButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual style variant. Determines background, border, and text color.
   * Defaults to `"brick"` when not provided.
   */
  variant?: "brick" | "coin" | "pipe";
  /**
   * Size of the button, mapping to pixel-grid padding and font-size values.
   * Defaults to `"md"` when not provided.
   */
  size?: "sm" | "md" | "lg";
  /**
   * Optional Framer Motion animation preset applied on mount/hover.
   * When provided, the button is wrapped in a `motion.button` element.
   */
  animation?: AnimationPresetName;
}

// ---------------------------------------------------------------------------
// Variant Map
// ---------------------------------------------------------------------------

/**
 * Maps each variant name to its corresponding inline style tokens sourced
 * from `lib/theme.ts`. Using a variant map instead of conditionals keeps
 * the component compliant with Requirement 19.5.
 */
const variantStyles: Record<
  NonNullable<PixelButtonProps["variant"]>,
  React.CSSProperties
> = {
  brick: {
    backgroundColor: dayTheme.colors.brick,
    borderColor: dayTheme.colors.ground,
    color: "#ffffff",
  },
  coin: {
    backgroundColor: dayTheme.colors.coin,
    borderColor: dayTheme.colors.ground,
    color: "#111111",
  },
  pipe: {
    backgroundColor: dayTheme.colors.pipe,
    borderColor: "#005500",
    color: "#ffffff",
  },
};

// ---------------------------------------------------------------------------
// Size Map
// ---------------------------------------------------------------------------

/**
 * Maps each size name to pixel-grid-based padding and font-size values
 * sourced from `lib/theme.ts`.
 *
 * | Size | Padding (v × h)       | Font Size |
 * |------|-----------------------|-----------|
 * | sm   | px2 (8px) × px3 (12px) | 10px     |
 * | md   | px3 (12px) × px6 (24px)| 12px     |
 * | lg   | px4 (16px) × px8 (32px)| 14px     |
 */
const sizeStyles: Record<
  NonNullable<PixelButtonProps["size"]>,
  React.CSSProperties
> = {
  sm: {
    padding: `${pixelGrid.px2} ${pixelGrid.px3}`,
    fontSize: "10px",
  },
  md: {
    padding: `${pixelGrid.px3} ${pixelGrid.px6}`,
    fontSize: "12px",
  },
  lg: {
    padding: `${pixelGrid.px4} ${pixelGrid.px8}`,
    fontSize: "14px",
  },
};

// ---------------------------------------------------------------------------
// Active/Pressed State CSS
// ---------------------------------------------------------------------------

/**
 * Unique class name used to scope the `:active` pseudo-class rule injected
 * into the document head. The rule shifts the pixel shadow down by 2px to
 * simulate a pressed/inset effect.
 */
const ACTIVE_CLASS = "pixel-button-active";

/**
 * Injects a `<style>` tag with the `:active` pixel-shadow shift rule once.
 * This is done at module level so it runs only once per page load.
 */
if (typeof document !== "undefined") {
  const styleId = "pixel-button-active-style";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      .${ACTIVE_CLASS}:active:not(:disabled) {
        box-shadow:
          4px 2px 0 0 #000,
          0 6px 0 0 #000,
          4px 6px 0 0 #000,
          -4px 2px 0 0 #000,
          0 -2px 0 0 #000;
        transform: translateY(2px);
      }
    `;
    document.head.appendChild(style);
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * PixelButton — A pixel-art styled button component.
 *
 * Renders a `<button>` (or `motion.button` when `animation` is set) with
 * Mario-themed visual styles. Applies `.pixel-shadow` and `.pixel-text` CSS
 * utility classes by default.
 *
 * @param props - {@link PixelButtonProps}
 *
 * @example
 * <PixelButton variant="coin" size="lg" onClick={() => console.log("clicked")}>
 *   View Work
 * </PixelButton>
 */
export function PixelButton({
  variant = "brick",
  size = "md",
  animation,
  disabled,
  className = "",
  style,
  children,
  ...rest
}: PixelButtonProps) {
  // Always call the hook — pass a fallback preset when animation is undefined
  // so the hook call is unconditional (Rules of Hooks compliance).
  const animationProps = useAnimation(animation ?? "bounce");

  // Compose class names
  const classes = [
    "pixel-shadow",
    "pixel-text",
    ACTIVE_CLASS,
    "border-2",
    "cursor-pointer",
    "inline-block",
    "transition-transform",
    disabled ? "opacity-50 pointer-events-none" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Merge inline styles: variant → size → caller overrides
  const mergedStyle: React.CSSProperties = {
    ...variantStyles[variant],
    ...sizeStyles[size],
    borderStyle: "solid",
    borderWidth: "2px",
    ...style,
  };

  // When an animation preset is provided, wrap in motion.button.
  // Several React HTML event handler types (onDrag, onAnimationStart, etc.)
  // conflict with Framer Motion's overloaded versions of the same prop names.
  // We cast `rest` to avoid the type mismatch while still forwarding all props.
  if (animation) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const motionRest = rest as any;
    return (
      <motion.button
        className={classes}
        style={mergedStyle}
        disabled={disabled}
        variants={animationProps.variants}
        initial={animationProps.initial}
        animate={animationProps.animate}
        whileTap={disabled ? undefined : { y: 2 }}
        {...motionRest}
      >
        {children}
      </motion.button>
    );
  }

  // Plain button when no animation is needed
  return (
    <button
      className={classes}
      style={mergedStyle}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}

export default PixelButton;
