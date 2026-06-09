"use client";

/**
 * @file app/experience/ExperienceContent.tsx — Experience Page Client Content
 *
 * Client component that renders work experience entries as a vertical
 * game-progression timeline using PixelCard components and Framer Motion
 * entrance animations. Supports expanding cards to show detailed achievements,
 * projects reference, and technologies.
 *
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { experience } from "../lib/data";
import { dayTheme, nightTheme } from "../lib/theme";
import { useThemeContext } from "../lib/theme-context";
import { fadeUpVariant } from "../lib/animations";
import { PixelCard } from "../components/ui/pixel-card";
import { PixelButton } from "../components/ui/pixel-button";

export function ExperienceContent() {
  const { theme } = useThemeContext();
  const activeTheme = theme === "night" ? nightTheme : dayTheme;
  // Track expanded cards. Using a record so multiple cards can be expanded at once.
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const toggleExpand = (index: number) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="max-w-3xl mx-auto px-6 pb-16 pt-8">
      {/* Page heading */}
      <div className="mb-12 text-center">
        <h1
          className="pixel-text text-lg md:text-2xl"
          style={{ color: activeTheme.colors.coin }}
        >
          GAME PROGRESSION
        </h1>
      </div>

      {/* Vertical timeline */}
      <div className="relative">
        {/* Timeline connector line */}
        <div
          className="absolute left-4 top-0 bottom-0 w-0.5"
          style={{ backgroundColor: activeTheme.colors.border }}
          aria-hidden="true"
        />

        <div className="flex flex-col gap-8">
          {experience.map((entry, index) => {
            const isExpanded = !!expanded[index];

            return (
              <motion.div
                key={`${entry.company}-${entry.startDate}`}
                variants={fadeUpVariant}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
                className="relative pl-12"
              >
                {/* Timeline dot */}
                <div
                  className="absolute left-2 top-6 w-4 h-4 -translate-x-1/2"
                  style={{
                    backgroundColor: entry.accent,
                    border: `2px solid ${activeTheme.colors.border}`,
                  }}
                  aria-hidden="true"
                />

                <div aria-label={`${entry.jobTitle} at ${entry.company}`}>
                  <PixelCard
                    variant="elevated"
                    style={{
                      borderLeft: `4px solid ${entry.accent}`,
                      padding: "24px",
                    }}
                  >
                    {/* Job title */}
                    <h2
                      className="pixel-text text-xs md:text-sm mb-2"
                      style={{ color: activeTheme.colors.coin }}
                    >
                      {entry.jobTitle}
                    </h2>

                    {/* Company */}
                    <h3
                      className="pixel-text text-xs mb-2"
                      style={{ color: activeTheme.colors.text }}
                    >
                      {entry.company}
                    </h3>

                    {/* Date range */}
                    <p
                      className="pixel-text text-xs mb-4"
                      style={{ color: activeTheme.colors.pipe }}
                    >
                      {entry.startDate} – {entry.endDate}
                    </p>

                    {/* Overview description */}
                    <p
                      className="text-sm leading-relaxed mb-4"
                      style={{ color: activeTheme.colors.text }}
                    >
                      {entry.overview}
                    </p>

                    {/* Toggle button */}
                    <div className="mb-2">
                      <PixelButton
                        variant={isExpanded ? "brick" : "coin"}
                        size="sm"
                        onClick={() => toggleExpand(index)}
                        aria-label={`${isExpanded ? "Hide" : "Show"} details for ${entry.jobTitle} at ${entry.company}`}
                      >
                        {isExpanded ? "▼ HIDE" : "▶ DETAILS"}
                      </PixelButton>
                    </div>

                    {/* Expandable Section */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          style={{ overflow: "hidden" }}
                        >
                          {/* Divider */}
                          <div
                            className="my-4"
                            style={{ height: "1px", backgroundColor: activeTheme.colors.border }}
                          />

                          {/* Achievements */}
                          <div className="mb-4">
                            <h4
                              className="pixel-text text-xs mb-3"
                              style={{ color: activeTheme.colors.coin, fontSize: "9px" }}
                            >
                              ★ STAGE OBJECTIVES / ACHIEVEMENTS
                            </h4>
                            <ul className="list-none space-y-2 pl-0">
                              {entry.details.map((detail, idx) => (
                                <li
                                  key={idx}
                                  className="text-sm leading-relaxed flex items-start gap-2"
                                  style={{ color: activeTheme.colors.text }}
                                >
                                  <span
                                    className="pixel-text flex-shrink-0"
                                    style={{ color: entry.accent, fontSize: "8px", marginTop: "4px" }}
                                  >
                                    ▶
                                  </span>
                                  <span>{detail}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Projects Reference */}
                          {entry.projects && entry.projects.length > 0 && (
                            <div className="mb-4">
                              <h4
                                className="pixel-text text-xs mb-3"
                                style={{ color: activeTheme.colors.coin, fontSize: "9px" }}
                              >
                                🗺️ COMPLETED MAP STAGES
                              </h4>
                              <div className="flex flex-wrap gap-3">
                                {entry.projects.map((proj) => {
                                  if (proj.link && proj.link !== "#") {
                                    return (
                                      <a
                                        key={proj.title}
                                        href={proj.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="pixel-text flex items-center gap-1 hover:underline"
                                        style={{ color: activeTheme.colors.text, fontSize: "8px" }}
                                      >
                                        [{proj.title.toUpperCase()} ↗]
                                      </a>
                                    );
                                  }
                                  return (
                                    <span
                                      key={proj.title}
                                      className="pixel-text"
                                      style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "8px" }}
                                    >
                                      [{proj.title.toUpperCase()}]
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Tech badges */}
                          <div>
                            <h4
                              className="pixel-text text-xs mb-3"
                              style={{ color: activeTheme.colors.coin, fontSize: "9px" }}
                            >
                              🎒 POWER-UPS USED
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {entry.tech.map((t) => (
                                <PixelButton
                                  key={t}
                                  variant="coin"
                                  size="sm"
                                  style={{ cursor: "default", pointerEvents: "none" }}
                                >
                                  {t}
                                </PixelButton>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </PixelCard>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ExperienceContent;
