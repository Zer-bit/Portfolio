"use client";

/**
 * @file ProjectDetailWrapper.tsx — Client wrapper for ProjectDetailContent
 *
 * This client component uses next/dynamic with ssr:false to lazy-load
 * the ProjectDetailContent component. The dynamic import with ssr:false
 * must live in a client component (not a server component).
 *
 * Requirements: 14.2
 */

import dynamic from "next/dynamic";

interface ProjectDetailWrapperProps {
  slug: string;
}

const ProjectDetailContent = dynamic(
  () =>
    import("./ProjectDetailContent").then((mod) => ({
      default: mod.ProjectDetailContent,
    })),
  { ssr: false }
);

export default function ProjectDetailWrapper({ slug }: ProjectDetailWrapperProps) {
  return <ProjectDetailContent slug={slug} />;
}
