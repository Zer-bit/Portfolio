import type { Metadata } from "next";
import SettingsWrapper from "./SettingsWrapper";

export const metadata: Metadata = {
  title: "Jezer Parales | Settings",
  description: "Customize your portfolio experience — toggle theme and sound effects.",
};

export default function SettingsPage() {
  return <SettingsWrapper />;
}
