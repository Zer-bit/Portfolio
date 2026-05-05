import type { Metadata } from "next";
import WorldPageContent from "./WorldPageContent";

export const metadata: Metadata = {
  title: "Jezer Parales | World Map",
  description: "Choose a world to explore in Jezer Parales' Mario-themed portfolio.",
};

export default function WorldPage() {
  return <WorldPageContent />;
}
