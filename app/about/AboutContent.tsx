"use client";

/**
 * @file app/about/AboutContent.tsx — About Page Client Content
 *
 * Client component containing the interactive About page content.
 * Separated from page.tsx so that page.tsx can remain a server component
 * and export Next.js metadata.
 *
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PixelCard } from "../components/ui/pixel-card";
import { PixelButton } from "../components/ui/pixel-button";
import { dayTheme } from "../lib/theme";
import { ROUTES } from "../lib/constants";
import { fadeUpVariant } from "../lib/animations";

// ---------------------------------------------------------------------------
// Developer data
// ---------------------------------------------------------------------------

const DEVELOPER = {
  name: "JEZER PARALES",
  role: "Full Stack Developer",
  availability: "Available for Hire",
  location: "Philippines",
  bio: "I'm a passionate developer who genuinely loves programming — it's not just a career, it's a craft I enjoy every day. I specialize in building modern web applications, turning ideas into clean, functional, and engaging experiences on the web. Beyond that, I have a deep dream of becoming a game developer, combining my love for interactive design and code to create worlds that people can explore and enjoy.",
} as const;

// ---------------------------------------------------------------------------
// Stat row component
// ---------------------------------------------------------------------------

interface StatRowProps {
  label: string;
  value: string;
}

function StatRow({ label, value }: StatRowProps) {
  return (
    <div
      className="flex items-center gap-4 py-2"
      style={{ borderBottom: `1px solid ${dayTheme.colors.border}` }}
    >
      <span
        className="pixel-text"
        style={{ fontSize: "9px", color: dayTheme.colors.pipe, minWidth: "120px" }}
        aria-label={`${label}: ${value}`}
      >
        {label}
      </span>
      <span
        className="pixel-text"
        style={{ fontSize: "9px", color: dayTheme.colors.text }}
      >
        {value}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pixel-art avatar SVG (Mario-style character)
// ---------------------------------------------------------------------------

function AvatarSprite() {
  return (
    <svg
      width="96"
      height="96"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Pixel-art developer avatar"
      role="img"
      style={{ imageRendering: "pixelated" }}
    >
      {/* Hat */}
      <rect x="8" y="2" width="16" height="3" fill={dayTheme.colors.mario} />
      <rect x="6" y="5" width="20" height="3" fill={dayTheme.colors.mario} />
      {/* Face */}
      <rect x="8" y="8" width="16" height="7" fill="#f4a460" />
      {/* Eyes */}
      <rect x="10" y="10" width="3" height="2" fill="#000" />
      <rect x="19" y="10" width="3" height="2" fill="#000" />
      {/* Mustache */}
      <rect x="9" y="13" width="14" height="2" fill="#8B4513" />
      {/* Body */}
      <rect x="8" y="15" width="16" height="10" fill="#0000cd" />
      <rect x="6" y="15" width="4" height="7" fill={dayTheme.colors.mario} />
      <rect x="22" y="15" width="4" height="7" fill={dayTheme.colors.mario} />
      {/* Legs */}
      <rect x="8" y="25" width="6" height="5" fill="#0000cd" />
      <rect x="18" y="25" width="6" height="5" fill="#0000cd" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// About Content
// ---------------------------------------------------------------------------

export default function AboutContent() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-20"
      aria-label="About page — character profile"
    >
      <div className="max-w-2xl w-full">

        {/* Page heading */}
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          animate="visible"
          className="text-center mb-8"
        >
          <h1
            className="pixel-text"
            style={{
              fontSize: "clamp(14px, 3vw, 22px)",
              color: dayTheme.colors.coin,
              textShadow: `3px 3px 0 #000`,
              letterSpacing: "0.05em",
            }}
          >
            CHARACTER PROFILE
          </h1>
        </motion.div>

        {/* Main profile card */}
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
        >
          <PixelCard variant="elevated" className="p-6">

            {/* Avatar + name row */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
              {/* Avatar */}
              <div
                className="flex-shrink-0 flex items-center justify-center"
                style={{
                  width: 112,
                  height: 112,
                  border: `4px solid ${dayTheme.colors.coin}`,
                  backgroundColor: dayTheme.colors.sky,
                }}
                aria-hidden="true"
              >
                <AvatarSprite />
              </div>

              {/* Name + bio */}
              <div className="flex-1 text-center sm:text-left">
                <h2
                  className="pixel-text mb-3"
                  style={{
                    fontSize: "clamp(12px, 2.5vw, 18px)",
                    color: dayTheme.colors.coin,
                    textShadow: `2px 2px 0 #000`,
                    letterSpacing: "0.05em",
                  }}
                >
                  {DEVELOPER.name}
                </h2>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: dayTheme.colors.text, opacity: 0.9 }}
                >
                  {DEVELOPER.bio}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div
              style={{
                height: 2,
                backgroundColor: dayTheme.colors.border,
                marginBottom: "1.5rem",
              }}
              aria-hidden="true"
            />

            {/* Stats section */}
            <div className="mb-6">
              <h3
                className="pixel-text mb-4"
                style={{ fontSize: "10px", color: dayTheme.colors.pipe }}
              >
                ★ PLAYER STATS
              </h3>
              <div>
                <StatRow label="ROLE" value={DEVELOPER.role} />
                <StatRow label="STATUS" value={DEVELOPER.availability} />
                <StatRow label="LOCATION" value={DEVELOPER.location} />
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Link
                href={ROUTES.contact}
                aria-label="Hire Me — navigate to contact page"
              >
                <PixelButton variant="coin" size="md">
                  HIRE ME
                </PixelButton>
              </Link>
              <Link
                href={ROUTES.projects}
                aria-label="View Projects — navigate to projects page"
              >
                <PixelButton variant="pipe" size="md">
                  VIEW PROJECTS
                </PixelButton>
              </Link>
            </div>

          </PixelCard>
        </motion.div>

      </div>
    </main>
  );
}
