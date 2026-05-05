"use client";

/**
 * @file app/experience/ExperienceContent.tsx — Experience Page Client Content
 *
 * Client component that renders work experience entries as a vertical
 * game-progression timeline using PixelCard components and Framer Motion
 * entrance animations.
 *
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
 */

import { motion } from "framer-motion";
import { experience } from "../lib/data";
import { dayTheme } from "../lib/theme";
import { fadeUpVariant } from "../lib/animations";
import { PixelCard } from "../components/ui/pixel-card";

export function ExperienceContent() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Page heading */}
      <div className="mb-12 text-center">
        <h1
          className="pixel-text text-lg md:text-2xl"
          style={{ color: dayTheme.colors.coin }}
        >
          GAME PROGRESSION
        </h1>
      </div>

      {/* Vertical timeline */}
      <div className="relative">
        {/* Timeline connector line */}
        <div
          className="absolute left-4 top-0 bottom-0 w-0.5"
          style={{ backgroundColor: dayTheme.colors.border }}
          aria-hidden="true"
        />

        <div className="flex flex-col gap-8">
          {experience.map((entry, index) => (
            <motion.div
              key={`${entry.company}-${entry.startDate}`}
              variants={fadeUpVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-12"
            >
              {/* Timeline dot */}
              <div
                className="absolute left-2 top-6 w-4 h-4 -translate-x-1/2"
                style={{
                  backgroundColor: entry.accent,
                  border: `2px solid ${dayTheme.colors.border}`,
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
                    style={{ color: dayTheme.colors.coin }}
                  >
                    {entry.jobTitle}
                  </h2>

                  {/* Company */}
                  <h3
                    className="pixel-text text-xs mb-2"
                    style={{ color: dayTheme.colors.text }}
                  >
                    {entry.company}
                  </h3>

                  {/* Date range */}
                  <p
                    className="pixel-text text-xs mb-4"
                    style={{ color: dayTheme.colors.pipe }}
                  >
                    {entry.startDate} – {entry.endDate}
                  </p>

                  {/* Description */}
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: dayTheme.colors.text }}
                  >
                    {entry.description}
                  </p>
                </PixelCard>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ExperienceContent;
