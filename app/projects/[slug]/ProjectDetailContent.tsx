"use client";

/**
 * @file app/projects/[slug]/ProjectDetailContent.tsx — Project Detail Client Content
 *
 * Client component that renders the full project detail view for a matched
 * slug, or a pixel-art "Level Not Found" fallback if no project matches.
 *
 * Requirements: 5.3, 5.4, 5.5, 5.6, 14.2
 */

import Image from "next/image";
import { useRouter } from "next/navigation";
import { projects, toSlug } from "../../lib/data";
import { ROUTES } from "../../lib/constants";
import { dayTheme } from "../../lib/theme";
import { PixelButton } from "../../components/ui/pixel-button";

interface ProjectDetailContentProps {
  slug: string;
}

export function ProjectDetailContent({ slug }: ProjectDetailContentProps) {
  const router = useRouter();
  const project = projects.find((p) => toSlug(p.title) === slug);

  // Level Not Found
  if (!project) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] gap-8 px-6 py-16"
        aria-label="Level not found"
      >
        <h1
          className="pixel-text text-lg md:text-2xl text-center"
          style={{ color: dayTheme.colors.coin }}
        >
          ✕ LEVEL NOT FOUND
        </h1>
        <p
          className="pixel-text text-xs text-center"
          style={{ color: dayTheme.colors.text }}
        >
          THIS STAGE DOES NOT EXIST
        </p>
        <PixelButton
          variant="pipe"
          onClick={() => router.push(ROUTES.projects)}
          aria-label="Back to Projects"
        >
          ← BACK TO PROJECTS
        </PixelButton>
      </div>
    );
  }

  const hasLiveLink = project.link !== "#";

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Project Title */}
      <h1
        className="pixel-text text-base md:text-xl mb-8 text-center"
        style={{ color: dayTheme.colors.coin }}
        aria-label={`Project: ${project.title}`}
      >
        {project.title.toUpperCase()}
      </h1>

      {/* Thumbnail */}
      <div
        className="mb-8 overflow-hidden"
        style={{
          border: `4px solid ${dayTheme.colors.border}`,
          backgroundColor: dayTheme.colors.ground,
        }}
      >
        <Image
          src={project.image}
          alt={`${project.title} thumbnail`}
          width={800}
          height={450}
          className="w-full object-cover"
          style={{ display: "block" }}
          unoptimized={project.image.startsWith("http")}
        />
      </div>

      {/* Description */}
      <div
        className="mb-8 p-6"
        style={{
          border: `2px solid ${dayTheme.colors.border}`,
          backgroundColor: "rgba(0,0,0,0.3)",
        }}
      >
        <h2
          className="pixel-text text-xs mb-4"
          style={{ color: dayTheme.colors.coin }}
        >
          DESCRIPTION
        </h2>
        <p
          className="pixel-text text-xs leading-relaxed"
          style={{ color: dayTheme.colors.text }}
        >
          {project.description}
        </p>
      </div>

      {/* Tech Stack */}
      <div
        className="mb-8 p-6"
        style={{
          border: `2px solid ${dayTheme.colors.border}`,
          backgroundColor: "rgba(0,0,0,0.3)",
        }}
      >
        <h2
          className="pixel-text text-xs mb-4"
          style={{ color: dayTheme.colors.coin }}
        >
          TECH STACK
        </h2>
        <div className="flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <PixelButton
              key={tech}
              variant="brick"
              size="sm"
              aria-label={`Technology: ${tech}`}
              style={{ cursor: "default", pointerEvents: "none" }}
            >
              {tech}
            </PixelButton>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        {hasLiveLink && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${project.title} live`}
          >
            <PixelButton variant="coin" size="md">
              ▶ VIEW LIVE
            </PixelButton>
          </a>
        )}
        <PixelButton
          variant="pipe"
          size="md"
          onClick={() => router.push(ROUTES.projects)}
          aria-label="Back to Projects"
        >
          ← BACK TO PROJECTS
        </PixelButton>
      </div>
    </div>
  );
}

export default ProjectDetailContent;
