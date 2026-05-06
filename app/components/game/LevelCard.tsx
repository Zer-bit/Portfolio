"use client";

/**
 * @file LevelCard.tsx — LevelCard Game Component
 *
 * Renders a single project as a selectable level card in the Mario-themed
 * portfolio. Uses existing `PixelCard` (elevated variant) styling, displays
 * the project title, tech stack tags, accent color, and thumbnail image.
 *
 * On click, navigates to `/projects/[slug]` using the `toSlug` utility.
 * For projects with `link: "#"` (not yet deployed), shows a `NotificationToast`
 * instead of navigating.
 *
 * This file exports two things:
 * - `LevelCardComponent` — the actual React implementation (named export)
 * - `default` — a `next/dynamic` wrapped version with `{ ssr: false }` for
 *   code splitting and to avoid SSR issues with Framer Motion animations.
 *
 * @example
 * ```tsx
 * import LevelCard from "@/components/game/LevelCard";
 * <LevelCard project={projects[0]} />
 * ```
 */

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ExternalLink } from "lucide-react";

import { type projects, toSlug } from "../../lib/data";
import { dayTheme } from "../../lib/theme";
import { ROUTES } from "../../lib/constants";
import PixelCard from "../ui/pixel-card";
import PixelButton from "../ui/pixel-button";
import { useSound } from "../../hooks/use-sound";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Project type inferred from the `projects` array in `app/lib/data.ts`. */
type Project = (typeof projects)[number];

export interface LevelCardProps {
  /** The project data object to render. */
  project: Project;
}

// ---------------------------------------------------------------------------
// Implementation
// ---------------------------------------------------------------------------

/**
 * LevelCardComponent — pixel-art styled project level card.
 *
 * Renders a project as a PixelCard (elevated) with:
 * - Aspect-ratio thumbnail image using Next.js `<Image>`
 * - Project title in coin-gold color
 * - Tech stack tags rendered as non-interactive PixelButton (brick/sm)
 * - Accent color overlay on hover
 * - Click handler: navigates to `/projects/[slug]` or shows NotificationToast
 *   for coming-soon projects (`link: "#"`)
 *
 * @param props.project - The project data object to render.
 */
export function LevelCardComponent({ project }: LevelCardProps) {
  const router = useRouter();
  const isComingSoon = project.link === "#";
  const slug = toSlug(project.title);
  const projectPath = `${ROUTES.projects}/${slug}`;
  const { playClick } = useSound();

  // All cards navigate to the detail page regardless of live link status.
  const handleClick = () => { playClick(); router.push(projectPath); };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`View project: ${project.title}${isComingSoon ? " (coming soon)" : ""}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{ "--tw-ring-color": project.accent } as React.CSSProperties}
    >
        <PixelCard
          variant="elevated"
          className="group relative overflow-hidden flex flex-col h-full"
          style={{ backgroundColor: "#1a1a2e" }}
        >
          {/* Project thumbnail */}
          <div className="aspect-video overflow-hidden relative">
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
              style={{ imageRendering: "auto" }}
              unoptimized={project.image.startsWith("http")}
            />
            {/* Accent color overlay on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `linear-gradient(135deg, ${project.accent}15, ${project.accent}05)`,
              }}
            />
          </div>

          {/* Card body */}
          <div className="p-6 flex flex-col flex-grow">
            {/* Project title */}
            <h4
              className="pixel-text text-base mb-3 transition-colors duration-300"
              style={{ color: dayTheme.colors.coin }}
            >
              {project.title}
            </h4>

            {/* Tech stack tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tech.map((tag) => (
                <PixelButton
                  key={tag}
                  variant="brick"
                  size="sm"
                  tabIndex={-1}
                  className="pointer-events-none"
                  aria-hidden="true"
                >
                  {tag}
                </PixelButton>
              ))}
            </div>

            {/* Footer: always "View Project" since all cards navigate to detail page */}
            <div
              className="flex items-center gap-3 mt-auto pt-4"
              style={{ borderTop: `1px solid ${dayTheme.colors.border}` }}
            >
              <span
                className="pixel-text flex items-center gap-1"
                style={{
                  color: project.accent,
                  fontSize: "10px",
                }}
              >
                <ExternalLink size={10} />
                View Project
              </span>
            </div>
          </div>
        </PixelCard>
      </div>
  );
}

// ---------------------------------------------------------------------------
// Default export — dynamic import wrapper (no SSR)
// ---------------------------------------------------------------------------

/**
 * Dynamically imported LevelCard component with `{ ssr: false }`.
 *
 * Use this default export in all consuming components to enable code splitting
 * and avoid SSR hydration issues with Framer Motion animations (via PixelCard).
 *
 * @satisfies Requirement 14.1 — Game components use next/dynamic with ssr:false
 */
const LevelCard = dynamic(
  () => import("./LevelCard").then((mod) => ({ default: mod.LevelCardComponent })),
  { ssr: false }
);

export default LevelCard;
