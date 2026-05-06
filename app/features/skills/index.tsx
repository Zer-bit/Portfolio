"use client";

/**
 * @file features/skills/index.tsx — Skills Section
 *
 * Renders the Skills section of the Mario Pixel Portfolio. Technical skill
 * categories are displayed as elevated PixelCards with a power-up icon badge,
 * individual skill tags as non-interactive coin PixelButtons, and professional
 * skills as default PixelCards preserving the icon + description layout.
 *
 * Cards enter the viewport with a staggered 100ms delay per card, implemented
 * via Framer Motion `motion.div` wrappers with `transition={{ delay: index * 0.1 }}`.
 *
 * Data is sourced from `lib/data.ts` without modification (Requirement 10.4).
 *
 * @example
 * ```tsx
 * import Skills from "@/features/skills";
 * <Skills />
 * ```
 */

import { motion, type Variants } from "framer-motion";
import { Code, Briefcase } from "lucide-react";
import { PixelCard } from "../../components/ui/pixel-card";
import { PixelButton } from "../../components/ui/pixel-button";
import { technicalSkills, professionalSkills } from "../../lib/data";
import { dayTheme } from "../../lib/theme";

// ---------------------------------------------------------------------------
// Shared animation variants for staggered card entrance
// ---------------------------------------------------------------------------

/** Fade-up variant used for each staggered card wrapper. */
const cardVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Skills — Skills Section
 *
 * Renders technical skill categories as elevated PixelCards and professional
 * skills as default PixelCards, both with staggered entrance animations.
 * Wrapped in a SectionWrapper with `id="skills"` for anchor-link navigation.
 *
 * @example
 * ```tsx
 * <Skills />
 * ```
 */
export default function Skills() {
  return (
    <section id="skills" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section heading */}
        <div className="text-center mb-16">
          <h2
            className="pixel-text text-4xl md:text-5xl font-bold"
            style={{ color: dayTheme.colors.coin }}
          >
            SKILLS
          </h2>
        </div>

        {/* Two-column layout: Technical Skills | Professional Skills */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* ── Technical Skills ─────────────────────────────────────── */}
          <div>
            <h4
              className="pixel-text text-lg font-bold mb-8 flex items-center gap-3"
              style={{ color: dayTheme.colors.text }}
            >
              <span
                className="p-2"
                style={{
                  color: dayTheme.colors.coin,
                  backgroundColor: `${dayTheme.colors.coin}22`,
                }}
              >
                <Code size={24} />
              </span>
              Technical Proficiencies
            </h4>

            <div className="space-y-6">
              {technicalSkills.map((category, index) => (
                <motion.div
                  key={category.name}
                  variants={cardVariant}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
                >
                  <PixelCard variant="elevated" className="p-6">
                    {/* Power-up icon badge + category name */}
                    <div className="flex items-center gap-4 mb-4">
                      {/* Power-up icon badge styled with theme coin color */}
                      <span
                        className="pixel-shadow inline-flex items-center justify-center w-8 h-8"
                        style={{
                          backgroundColor: dayTheme.colors.coin,
                          color: "#111111",
                          border: `2px solid ${dayTheme.colors.border}`,
                        }}
                      >
                        <category.icon size={16} />
                      </span>
                      <h5
                        className="pixel-text font-bold"
                        style={{ color: dayTheme.colors.text, fontSize: "11px" }}
                      >
                        {category.name}
                      </h5>
                    </div>

                    {/* Individual skill tags as non-interactive coin PixelButtons */}
                    <div className="flex flex-wrap gap-2">
                      {category.items.map((skill) => (
                        <PixelButton
                          key={skill}
                          variant="coin"
                          size="sm"
                          tabIndex={-1}
                          style={{ cursor: "default" }}
                        >
                          {skill}
                        </PixelButton>
                      ))}
                    </div>
                  </PixelCard>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Professional Skills ──────────────────────────────────── */}
          <div>
            <h4
              className="pixel-text text-lg font-bold mb-8 flex items-center gap-3"
              style={{ color: dayTheme.colors.text }}
            >
              <span
                className="p-2"
                style={{
                  color: dayTheme.colors.sky,
                  backgroundColor: `${dayTheme.colors.sky}33`,
                }}
              >
                <Briefcase size={24} />
              </span>
              Professional Skills
            </h4>

            <div className="space-y-6">
              {professionalSkills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  variants={cardVariant}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
                >
                  <PixelCard variant="default" className="p-6">
                    <div className="flex items-start gap-5">
                      {/* Icon */}
                      <div
                        className="w-12 h-12 flex-shrink-0 flex items-center justify-center pixel-shadow"
                        style={{
                          backgroundColor: `${skill.color}22`,
                          color: skill.color,
                          border: `2px solid ${dayTheme.colors.border}`,
                        }}
                      >
                        <skill.icon size={24} />
                      </div>

                      {/* Name + description */}
                      <div>
                        <h5
                          className="pixel-text font-bold mb-1"
                          style={{ color: dayTheme.colors.text, fontSize: "10px" }}
                        >
                          {skill.name}
                        </h5>
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: `${dayTheme.colors.text}cc` }}
                        >
                          {skill.description}
                        </p>
                      </div>
                    </div>
                  </PixelCard>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
