import type { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "Jezer Parales | About",
  description:
    "Learn about Jezer Parales — a full-stack developer crafting pixel-perfect web experiences.",
};

export default function AboutPage() {
  return <AboutContent />;
}
