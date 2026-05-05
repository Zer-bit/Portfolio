import type { Metadata } from "next";
import SettingsContent from "./SettingsContent";

/**
 * @file app/settings/page.tsx — Settings Page
 *
 * Renders the Settings page where visitors can toggle theme (day/night) and
 * sound effects (on/off). All settings are persisted in localStorage via the
 * ThemeContext provider.
 *
 * @satisfies Requirement 2.9  — Serves SettingsPage at /settings route
 * @satisfies Requirement 16.1 — Renders pixel-art settings panel
 * @satisfies Requirement 18.3 — Unique <title> via metadata export
 */

export const metadata: Metadata = {
  title: "Jezer Parales | Settings",
  description: "Customize your portfolio experience — toggle theme and sound effects.",
};

export default function SettingsPage() {
  return <SettingsContent />;
}
