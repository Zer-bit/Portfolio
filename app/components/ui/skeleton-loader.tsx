"use client";

import React from "react";
import { dayTheme } from "../../lib/theme";

/**
 * SkeletonBox — Pixel-styled animated pulse box
 */
export function SkeletonBox({
  className = "",
  style = {},
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`animate-pulse ${className}`}
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        border: "2px solid rgba(0, 0, 0, 0.4)",
        boxShadow: "inset 0 0 8px rgba(0, 0, 0, 0.2)",
        imageRendering: "pixelated",
        ...style,
      }}
    />
  );
}

/**
 * LevelCardSkeleton — Placeholder card matching LevelCard layout on /projects
 */
export function LevelCardSkeleton() {
  return (
    <div
      className="flex flex-col p-4 space-y-4"
      style={{
        backgroundColor: "rgba(13, 27, 42, 0.8)",
        border: "4px solid #000000",
        boxShadow: "4px 4px 0px #000000",
      }}
    >
      {/* Image placeholder */}
      <SkeletonBox style={{ width: "100%", height: "180px", borderRadius: "0px" }} />

      {/* Header title placeholder */}
      <SkeletonBox style={{ width: "70%", height: "20px" }} />

      {/* Description lines */}
      <div className="space-y-2">
        <SkeletonBox style={{ width: "100%", height: "12px" }} />
        <SkeletonBox style={{ width: "90%", height: "12px" }} />
        <SkeletonBox style={{ width: "60%", height: "12px" }} />
      </div>

      {/* Tech badge pills */}
      <div className="flex flex-wrap gap-2 pt-2">
        <SkeletonBox style={{ width: "60px", height: "16px" }} />
        <SkeletonBox style={{ width: "80px", height: "16px" }} />
        <SkeletonBox style={{ width: "50px", height: "16px" }} />
      </div>
    </div>
  );
}

/**
 * SkillCardSkeleton — Placeholder for /skills section cards
 */
export function SkillCardSkeleton() {
  return (
    <div
      className="p-6 space-y-4"
      style={{
        backgroundColor: "rgba(13, 27, 42, 0.75)",
        border: "4px solid #000000",
        boxShadow: "4px 4px 0px #000000",
      }}
    >
      <div className="flex items-center space-x-3">
        <SkeletonBox style={{ width: "32px", height: "32px" }} />
        <SkeletonBox style={{ width: "50%", height: "24px" }} />
      </div>
      <div className="flex flex-wrap gap-2 pt-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonBox key={i} style={{ width: `${60 + (i % 3) * 20}px`, height: "24px" }} />
        ))}
      </div>
    </div>
  );
}

/**
 * ExperienceCardSkeleton — Placeholder for /experience entries
 */
export function ExperienceCardSkeleton() {
  return (
    <div
      className="p-6 space-y-4 my-6"
      style={{
        backgroundColor: "rgba(13, 27, 42, 0.75)",
        border: "4px solid #000000",
        boxShadow: "4px 4px 0px #000000",
      }}
    >
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
        <SkeletonBox style={{ width: "60%", height: "24px" }} />
        <SkeletonBox style={{ width: "120px", height: "18px" }} />
      </div>
      <SkeletonBox style={{ width: "40%", height: "18px" }} />
      <SkeletonBox style={{ width: "100%", height: "14px" }} />
      <div className="space-y-2 pt-2">
        <SkeletonBox style={{ width: "95%", height: "12px" }} />
        <SkeletonBox style={{ width: "90%", height: "12px" }} />
        <SkeletonBox style={{ width: "85%", height: "12px" }} />
      </div>
    </div>
  );
}

/**
 * ProjectDetailSkeleton — Placeholder for /projects/[slug] detail view
 */
export function ProjectDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <SkeletonBox style={{ width: "60%", height: "36px" }} />
      <SkeletonBox style={{ width: "100%", height: "320px" }} />
      <div className="space-y-3">
        <SkeletonBox style={{ width: "100%", height: "16px" }} />
        <SkeletonBox style={{ width: "95%", height: "16px" }} />
        <SkeletonBox style={{ width: "90%", height: "16px" }} />
      </div>
    </div>
  );
}
