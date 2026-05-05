"use client";

/**
 * @file features/projects/index.tsx — Projects Section
 *
 * Displays the portfolio's featured projects as pixel-art styled cards.
 * Each project card uses PixelCard (elevated variant) with the useTilt hook,
 * a hover overlay showing the full description, tech stack tags rendered as
 * non-interactive PixelButton (brick/sm), and a live/coming-soon link rendered
 * as PixelButton (coin/sm). Projects with link="#" trigger a NotificationToast
 * instead of navigating.
 *
 * Migrated from `app/components/sections/projects.tsx` and restyled to match
 * the Mario Pixel Portfolio design system.
 *
 * @example
 * ```tsx
 * import { ProjectsSection } from "@/features/projects";
 * <ProjectsSection />
 * ```
 */

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

import { projects } from "../../lib/data";
import { dayTheme } from "../../lib/theme";
import { useTilt } from "../../hooks/use-tilt";
import PixelCard from "../../components/ui/pixel-card";
import PixelButton from "../../components/ui/pixel-button";
import NotificationToast from "../../components/ui/notification-toast";
import { SectionWrapper } from "../../components/layout/section-wrapper";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface NotificationState {
  isVisible: boolean;
  message: string;
}

// ---------------------------------------------------------------------------
// ProjectCard — individual project card
// ---------------------------------------------------------------------------

interface ProjectCardProps {
  project: (typeof projects)[number];
  index: number;
  onNotice: (message: string) => void;
}

/**
 * ProjectCard
 *
 * Renders a single project as a PixelCard (elevated) with:
 * - useTilt hook for 3-D tilt effect on mouse move
 * - Aspect-ratio image using Next.js <Image>
 * - Default view: truncated description + tech stack tags
 * - Hover overlay: full description with pixel-art scrollbar
 * - Footer: live/coming-soon PixelButton (coin/sm)
 */
function ProjectCard({ project, index, onNotice }: ProjectCardProps) {
  const { ref, style: tiltStyle } = useTilt(8);

  const isComingSoon = project.link === "#";

  const handleLinkClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isComingSoon) {
      e.preventDefault();
      onNotice("Coming Soon!");
    } else {
      window.open(project.link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      style={tiltStyle}
      className="preserve-3d"
    >
      <PixelCard
        variant="elevated"
        className="group relative overflow-hidden flex flex-col h-full"
        style={{ backgroundColor: "#1a1a2e" }}
      >
        {/* Project image */}
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
          {/* Accent overlay on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `linear-gradient(135deg, ${project.accent}15, ${project.accent}05)`,
            }}
          />
        </div>

        {/* Card body */}
        <div className="p-6 relative flex flex-col flex-grow min-h-[280px]">
          {/* Project title */}
          <h4
            className="pixel-text text-base mb-3 transition-colors duration-300"
            style={{ color: dayTheme.colors.coin }}
          >
            {project.title}
          </h4>

          {/* Content area: default view + hover overlay */}
          <div className="relative flex-grow">
            {/* Default view — truncated description + tech tags */}
            <div className="group-hover:opacity-0 group-hover:invisible transition-all duration-300">
              <p className="text-gray-300 text-xs mb-4 line-clamp-2 leading-relaxed">
                {project.description}
              </p>
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
            </div>

            {/* Hover overlay — full description with pixel-art scrollbar */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto overflow-y-auto scrollbar-hide"
              style={{ scrollbarWidth: "none" }}
            >
              <p className="text-gray-300 text-xs leading-relaxed">
                {project.description}
              </p>
            </div>
          </div>

          {/* Footer: live/coming-soon link */}
          <div
            className="flex items-center gap-3 mt-auto pt-4"
            style={{ borderTop: `1px solid ${dayTheme.colors.border}` }}
          >
            <PixelButton
              variant="coin"
              size="sm"
              onClick={handleLinkClick}
              aria-label={isComingSoon ? "Coming Soon" : `Visit ${project.title}`}
            >
              <span className="flex items-center gap-1">
                <ExternalLink size={10} />
                {isComingSoon ? "Coming Soon" : "Live Project"}
              </span>
            </PixelButton>
          </div>
        </div>
      </PixelCard>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// ProjectsSection — main export
// ---------------------------------------------------------------------------

/**
 * ProjectsSection
 *
 * Renders the full Projects section wrapped in SectionWrapper (id="projects").
 * Displays a 3-col / 2-col / 1-col responsive grid of ProjectCard components.
 * Manages the NotificationToast state for coming-soon projects.
 *
 * @example
 * ```tsx
 * <ProjectsSection />
 * ```
 */
export function ProjectsSection() {
  const [notification, setNotification] = useState<NotificationState>({
    isVisible: false,
    message: "",
  });

  const showNotice = (message: string) => {
    setNotification({ isVisible: true, message });
  };

  const closeNotice = () => {
    setNotification((prev) => ({ ...prev, isVisible: false }));
  };

  return (
    <SectionWrapper id="projects">
      {/* Notification toast for coming-soon projects */}
      <NotificationToast
        isVisible={notification.isVisible}
        message={notification.message}
        onClose={closeNotice}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <h2
              className="pixel-text mb-4"
              style={{ color: dayTheme.colors.coin, fontSize: "10px" }}
            >
              CASE STUDIES
            </h2>
            <h3
              className="pixel-text text-2xl md:text-3xl"
              style={{ color: dayTheme.colors.text }}
            >
              PROJECTS
            </h3>
          </div>
          <p
            className="text-sm max-w-sm"
            style={{ color: dayTheme.colors.text, opacity: 0.8 }}
          >
            A selection of my recent work exploring the intersection of design
            and technology.
          </p>
        </div>

        {/* Projects grid: 1-col mobile / 2-col tablet / 3-col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={i}
              onNotice={showNotice}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

export default ProjectsSection;
