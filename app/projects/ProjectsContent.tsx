"use client";

/**
 * @file app/projects/ProjectsContent.tsx — Projects Page Client Content
 *
 * Client component that renders all projects as LevelCard components in a
 * responsive grid. NotificationToast for coming-soon projects is handled
 * internally by each LevelCard.
 */

import React from "react";
import dynamic from "next/dynamic";
import { projects } from "../lib/data";
import { dayTheme } from "../lib/theme";

// LevelCard dynamic import with ssr:false
const LevelCard = dynamic(
  () => import("../components/game/LevelCard").then((mod) => ({ default: mod.LevelCardComponent })),
  { ssr: false }
);

export function ProjectsContent() {
  return (
    <div className="max-w-7xl mx-auto px-6 pb-16 pt-8">
      {/* Page heading */}
      <div className="mb-12 text-center">
        <h1
          className="pixel-text text-lg md:text-2xl"
          style={{ color: dayTheme.colors.coin }}
        >
          SELECT A PROJECT
        </h1>
      </div>

      {/* Projects grid: 1-col mobile / 2-col tablet / 3-col desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <LevelCard key={project.title} project={project} />
        ))}
      </div>
    </div>
  );
}

export default ProjectsContent;
