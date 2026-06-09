"use client";

import dynamic from "next/dynamic";

const Skills = dynamic(
  () => import("../features/skills/index"),
  { ssr: false }
);

export default function SkillsWrapper() {
  return <Skills />;
}
