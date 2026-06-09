import type { Metadata } from "next";
import AboutWrapper from "./AboutWrapper";

export const metadata: Metadata = {
  title: "Jezer Parales | About",
  description:
    "Learn about Jezer Parales — a full-stack developer crafting pixel-perfect web experiences.",
};

export default function AboutPage() {
  return <AboutWrapper />;
}
