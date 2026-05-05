import type { Metadata } from "next";
import StartScreen from "./components/game/StartScreen";

export const metadata: Metadata = {
  title: "Jezer Parales | Start",
  description: "Welcome to Jezer Parales' Mario-themed portfolio. Press Start to begin.",
};

export default function Home() {
  return (
    <main>
      <StartScreen />
    </main>
  );
}
