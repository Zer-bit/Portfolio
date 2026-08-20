"use client";

// A reusable pixel-art styled button supporting three visual variants (brick, coin...

import React from "react";
import { motion } from "framer-motion";
import { dayTheme, pixelGrid } from "../../lib/theme";
import { type AnimationPresetName } from "../../lib/animations";
import { useAnimation } from "../../hooks/use-animation";
import { useSound } from "../../hooks/use-sound";

// Types
// Props for the PixelButton component.
export interface PixelButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // Visual style variant.
  variant?: "brick" | "coin" | "pipe";
  // Size of the button, mapping to pixel-grid padding and font-size values.
  size?: "sm" | "md" | "lg";
  // Optional Framer Motion animation preset applied on mount/hover.
  animation?: AnimationPresetName;
}

// Variant Map
// Maps each variant name to its corresponding inline style tokens sourced from `li...
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

// Size Map
// Maps each size name to pixel-grid-based padding and font-size values sourced fro...
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

// Active/Pressed State CSS
// Unique class name used to scope the `:active` pseudo-class rule injected into th...
const ACTIVE_CLASS = "pixel-button-active";

// Injects a `<style>` tag with the `:active` pixel-shadow shift rule once.
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

// Component
// PixelButton — A pixel-art styled button component.
export function PixelButton({
  variant = "brick",
  size = "md",
  animation,
  disabled,
  className = "",
  style,
  children,
  onClick,
  ...rest
}: PixelButtonProps) {
  const animationProps = useAnimation(animation ?? "bounce");
  const { playClick } = useSound();

  // Wrap onClick to play sound first
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) playClick();
    onClick?.(e);
  };

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
        onClick={handleClick}
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
      onClick={handleClick}
      {...rest}
    >
      {children}
    </button>
  );
}

export default PixelButton;
