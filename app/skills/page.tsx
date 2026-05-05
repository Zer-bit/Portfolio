import type { Metadata } from "next";
import Skills from "../features/skills/index";

export const metadata: Metadata = {
  title: "Jezer Parales | Skills",
};

export default function SkillsPage() {
  return <Skills />;
}
