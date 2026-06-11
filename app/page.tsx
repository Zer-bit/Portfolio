import type { Metadata } from "next";
import StartScreen from "./components/game/StartScreen";

export const metadata: Metadata = {
  title: "Welcome",
  description: "Welcome to the interactive, Mario-themed portfolio of Jezer Parales, a Full Stack Developer. Press Start to explore projects, skills, and experience.",
};

export default function Home() {
  return (
    <main>
      <StartScreen />
    </main>
  );
}
