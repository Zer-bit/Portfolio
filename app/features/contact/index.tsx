"use client";

/**
 * @file features/contact/index.tsx — Contact Section
 *
 * Pixel-art styled contact section for the Mario Pixel Portfolio.
 * Migrated from `app/components/sections/contact.tsx` with the following changes:
 *
 * - Form container replaced with `<PixelCard variant="elevated">`
 * - Form inputs styled with `.pixel-shadow` and theme border tokens
 * - "Send Message" button replaced with `<PixelButton variant="coin" size="lg">`
 * - Success state replaced with a pixel-art dialogue box containing `<Coin>` animation
 * - Loading state replaced with `<Coin>` spinning animation
 * - Social links restyled as pixel-art icon buttons
 * - Section wrapped in `<SectionWrapper id="contact">`
 *
 * All form submission logic (Google Apps Script URL, `no-cors` POST,
 * success/error state management) is preserved unchanged.
 *
 * @satisfies Requirement 12
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Instagram } from "lucide-react";
import { PixelCard } from "../../components/ui/pixel-card";
import { PixelButton } from "../../components/ui/pixel-button";
import { SectionWrapper } from "../../components/layout/section-wrapper";
import { dayTheme } from "../../lib/theme";
import dynamic from "next/dynamic";

// ---------------------------------------------------------------------------
// Dynamic import for Coin (ssr: false — Requirement 17.1)
// ---------------------------------------------------------------------------

const Coin = dynamic(
  () => import("../../components/game/coin").then((mod) => ({ default: mod.CoinComponent })),
  { ssr: false }
);

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * Google Apps Script endpoint for form submission.
 * Preserved unchanged from the original contact.tsx.
 */
const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyaTDnX4uuklVWAp6C9KwNT9pHzFhEoDd_IaTfxy_fqAk07hiICcjTREYr3-5dLXV4/exec";

// ---------------------------------------------------------------------------
// Shared input style
// ---------------------------------------------------------------------------

/**
 * Inline style applied to all form inputs and the textarea.
 * Uses `.pixel-shadow` class + theme border tokens per Requirement 12.2.
 */
const inputStyle: React.CSSProperties = {
  border: "2px solid #000",
  background: "#1a1a2e",
  color: "#fff",
  padding: "12px 16px",
  width: "100%",
  fontFamily: "inherit",
};

// ---------------------------------------------------------------------------
// Social links data
// ---------------------------------------------------------------------------

/**
 * Viber icon — inline SVG matching the original component.
 */
function ViberIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

const socialLinks = [
  {
    Icon: Github,
    href: "https://github.com/Zer-bit",
    label: "Github",
    hoverColor: dayTheme.colors.coin,
  },
  {
    Icon: Linkedin,
    href: "https://www.linkedin.com/in/jezer-parales-201488386",
    label: "LinkedIn",
    hoverColor: dayTheme.colors.coin,
  },
  {
    Icon: Instagram,
    href: "https://www.instagram.com/zeretsui/",
    label: "Instagram",
    hoverColor: dayTheme.colors.coin,
  },
  {
    Icon: ViberIcon,
    href: "viber://chat?number=+639763891702",
    label: "Viber (+63 976 389 1702)",
    hoverColor: dayTheme.colors.coin,
  },
] as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * ContactSection — Pixel-art styled contact form and social links.
 *
 * Renders a two-column layout:
 * - Left: contact info, email link, and social icon buttons
 * - Right: contact form inside a `<PixelCard variant="elevated">`
 *
 * @example
 * ```tsx
 * import ContactSection from "@/features/contact";
 * <ContactSection />
 * ```
 */
export function ContactSection() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // -------------------------------------------------------------------------
  // Form handlers — preserved unchanged from original contact.tsx
  // -------------------------------------------------------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      console.error("Form error:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <SectionWrapper id="contact">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* ----------------------------------------------------------------
              Left column — contact info + social links
          ---------------------------------------------------------------- */}
          <div>
            {/* Section heading */}
            <h2
              className="pixel-text mb-4 uppercase"
              style={{ color: dayTheme.colors.coin, fontSize: "10px", letterSpacing: "0.15em" }}
            >
              Get in touch
            </h2>
            <h3
              className="text-4xl md:text-5xl font-bold mb-8"
              style={{ color: dayTheme.colors.text }}
            >
              Let&apos;s build something{" "}
              <span style={{ color: dayTheme.colors.coin }}>extraordinary</span>.
            </h3>

            <p className="text-lg mb-12" style={{ color: "rgba(255,255,255,0.7)" }}>
              Have a project in mind? Or just want to say hi? I&apos;m always open to
              new opportunities and creative collaborations.
            </p>

            {/* Email row */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 group">
                <div
                  className="w-12 h-12 flex items-center justify-center pixel-shadow"
                  style={{
                    border: `2px solid ${dayTheme.colors.coin}`,
                    background: `${dayTheme.colors.coin}22`,
                    color: dayTheme.colors.coin,
                  }}
                >
                  <Mail size={20} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                    Email me at
                  </p>
                  <a
                    href="mailto:jezermantilla263026@gmail.com"
                    className="font-medium transition-colors"
                    style={{ color: dayTheme.colors.text }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = dayTheme.colors.coin;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = dayTheme.colors.text;
                    }}
                  >
                    jezermantilla263026@gmail.com
                  </a>
                </div>
              </div>

              {/* Social links */}
              <div
                className="pt-8"
                style={{ borderTop: `1px solid rgba(255,255,255,0.1)` }}
              >
                <p
                  className="pixel-text mb-6 uppercase"
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "9px",
                    letterSpacing: "0.15em",
                  }}
                >
                  Find me on
                </p>
                <div className="flex items-center gap-4 flex-wrap">
                  {socialLinks.map((social, i) => (
                    <motion.a
                      key={i}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -4 }}
                      className="pixel-shadow flex items-center justify-center transition-colors"
                      style={{
                        width: 44,
                        height: 44,
                        border: "2px solid #000",
                        background: "#1a1a2e",
                        color: "rgba(255,255,255,0.7)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = social.hoverColor;
                        e.currentTarget.style.borderColor = social.hoverColor;
                        e.currentTarget.style.background = `${social.hoverColor}22`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                        e.currentTarget.style.borderColor = "#000";
                        e.currentTarget.style.background = "#1a1a2e";
                      }}
                      title={social.label}
                      aria-label={social.label}
                    >
                      <social.Icon />
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------------------
              Right column — contact form inside PixelCard
          ---------------------------------------------------------------- */}
          <PixelCard variant="elevated" style={{ padding: "2rem" }}>
            {status === "success" ? (
              /* ---- Success state: pixel-art dialogue box ---- */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 text-center"
                style={{
                  background: "#000",
                  border: `4px solid ${dayTheme.colors.coin}`,
                  padding: "2rem",
                }}
              >
                {/* Coin animation */}
                <div className="mb-6">
                  <Coin size={32} />
                </div>
                <h4
                  className="pixel-text mb-3"
                  style={{ color: dayTheme.colors.coin, fontSize: "14px" }}
                >
                  MESSAGE SENT!
                </h4>
                <p
                  className="pixel-text"
                  style={{ color: "rgba(255,255,255,0.7)", fontSize: "9px", lineHeight: 1.8 }}
                >
                  Thanks for reaching out.{"\n"}I&apos;ll get back to you soon.
                </p>
              </motion.div>
            ) : (
              /* ---- Form state ---- */
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Name + Email row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      className="pixel-text"
                      style={{ color: "rgba(255,255,255,0.6)", fontSize: "9px" }}
                    >
                      Name
                    </label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="pixel-shadow"
                      style={inputStyle}
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      className="pixel-text"
                      style={{ color: "rgba(255,255,255,0.6)", fontSize: "9px" }}
                    >
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@gmail.com"
                      className="pixel-shadow"
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label
                    className="pixel-text"
                    style={{ color: "rgba(255,255,255,0.6)", fontSize: "9px" }}
                  >
                    Message
                  </label>
                  <textarea
                    required
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Feel free to express yourself..."
                    className="pixel-shadow"
                    style={{ ...inputStyle, resize: "none" }}
                  />
                </div>

                {/* Submit button */}
                <PixelButton
                  variant="coin"
                  size="lg"
                  type="submit"
                  disabled={status === "loading"}
                  style={{ width: "100%", justifyContent: "center", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  {status === "loading" ? (
                    <>
                      Sending...{" "}
                      {/* Loading state: spinning Coin replaces Loader2 — Requirement 12.7 */}
                      <Coin size={24} />
                    </>
                  ) : (
                    "Send Message"
                  )}
                </PixelButton>

                {/* Error message */}
                {status === "error" && (
                  <p
                    className="pixel-text text-center"
                    style={{ color: dayTheme.colors.mario, fontSize: "9px" }}
                  >
                    Something went wrong. Please try again.
                  </p>
                )}
              </motion.form>
            )}
          </PixelCard>

        </div>
      </div>
    </SectionWrapper>
  );
}

export default ContactSection;
