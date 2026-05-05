import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { projects, toSlug } from "../../lib/data";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

// ---------------------------------------------------------------------------
// Static Params Generation
// ---------------------------------------------------------------------------

/**
 * Generates static params for all project slugs at build time.
 * Maps each project title to its kebab-case slug via `toSlug`.
 * Requirements: 5.8, 17.5, 19.1
 */
export function generateStaticParams() {
  return projects.map((project) => ({
    slug: toSlug(project.title),
  }));
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Dynamic Content Component (ssr: false)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

/**
 * ProjectDetailPage — Dynamic route `/projects/[slug]`
 *
 * Looks up the project by slug and renders the full detail view, or a
 * pixel-art "Level Not Found" fallback if no match is found.
 *
 * Requirements: 2.4, 2.5, 5.3, 5.4, 5.5, 5.6, 5.8, 14.2, 17.1, 18.3
 */
export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="pixel-text" style={{ color: "#f8b800" }}>
            LOADING...
          </p>
        </div>
      }
    >
      <ProjectDetailContent slug={slug} />
    </Suspense>
  );
}
