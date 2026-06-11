import type { Metadata } from "next";
import AboutWrapper from "./AboutWrapper";

export const metadata: Metadata = {
  title: "About Me",
  description:
    "Developer profile of Jezer Parales. Learn about Jezer's role as a Full Stack Web Developer based in the Philippines, his development career stages, and his game developer dreams.",
};

export default function AboutPage() {
  return <AboutWrapper />;
}
