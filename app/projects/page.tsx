import type { Metadata } from "next";
import ProjectsWrapper from "./ProjectsWrapper";

export const metadata: Metadata = {
  title: "Projects Showcase",
  description: "Browse the showcase level select of projects built by Jezer Parales, including IHI corporate portals, iPageant interactive platforms, Flutter media applications, and Node.js REST APIs.",
};

export default function ProjectsPage() {
  return <ProjectsWrapper />;
}
