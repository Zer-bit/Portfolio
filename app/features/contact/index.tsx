"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Instagram, Phone } from "lucide-react";
import { PixelCard } from "../../components/ui/pixel-card";
import { PixelButton } from "../../components/ui/pixel-button";
import { dayTheme } from "../../lib/theme";
import { fetchContactInfo, type ContactInfoItem } from "../../lib/db-data";
import dynamic from "next/dynamic";

const Coin = dynamic(
  () => import("../../components/game/coin").then((mod) => ({ default: mod.CoinComponent })),
  { ssr: false }
);

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyaTDnX4uuklVWAp6C9KwNT9pHzFhEoDd_IaTfxy_fqAk07hiICcjTREYr3-5dLXV4/exec";

const inputStyle: React.CSSProperties = {
  border: "2px solid #000",
  background: "#1a1a2e",
  color: "#fff",
  padding: "12px 16px",
  width: "100%",
  fontFamily: "inherit",
};

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

export function ContactSection() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [contact, setContact] = useState<ContactInfoItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    let isMounted = true;
    fetchContactInfo().then((data) => {
      if (isMounted) setContact(data);
    });
    return () => {
      isMounted = false;
    };
  }, []);

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

  const email = contact?.email || "jezermantilla263026@gmail.com";
  const phone = contact?.phone || "+63 976 389 1702";

  const socialLinksList = [
    {
      Icon: Github,
      href: contact?.github || "https://github.com/Zer-bit",
      label: "Github",
      hoverColor: dayTheme.colors.coin,
    },
    {
      Icon: Linkedin,
      href: contact?.linkedin || "https://www.linkedin.com/in/jezer-parales-201488386",
      label: "LinkedIn",
      hoverColor: dayTheme.colors.coin,
    },
    {
      Icon: Instagram,
      href: contact?.instagram || "https://www.instagram.com/zeretsui/",
      label: "Instagram",
      hoverColor: dayTheme.colors.coin,
    },
    {
      Icon: ViberIcon,
      href: contact?.viber || "viber://chat?number=+639763891702",
      label: `Viber (${phone})`,
      hoverColor: dayTheme.colors.coin,
    },
  ];

  return (
    <section id="contact" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left column */}
          <div>
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

            <div className="space-y-6">
              {/* Email */}
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
                    href={`mailto:${email}`}
                    className="font-medium transition-colors"
                    style={{ color: dayTheme.colors.text }}
                  >
                    {email}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-4 group">
                <div
                  className="w-12 h-12 flex items-center justify-center pixel-shadow"
                  style={{
                    border: `2px solid ${dayTheme.colors.coin}`,
                    background: `${dayTheme.colors.coin}22`,
                    color: dayTheme.colors.coin,
                  }}
                >
                  <Phone size={20} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                    Call / Text
                  </p>
                  <a
                    href={`tel:${phone.replace(/\s+/g, "")}`}
                    className="font-medium transition-colors"
                    style={{ color: dayTheme.colors.text }}
                  >
                    {phone}
                  </a>
                </div>
              </div>

              {/* Social links */}
              <div className="pt-8" style={{ borderTop: `1px solid rgba(255,255,255,0.1)` }}>
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
                  {socialLinksList.map((social, i) => (
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

          {/* Right column — contact form */}
          <PixelCard variant="elevated" style={{ padding: "2rem" }}>
            {status === "success" ? (
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
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
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

                <PixelButton
                  variant="coin"
                  size="lg"
                  type="submit"
                  disabled={status === "loading"}
                  style={{ width: "100%", justifyContent: "center", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  {status === "loading" ? (
                    <>
                      Sending... <Coin size={24} />
                    </>
                  ) : (
                    "Send Message"
                  )}
                </PixelButton>

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
    </section>
  );
}

export default ContactSection;
