import React from "react";

// Types
// Props for the PixelContainer component.
export interface PixelContainerProps {
  fullWidth?: boolean;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  children: React.ReactNode;
}

// Component
// PixelContainer wraps content in a centered, max-width-constrained layout contain...
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
