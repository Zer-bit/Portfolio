"use client";

import React, { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  Code,
  Briefcase,
  Globe,
  Smartphone,
  Cpu,
  Rocket,
  Shield,
  Palette,
} from "lucide-react";
import { PixelCard } from "../../components/ui/pixel-card";
import { PixelButton } from "../../components/ui/pixel-button";
import {
  fetchTechnicalSkills,
  fetchProfessionalSkills,
  type TechnicalSkillItem,
  type ProfessionalSkillItem,
} from "../../lib/db-data";
import { dayTheme } from "../../lib/theme";
import { SkillCardSkeleton } from "../../components/ui/skeleton-loader";

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Icon resolver helper
function renderIcon(iconName: string, size = 16) {
  switch (iconName) {
    case "Globe":
      return <Globe size={size} />;
    case "Smartphone":
      return <Smartphone size={size} />;
    case "Cpu":
      return <Cpu size={size} />;
    case "Rocket":
      return <Rocket size={size} />;
    case "Shield":
      return <Shield size={size} />;
    case "Palette":
      return <Palette size={size} />;
    case "Briefcase":
      return <Briefcase size={size} />;
    case "Code":
    default:
      return <Code size={size} />;
  }
}

export default function Skills() {
  const [techSkills, setTechSkills] = useState<TechnicalSkillItem[]>([]);
  const [profSkills, setProfSkills] = useState<ProfessionalSkillItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([fetchTechnicalSkills(), fetchProfessionalSkills()]).then(
      ([techData, profData]) => {
        if (isMounted) {
          setTechSkills(techData);
          setProfSkills(profData);
          setLoading(false);
        }
      }
    );
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 pb-16 pt-12">
      {/* Section heading */}
      <div className="mb-12 text-center">
        <h1
          className="pixel-text text-lg md:text-2xl"
          style={{ color: dayTheme.colors.coin }}
        >
          SKILLS
        </h1>
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
              {loading
                ? Array.from({ length: 4 }).map((_, idx) => (
                    <SkillCardSkeleton key={idx} />
                  ))
                : techSkills.map((category, index) => (
                    <motion.div
                      key={category.id || category.name}
                      variants={cardVariant}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
                    >
                      <PixelCard variant="elevated" className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <span
                            className="pixel-shadow inline-flex items-center justify-center w-8 h-8"
                            style={{
                              backgroundColor: dayTheme.colors.coin,
                              color: "#111111",
                              border: `2px solid ${dayTheme.colors.border}`,
                            }}
                          >
                            {renderIcon(category.icon, 16)}
                          </span>
                          <h5
                            className="pixel-text font-bold"
                            style={{ color: dayTheme.colors.text, fontSize: "11px" }}
                          >
                            {category.name}
                          </h5>
                        </div>

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
              {loading
                ? Array.from({ length: 4 }).map((_, idx) => (
                    <SkillCardSkeleton key={idx} variant="professional" />
                  ))
                : profSkills.map((skill, index) => (
                    <motion.div
                      key={skill.id || skill.name}
                      variants={cardVariant}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
                    >
                      <PixelCard variant="default" className="p-6">
                        <div className="flex items-start gap-5">
                          <div
                            className="w-12 h-12 flex-shrink-0 flex items-center justify-center pixel-shadow"
                            style={{
                              backgroundColor: `${skill.color}22`,
                              color: skill.color,
                              border: `2px solid ${dayTheme.colors.border}`,
                            }}
                          >
                            {renderIcon(skill.icon, 24)}
                          </div>

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
  );
}
