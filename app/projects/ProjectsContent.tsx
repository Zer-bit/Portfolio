"use client";

/**
 * @file app/projects/ProjectsContent.tsx — Projects Page Client Content
 *
 * Renders projects dynamically from Supabase / data layer with pixel-art skeleton loading.
 */

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { dayTheme } from "../lib/theme";
import { fetchProjects, type ProjectItem } from "../lib/db-data";
import { LevelCardSkeleton } from "../components/ui/skeleton-loader";

// LevelCard dynamic import with ssr:false
const LevelCard = dynamic(
  () => import("../components/game/LevelCard").then((mod) => ({ default: mod.LevelCardComponent })),
  { ssr: false }
);

export function ProjectsContent() {
  const [projectsList, setProjectsList] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    fetchProjects().then((data) => {
      if (isMounted) {
        setProjectsList(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

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
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <LevelCardSkeleton key={idx} />
            ))
          : projectsList.map((project) => (
              <LevelCard key={project.id || project.title} project={project} />
            ))}
      </div>
    </div>
  );
}

export default ProjectsContent;
