"use client";

// This client component uses next/dynamic with ssr:false to lazy-load the ProjectD...

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
