"use client";

/**
 * @file not-found.tsx — 404 Not Found Page
 *
 * Rendered by Next.js App Router whenever a visitor navigates to an undefined
 * route. Styled as a pixel-art "Level Not Found" screen consistent with the
 * Mario theme, using only existing design tokens and CSS classes.
 *
 * Requirements: 2.10, 18.3
 */

import Link from "next/link";
import { dayTheme } from "./lib/theme";
import { ROUTES } from "./lib/constants";
import { PixelButton } from "./components/ui/pixel-button";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: dayTheme.colors.bg,
        padding: "32px 16px",
        gap: "32px",
        textAlign: "center",
      }}
    >
      {/* Large 404 heading */}
      <h1
        className="pixel-text"
        style={{
          fontSize: "clamp(48px, 12vw, 96px)",
          color: dayTheme.colors.coin,
          margin: 0,
          lineHeight: 1.2,
        }}
      >
        404
      </h1>

      {/* Game-over subtitle */}
      <h2
        className="pixel-text"
        style={{
          fontSize: "clamp(14px, 4vw, 24px)",
          color: dayTheme.colors.text,
          margin: 0,
        }}
      >
        LEVEL NOT FOUND
      </h2>

      {/* Descriptive message */}
      <p
        className="pixel-text"
        style={{
          fontSize: "clamp(10px, 2.5vw, 14px)",
          color: dayTheme.colors.text,
          maxWidth: "480px",
          lineHeight: 2,
          margin: 0,
          opacity: 0.85,
        }}
      >
        This page doesn&apos;t exist in our world.
        <br />
        The level may have moved or never existed.
      </p>

      {/* Go Home button */}
      <Link href={ROUTES.home} aria-label="Go to home page">
        <PixelButton variant="coin" size="lg">
          GO HOME
        </PixelButton>
      </Link>
    </div>
  );
}
