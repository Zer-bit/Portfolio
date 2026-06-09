import type { Metadata } from "next";
import ProjectsWrapper from "./ProjectsWrapper";

export const metadata: Metadata = {
  title: "Jezer Parales | Projects",
};

export default function ProjectsPage() {
  return <ProjectsWrapper />;
}
