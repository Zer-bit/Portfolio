import type { Metadata } from "next";
import ProjectsContent from "./ProjectsContent";

export const metadata: Metadata = {
  title: "Jezer Parales | Projects",
};

export default function ProjectsPage() {
  return <ProjectsContent />;
}
