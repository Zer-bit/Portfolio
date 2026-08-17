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
        backgroundColor: "rgba(255, 255, 255, 0.12)",
        border: "2px solid rgba(0, 0, 0, 0.5)",
        boxShadow: "inset 0 0 8px rgba(0, 0, 0, 0.3)",
        imageRendering: "pixelated",
        ...style,
      }}
    />
  );
}

/**
 * LevelCardSkeleton — Pixel-accurate placeholder matching LevelCard layout on /projects
 */
export function LevelCardSkeleton() {
  return (
    <div
      className="relative overflow-hidden flex flex-col h-full"
      style={{
        backgroundColor: "#1a1a2e",
        border: "4px solid #000000",
        boxShadow: "4px 4px 0px #000000",
      }}
    >
      {/* Aspect ratio 16:9 thumbnail */}
      <div className="aspect-video relative overflow-hidden bg-slate-900">
        <SkeletonBox style={{ width: "100%", height: "100%", border: "none" }} />
      </div>

      {/* Card body */}
      <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
        {/* Title in coin gold */}
        <div>
          <SkeletonBox style={{ width: "70%", height: "20px", backgroundColor: `${dayTheme.colors.coin}33` }} />
        </div>

        {/* Description line placeholder */}
        <div className="space-y-2">
          <SkeletonBox style={{ width: "100%", height: "12px" }} />
          <SkeletonBox style={{ width: "85%", height: "12px" }} />
        </div>

        {/* Tech stack badge buttons */}
        <div className="flex flex-wrap gap-2">
          <SkeletonBox style={{ width: "64px", height: "24px" }} />
          <SkeletonBox style={{ width: "80px", height: "24px" }} />
          <SkeletonBox style={{ width: "56px", height: "24px" }} />
        </div>

        {/* Footer arrow line */}
        <div
          className="pt-4 flex items-center gap-2"
          style={{ borderTop: `1px solid ${dayTheme.colors.border}` }}
        >
          <SkeletonBox style={{ width: "100px", height: "14px" }} />
        </div>
      </div>
    </div>
  );
}

/**
 * SkillCardSkeleton — Pixel-accurate placeholder matching Technical & Professional Skill Cards
 */
export function SkillCardSkeleton({ variant = "technical" }: { variant?: "technical" | "professional" }) {
  if (variant === "professional") {
    return (
      <div
        className="p-6"
        style={{
          backgroundColor: "rgba(13, 27, 42, 0.8)",
          border: "4px solid #000000",
          boxShadow: "4px 4px 0px #000000",
        }}
      >
        <div className="flex items-start gap-5">
          {/* Icon box */}
          <SkeletonBox style={{ width: "48px", height: "48px", flexShrink: 0 }} />

          {/* Title & description */}
          <div className="flex-1 space-y-3">
            <SkeletonBox style={{ width: "50%", height: "18px", backgroundColor: `${dayTheme.colors.coin}33` }} />
            <SkeletonBox style={{ width: "100%", height: "14px" }} />
            <SkeletonBox style={{ width: "80%", height: "14px" }} />
          </div>
        </div>
      </div>
    );
  }

  // Technical category variant
  return (
    <div
      className="p-6 space-y-4"
      style={{
        backgroundColor: "rgba(13, 27, 42, 0.85)",
        border: "4px solid #000000",
        boxShadow: "4px 4px 0px #000000",
      }}
    >
      {/* Icon badge + Category Name */}
      <div className="flex items-center gap-4 mb-4">
        <SkeletonBox style={{ width: "32px", height: "32px", backgroundColor: dayTheme.colors.coin }} />
        <SkeletonBox style={{ width: "45%", height: "18px" }} />
      </div>

      {/* Skill tag buttons */}
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonBox key={i} style={{ width: `${55 + (i % 3) * 25}px`, height: "26px" }} />
        ))}
      </div>
    </div>
  );
}

/**
 * ExperienceCardSkeleton — Pixel-accurate placeholder matching /experience entries timeline
 */
export function ExperienceCardSkeleton() {
  return (
    <div className="relative pl-12 my-8">
      {/* Timeline dot */}
      <div
        className="absolute left-2 top-6 w-4 h-4 -translate-x-1/2 bg-yellow-500 animate-pulse"
        style={{ border: "2px solid #000000" }}
      />

      <div
        className="p-6 space-y-4"
        style={{
          backgroundColor: "rgba(13, 27, 42, 0.85)",
          border: "4px solid #000000",
          borderLeft: `4px solid ${dayTheme.colors.coin}`,
          boxShadow: "4px 4px 0px #000000",
        }}
      >
        {/* Job title in gold */}
        <SkeletonBox style={{ width: "60%", height: "20px", backgroundColor: `${dayTheme.colors.coin}33` }} />

        {/* Company */}
        <SkeletonBox style={{ width: "40%", height: "16px" }} />

        {/* Date range in green */}
        <SkeletonBox style={{ width: "30%", height: "14px", backgroundColor: `${dayTheme.colors.pipe}44` }} />

        {/* Overview text */}
        <div className="space-y-2">
          <SkeletonBox style={{ width: "100%", height: "14px" }} />
          <SkeletonBox style={{ width: "90%", height: "14px" }} />
        </div>

        {/* Details button placeholder */}
        <SkeletonBox style={{ width: "100px", height: "28px" }} />
      </div>
    </div>
  );
}

/**
 * ProjectDetailSkeleton — Pixel-accurate placeholder matching /projects/[slug] view
 */
export function ProjectDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-6 pb-16 pt-8 space-y-8">
      {/* Centered title */}
      <div className="flex justify-center">
        <SkeletonBox style={{ width: "65%", height: "32px", backgroundColor: `${dayTheme.colors.coin}33` }} />
      </div>

      {/* 16:9 Image container with 4px border */}
      <div
        className="overflow-hidden aspect-video relative"
        style={{
          border: `4px solid ${dayTheme.colors.border}`,
          backgroundColor: dayTheme.colors.ground,
        }}
      >
        <SkeletonBox style={{ width: "100%", height: "100%", border: "none" }} />
      </div>

      {/* Description box */}
      <div
        className="p-6 space-y-4"
        style={{
          border: `2px solid ${dayTheme.colors.border}`,
          backgroundColor: "rgba(0,0,0,0.3)",
        }}
      >
        <SkeletonBox style={{ width: "120px", height: "16px", backgroundColor: `${dayTheme.colors.coin}33` }} />
        <SkeletonBox style={{ width: "100%", height: "14px" }} />
        <SkeletonBox style={{ width: "95%", height: "14px" }} />
        <SkeletonBox style={{ width: "80%", height: "14px" }} />
      </div>

      {/* Tech stack box */}
      <div
        className="p-6 space-y-4"
        style={{
          border: `2px solid ${dayTheme.colors.border}`,
          backgroundColor: "rgba(0,0,0,0.3)",
        }}
      >
        <SkeletonBox style={{ width: "120px", height: "16px", backgroundColor: `${dayTheme.colors.coin}33` }} />
        <div className="flex flex-wrap gap-2">
          <SkeletonBox style={{ width: "80px", height: "28px" }} />
          <SkeletonBox style={{ width: "100px", height: "28px" }} />
          <SkeletonBox style={{ width: "70px", height: "28px" }} />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <SkeletonBox style={{ width: "140px", height: "36px" }} />
        <SkeletonBox style={{ width: "160px", height: "36px" }} />
      </div>
    </div>
  );
}
