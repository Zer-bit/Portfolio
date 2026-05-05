/**
 * PixelContainer — Standard layout wrapper component
 *
 * Enforces consistent max-width (1280px) and pixel-grid padding across all
 * sections. Renders as any valid HTML element via the `as` prop.
 *
 * @example
 * ```tsx
 * // Default usage (renders as <div>)
 * <PixelContainer>
 *   <p>Content centered with max-width and padding</p>
 * </PixelContainer>
 *
 * // Full-width (removes max-width, retains padding)
 * <PixelContainer fullWidth>
 *   <p>Edge-to-edge content with padding</p>
 * </PixelContainer>
 *
 * // Render as a semantic element
 * <PixelContainer as="section" className="my-8">
 *   <p>Rendered as a <section> element</p>
 * </PixelContainer>
 * ```
 */

import React from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Props for the PixelContainer component.
 *
 * @property fullWidth  - When `true`, removes the 1280px max-width constraint
 *                        while retaining horizontal padding. Defaults to `false`.
 * @property className  - Additional Tailwind or custom CSS classes to merge.
 * @property as         - HTML element to render as. Defaults to `"div"`.
 * @property children   - Content to render inside the container.
 */
export interface PixelContainerProps {
  fullWidth?: boolean;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  children: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * PixelContainer wraps content in a centered, max-width-constrained layout
 * container with pixel-grid-based horizontal padding.
 *
 * - Default: `max-w-[1280px] mx-auto px-6 md:px-8`
 * - `fullWidth={true}`: removes `max-w-[1280px]`, retains `mx-auto px-6 md:px-8`
 * - `as` prop: renders as any valid HTML element (default: `"div"`)
 *
 * @param props - {@link PixelContainerProps}
 */
export function PixelContainer({
  fullWidth = false,
  className,
  as: Tag = "div",
  children,
}: PixelContainerProps) {
  const baseClasses = [
    "mx-auto",
    "px-6",
    "md:px-8",
    !fullWidth && "max-w-[1280px]",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <Tag className={baseClasses}>{children}</Tag>;
}
