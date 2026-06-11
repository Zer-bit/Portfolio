import type { Metadata } from "next";
import ExperienceWrapper from "./ExperienceWrapper";

export const metadata: Metadata = {
  title: "Work Experience",
  description: "View the game progression timeline of Jezer Parales' software engineering career. Detailing full-stack achievements at Inspire Holdings Incorporated, freelance projects, and Android mobile app development.",
};

export default function ExperiencePage() {
  return <ExperienceWrapper />;
}
