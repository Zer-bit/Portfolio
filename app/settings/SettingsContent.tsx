"use client";

/**
 * @file SettingsContent.tsx — Settings Page Client Content
 *
 * Renders a pixel-art settings panel with a theme toggle (day/night) and a
 * sound toggle. All visual tokens are sourced from `app/lib/theme.ts` and all
 * interactive elements use existing `PixelCard` and `PixelButton` components.
 *
 * @satisfies Requirement 16.1 — Pixel-art settings panel using PixelCard and PixelButton
 * @satisfies Requirement 16.2 — Theme toggle switches between dayTheme and nightTheme
 * @satisfies Requirement 16.3 — Sound toggle enables/disables use-sound hook behavior
 * @satisfies Requirement 16.4 — Uses only existing theme color tokens and CSS classes
 * @satisfies Requirement 18.2 — All interactive elements have descriptive aria-label attributes
 * @satisfies Requirement 18.3 — Page has a unique <title> via metadata export
 */

import { dayTheme, nightTheme } from "../lib/theme";
import { PixelCard } from "../components/ui/pixel-card";
import { PixelButton } from "../components/ui/pixel-button";
import { useThemeContext } from "../lib/theme-context";
import { useSound } from "../hooks/use-sound";

// ---------------------------------------------------------------------------
// SettingRow — a single labeled toggle row inside the settings panel
// ---------------------------------------------------------------------------

interface SettingRowProps {
  /** Label displayed to the left of the toggle. */
  label: string;
  /** Current state description shown to the right (e.g. "DAY" / "NIGHT"). */
  value: string;
  /** Accessible description of what the button does. */
  ariaLabel: string;
  /** Button label text. */
  buttonLabel: string;
  /** Button variant. */
  variant: "coin" | "pipe" | "brick";
  /** Called when the toggle button is clicked. */
  onToggle: () => void;
  /** Active theme for color tokens. */
  activeColors: typeof dayTheme.colors;
}

function SettingRow({
  label,
  value,
  ariaLabel,
  buttonLabel,
  variant,
  onToggle,
  activeColors,
}: SettingRowProps) {
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      style={{ padding: "16px 0", borderBottom: `1px solid ${activeColors.border}` }}
    >
      {/* Label + current value */}
      <div className="flex flex-col gap-1">
        <span
          className="pixel-text"
          style={{ color: activeColors.coin, fontSize: "10px" }}
        >
          {label}
        </span>
        <span
          className="pixel-text"
          style={{ color: activeColors.text, fontSize: "8px" }}
        >
          {value}
        </span>
      </div>

      {/* Toggle button */}
      <PixelButton
        variant={variant}
        size="sm"
        onClick={onToggle}
        aria-label={ariaLabel}
      >
        {buttonLabel}
      </PixelButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SettingsContent
// ---------------------------------------------------------------------------

/**
 * SettingsContent — the client-rendered body of the Settings page.
 *
 * Reads and mutates theme + sound state via `useThemeContext`. All colors
 * are derived from the currently active theme so the panel itself reflects
 * the chosen palette.
 */
export function SettingsContent() {
  const { theme, toggleTheme, soundEnabled, toggleSound } = useThemeContext();
  const { playClick, playCoin, playBounce, playPipe } = useSound();

  const activeColors = theme === "night" ? nightTheme.colors : dayTheme.colors;

  const handleThemeToggle = () => {
    playClick();
    toggleTheme();
  };

  const handleSoundToggle = () => {
    // Play coin sound before muting, or click when unmuting
    if (!soundEnabled) playClick();
    else playCoin();
    toggleSound();
  };

  return (
    <div className="max-w-2xl mx-auto px-6 pb-16 pt-8">
      {/* Page heading */}
      <div className="mb-12 text-center">
        <h1
          className="pixel-text text-lg md:text-2xl"
          style={{ color: activeColors.coin }}
        >
          SETTINGS
        </h1>
        <p
          className="pixel-text mt-4"
          style={{ color: activeColors.text, fontSize: "8px" }}
        >
          CUSTOMIZE YOUR EXPERIENCE
        </p>
      </div>

      {/* Settings panel */}
      <PixelCard variant="elevated" style={{ padding: "24px" }}>
        {/* Section heading */}
        <h2
          className="pixel-text mb-6"
          style={{ color: activeColors.mario, fontSize: "10px" }}
        >
          GAME OPTIONS
        </h2>

        {/* Theme toggle row */}
        <SettingRow
          label="THEME"
          value={theme === "day" ? "☀  DAY MODE" : "🌙  NIGHT MODE"}
          ariaLabel={`Switch to ${theme === "day" ? "night" : "day"} theme`}
          buttonLabel={theme === "day" ? "NIGHT MODE" : "DAY MODE"}
          variant="coin"
          onToggle={handleThemeToggle}
          activeColors={activeColors}
        />

        {/* Sound toggle row */}
        <SettingRow
          label="SOUND EFFECTS"
          value={soundEnabled ? "♪  ON" : "✕  OFF"}
          ariaLabel={`Turn sound effects ${soundEnabled ? "off" : "on"}`}
          buttonLabel={soundEnabled ? "MUTE" : "UNMUTE"}
          variant="pipe"
          onToggle={handleSoundToggle}
          activeColors={activeColors}
        />
      </PixelCard>

      {/* Info note */}
      <p
        className="pixel-text text-center mt-8"
        style={{ color: activeColors.text, fontSize: "7px", opacity: 0.7 }}
      >
        SETTINGS ARE SAVED AUTOMATICALLY
      </p>

      {/* Sound test panel */}
      <PixelCard variant="elevated" style={{ padding: "24px", marginTop: "24px" }}>
        <h2
          className="pixel-text mb-4"
          style={{ color: activeColors.mario, fontSize: "10px" }}
        >
          SOUND TEST
        </h2>
        <p
          className="pixel-text mb-6"
          style={{ color: activeColors.text, fontSize: "8px", opacity: 0.8 }}
        >
          TAP A BUTTON TO TEST AUDIO OUTPUT
        </p>
        <div className="flex flex-wrap gap-3">
          <PixelButton
            variant="coin"
            size="sm"
            onClick={playCoin}
            aria-label="Test coin sound"
          >
            ♪ COIN
          </PixelButton>

          <PixelButton
            variant="pipe"
            size="sm"
            onClick={playBounce}
            aria-label="Test jump sound"
          >
            ↑ JUMP
          </PixelButton>

          <PixelButton
            variant="brick"
            size="sm"
            onClick={playPipe}
            aria-label="Test pipe sound"
          >
            ↓ PIPE
          </PixelButton>
        </div>
      </PixelCard>
    </div>
  );
}

export default SettingsContent;
