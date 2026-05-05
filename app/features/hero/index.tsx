"use client";

/**
 * @file features/hero/index.tsx — Hero Section
 *
 * The opening section of the Mario Pixel Portfolio. Displays the developer's
 * name as a Mario-style title card, a pixel-art character sprite, CTA buttons,
 * a ground platform of brick blocks, and a scroll-down indicator.
 *
 * Migrated from `app/components/sections/hero.tsx` and restyled to match the
 * Mario pixel-art game theme.
 *
 * @example
 * ```tsx
 * import HeroSection from "@/features/hero";
 * <HeroSection />
 * ```
 */

import React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { SectionWrapper } from "../../components/layout/section-wrapper";
import { PixelButton } from "../../components/ui/pixel-button";
import { dayTheme } from "../../lib/theme";

// ---------------------------------------------------------------------------
// Dynamic imports (ssr: false) for game components
// ---------------------------------------------------------------------------

const Block = dynamic(
  () => import("../../components/game/block").then((mod) => ({ default: mod.BlockComponent })),
  { ssr: false }
);

// ---------------------------------------------------------------------------
// Pixel-art Mario character SVG
// ---------------------------------------------------------------------------

/**
 * A simple inline pixel-art Mario-style character SVG.
 * Red hat, face, blue overalls, red shirt — 32×48 viewBox rendered at 120×180.
 */
function MarioSprite() {
  return (
    <svg
      width="120"
      height="180"
      viewBox="0 0 32 48"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Pixel-art Mario character"
      role="img"
      style={{ imageRendering: "pixelated" }}
    >
      {/* Hat */}
      <rect x="8" y="0" width="16" height="4" fill="#e40058" />
      <rect x="6" y="4" width="20" height="4" fill="#e40058" />
      {/* Face */}
      <rect x="8" y="8" width="16" height="8" fill="#f4a460" />
      {/* Eyes */}
      <rect x="10" y="10" width="3" height="3" fill="#000" />
      <rect x="19" y="10" width="3" height="3" fill="#000" />
      {/* Mustache */}
      <rect x="9" y="14" width="14" height="2" fill="#8B4513" />
      {/* Overalls */}
      <rect x="8" y="16" width="16" height="12" fill="#0000cd" />
      {/* Shirt */}
      <rect x="6" y="16" width="4" height="8" fill="#e40058" />
      <rect x="22" y="16" width="4" height="8" fill="#e40058" />
      {/* Legs */}
      <rect x="8" y="28" width="6" height="10" fill="#0000cd" />
      <rect x="18" y="28" width="6" height="10" fill="#0000cd" />
      {/* Shoes */}
      <rect x="6" y="38" width="10" height="4" fill="#8B4513" />
      <rect x="16" y="38" width="10" height="4" fill="#8B4513" />
      {/* Arms */}
      <rect x="4" y="18" width="4" height="8" fill="#f4a460" />
      <rect x="24" y="18" width="4" height="8" fill="#f4a460" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Ground platform — row of brick blocks
// ---------------------------------------------------------------------------

/**
 * Renders a horizontal row of brick Block components as a ground platform
 * at the bottom of the hero section.
 */
function GroundPlatform() {
  // Render enough blocks to fill the width; CSS overflow:hidden clips extras
  const blockCount = 20;
  return (
    <div
      className="absolute bottom-0 left-0 w-full overflow-hidden"
      aria-hidden="true"
      style={{ zIndex: 1 }}
    >
      <div className="flex">
        {Array.from({ length: blockCount }).map((_, i) => (
          <Block key={i} variant="brick" size={32} />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Scroll handler
// ---------------------------------------------------------------------------

/**
 * Smoothly scrolls to the `#skills` section when called.
 */
function scrollToSkills() {
  const el = document.getElementById("skills");
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

// ---------------------------------------------------------------------------
// Hero Section
// ---------------------------------------------------------------------------

/**
 * HeroSection — The opening hero section of the Mario Pixel Portfolio.
 *
 * Displays:
 * - "Available for projects" pixel-art HUD badge
 * - Developer name in `.pixel-text` as a Mario title card
 * - Tagline and description
 * - "Hire Me" (coin variant) and "View Work" (pipe variant) CTA buttons
 * - Pixel-art Mario character sprite (right on desktop, centered on mobile)
 * - Ground platform of brick blocks at the bottom
 * - Scroll-down arrow that smooth-scrolls to `#skills`
 *
 * Wrapped in `<SectionWrapper id="home">` for anchor-link navigation.
 */
export default function HeroSection() {
  return (
    <SectionWrapper
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-16"
    >
      {/* Main content grid */}
      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

        {/* ── Left column: text content ── */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* "Available for projects" HUD badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 mb-6"
          >
            <span
              className="pixel-text inline-flex items-center gap-2 px-3 py-1 border-2"
              style={{
                borderColor: dayTheme.colors.pipe,
                backgroundColor: "#000",
                color: dayTheme.colors.pipe,
                fontSize: "8px",
              }}
            >
              {/* Green status dot */}
              <span
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  backgroundColor: dayTheme.colors.pipe,
                  flexShrink: 0,
                }}
              />
              AVAILABLE FOR PROJECTS
            </span>
          </motion.div>

          {/* Name — Mario title card style */}
          <div className="mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="pixel-text leading-tight mb-2"
              style={{
                fontSize: "clamp(24px, 5vw, 48px)",
                color: dayTheme.colors.coin,
                textShadow: `4px 4px 0 #000, -2px -2px 0 #000`,
                letterSpacing: "0.05em",
              }}
            >
              JEZER
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pixel-text leading-tight mb-4"
              style={{
                fontSize: "clamp(24px, 5vw, 48px)",
                color: "#ffffff",
                textShadow: `4px 4px 0 #000, -2px -2px 0 #000`,
                letterSpacing: "0.05em",
              }}
            >
              PARALES
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="pixel-text"
              style={{
                fontSize: "10px",
                color: dayTheme.colors.text,
                opacity: 0.8,
              }}
            >
              ARCHITECTING DIGITAL UNIVERSE
            </motion.p>
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-200 text-base mb-10 max-w-lg leading-relaxed"
          >
            Developing cutting-edge{" "}
            <span style={{ color: dayTheme.colors.pipe, fontWeight: 600 }}>websites</span>{" "}
            and{" "}
            <span style={{ color: dayTheme.colors.coin, fontWeight: 600 }}>seamless applications</span>.
            Let&apos;s bridge the gap between imagination and a high-performance digital reality.
            <br />
            <span
              className="pixel-text inline-block mt-4"
              style={{ fontSize: "10px", color: dayTheme.colors.coin }}
            >
              LET&apos;S LEVEL UP!
            </span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex items-center gap-4 flex-wrap"
          >
            {/* Hire Me — coin variant */}
            <a href="#contact" tabIndex={-1}>
              <PixelButton variant="coin" size="lg" aria-label="Hire Me — go to contact section">
                HIRE ME
              </PixelButton>
            </a>
            {/* View Work — pipe variant */}
            <a href="#projects" tabIndex={-1}>
              <PixelButton variant="pipe" size="lg" aria-label="View Work — go to projects section">
                VIEW WORK
              </PixelButton>
            </a>
          </motion.div>

          {/* Scroll-down arrow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col items-start justify-center mt-10"
          >
            <button
              onClick={scrollToSkills}
              aria-label="Scroll down to skills section"
              className="w-12 h-12 flex items-center justify-center border-2 cursor-pointer transition-transform hover:scale-110"
              style={{
                borderColor: dayTheme.colors.coin,
                color: dayTheme.colors.coin,
                backgroundColor: "transparent",
              }}
            >
              <ArrowDown size={24} />
            </button>
          </motion.div>
        </motion.div>

        {/* ── Right column: Mario sprite ── */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex justify-center lg:justify-end items-center"
          aria-hidden="true"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <MarioSprite />
          </motion.div>
        </motion.div>
      </div>

      {/* ── Ground platform (brick blocks row) ── */}
      <GroundPlatform />
    </SectionWrapper>
  );
}
