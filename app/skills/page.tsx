import type { Metadata } from "next";
import SkillsWrapper from "./SkillsWrapper";

export const metadata: Metadata = {
  title: "Technical Skills",
  description: "Explore the technical proficiencies and developer power-ups of Jezer Parales: JavaScript/TypeScript, React, Next.js, Flutter/Dart, Node.js, C#, SQL databases, Linux OS, and developer DevOps tools.",
};

export default function SkillsPage() {
  return <SkillsWrapper />;
}
