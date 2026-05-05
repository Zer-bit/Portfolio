import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { projects, toSlug } from "../../lib/data";
import { dayTheme } from "../../lib/theme";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generates static params for all project slugs at build time.
 * Requirements: 5.8, 17.5, 19.1
 */
export function generateStaticParams() {
  return projects.map((project) => ({
    slug: toSlug(project.title),
  }));
}

/**
 * Generates page metadata with the project title.
 * Requirements: 18.3
 */
export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => toSlug(p.title) === slug);
  return {
    title: project
      ? `Jezer Parales | ${project.title}`
      : "Jezer Parales | Level Not Found",
  };
}

/**
 * Lazy-loaded client component for the project detail content.
 * Uses next/dynamic with ssr:false per Requirement 14.2.
 */
const ProjectDetailContent = dynamic(
  () =>
    import("./ProjectDetailContent").then((mod) => ({
      default: mod.ProjectDetailContent,
    })),
  { ssr: false }
);

/**
 * ProjectDetailPage — Dynamic route `/projects/[slug]`
 * Requirements: 2.4, 5.3, 5.4, 5.5, 5.6, 5.8, 14.2, 17.1, 18.3
 */
export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="pixel-text" style={{ color: dayTheme.colors.coin }}>
            LOADING...
          </p>
        </div>
      }
    >
      <ProjectDetailContent slug={slug} />
    </Suspense>
  );
}
