"use client";

import dynamic from "next/dynamic";

// Dynamically load the ExperienceContent with ssr: false
// to prevent hydration mismatches and client-side page load freezes.
const ExperienceContent = dynamic(
  () => import("./ExperienceContent"),
  { ssr: false }
);

export default function ExperienceWrapper() {
  return <ExperienceContent />;
}
