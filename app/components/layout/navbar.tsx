"use client";

/**
 * @file navbar.tsx — Navbar Layout Component
 *
 * Fixed top navigation bar styled as a Mario game HUD/level-select screen.
 *
 * Key design decisions:
 * - Logo uses `<Coin size={16}>` + "JEZER." in `.pixel-text` class
 * - Active link indicator: 2px solid bottom border using `dayTheme.colors.coin` (#f8b800)
 *   instead of the previous Framer Motion `layoutId="activeNav"` highlight
 * - Scroll background: transparent → opaque transition preserved
 * - Mobile menu: pixel borders, `.pixel-text` on link text, brick block decorative row,
 *   minimum 32px font size for nav links
 *
 * @example
 * ```tsx
 * import Navbar from "@/components/layout/navbar";
 * <Navbar />
 * ```
 */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, Github, Linkedin, Instagram } from "lucide-react";
import dynamic from "next/dynamic";
import { dayTheme } from "../../lib/theme";

// Dynamic imports for game components (ssr: false per Requirement 17.1)
const Coin = dynamic(
  () => import("../game/coin").then((mod) => ({ default: mod.CoinComponent })),
  { ssr: false }
);

const Block = dynamic(
  () => import("../game/block").then((mod) => ({ default: mod.BlockComponent })),
  { ssr: false }
);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("home");

  // Scroll detection — preserves transparent → opaque transition (Requirement 13.4)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // All nav links preserved (Requirement 13.1)
  const navLinks = [
    { name: "Home", href: "#home", id: "home" },
    { name: "Skills", href: "#skills", id: "skills" },
    { name: "Projects", href: "#projects", id: "projects" },
    { name: "Contact", href: "#contact", id: "contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-[10000] pointer-events-none">
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full transition-all duration-500 pointer-events-auto ${
          isOpen
            ? "bg-white py-6 border-b-2 border-black"
            : scrolled
            ? "bg-white/90 backdrop-blur-2xl py-4 border-b-2 border-black shadow-lg"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative z-[10001]">
          {/* Logo — Coin icon + "JEZER." in pixel-text (Requirement 13.2) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            className="relative group cursor-pointer"
          >
            <div className="relative flex items-center gap-2">
              <Coin size={16} />
              <span
                className="pixel-text text-lg"
                style={{ color: dayTheme.colors.border }}
              >
                JEZER
                <span style={{ color: dayTheme.colors.coin }}>.</span>
              </span>
            </div>
          </motion.div>

          {/* Desktop Nav */}
          <div
            className="hidden md:flex items-center gap-2 bg-white/80 backdrop-blur-xl px-6 py-3"
            style={{ border: `2px solid ${dayTheme.colors.border}` }}
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setActiveLink(link.id)}
                className="relative px-4 py-2 text-sm font-semibold text-gray-600 hover:text-black transition-colors cursor-pointer pixel-text"
                style={
                  activeLink === link.id
                    ? {
                        // Pixel-art block cursor: 2px solid bottom border (Requirement 13.3)
                        borderBottom: `2px solid ${dayTheme.colors.coin}`,
                        color: "#000",
                      }
                    : {}
                }
              >
                {link.name}
              </motion.a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-3 bg-white/80 backdrop-blur-xl cursor-pointer outline-none z-[10002]"
              style={{ border: `2px solid ${dayTheme.colors.border}` }}
              aria-label="Toggle menu"
            >
              <motion.div
                initial={false}
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isOpen ? (
                  <X size={24} style={{ color: dayTheme.colors.coin }} />
                ) : (
                  <Menu size={24} className="text-black" />
                )}
              </motion.div>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Nav Overlay — pixel borders, pixel-text, Mario decorative elements (Requirement 13.5, 13.6) */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="md:hidden fixed inset-0 bg-white flex flex-col overflow-hidden z-[9999] pointer-events-auto"
          style={{ border: `2px solid ${dayTheme.colors.border}` }}
        >
          {/* Mario decorative brick block row at the top of the overlay */}
          <div
            className="flex items-center gap-0 pt-20 px-4 pb-2"
            style={{ borderBottom: `2px solid ${dayTheme.colors.border}` }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <Block key={i} variant="brick" size={32} />
            ))}
          </div>

          {/* Navigation Links — pixel-text, minimum 32px font (Requirement 13.6) */}
          <div className="relative z-10 flex flex-col space-y-4 px-10 pt-8">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.1 + i * 0.1,
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative"
              >
                <a
                  href={link.href}
                  onClick={() => {
                    setActiveLink(link.id);
                    setIsOpen(false);
                  }}
                  className="relative block uppercase pixel-text hover:opacity-70 transition-opacity duration-200"
                  style={{
                    // Minimum 32px rendered font size (Requirement 13.6)
                    fontSize: "32px",
                    color:
                      activeLink === link.id
                        ? dayTheme.colors.coin
                        : dayTheme.colors.border,
                    borderBottom:
                      activeLink === link.id
                        ? `2px solid ${dayTheme.colors.coin}`
                        : "none",
                    paddingBottom: "4px",
                  }}
                >
                  {link.name}
                </a>
              </motion.div>
            ))}
          </div>

          {/* Bottom Info Section — social links preserved (Requirement 13.1) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-auto pb-12 relative z-10 px-10 pt-8"
            style={{ borderTop: `2px solid ${dayTheme.colors.border}` }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <p
                  className="pixel-text mb-2"
                  style={{
                    fontSize: "10px",
                    color: dayTheme.colors.coin,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                  }}
                >
                  Current Status
                </p>
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2"
                    style={{ background: dayTheme.colors.coin }}
                  />
                  <span
                    className="pixel-text"
                    style={{
                      fontSize: "10px",
                      color: "#555",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    Available for hire
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-5">
                {[
                  { Icon: Github, href: "https://github.com/Zer-bit" },
                  {
                    Icon: Linkedin,
                    href: "https://www.linkedin.com/in/jezer-parales-201488386",
                  },
                  {
                    Icon: Instagram,
                    href: "https://www.instagram.com/zeretsui/",
                  },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center transition-all"
                    style={{
                      border: `2px solid ${dayTheme.colors.border}`,
                      color: "#555",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        dayTheme.colors.coin;
                      (
                        e.currentTarget as HTMLAnchorElement
                      ).style.borderColor = dayTheme.colors.coin;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        "#555";
                      (
                        e.currentTarget as HTMLAnchorElement
                      ).style.borderColor = dayTheme.colors.border;
                    }}
                  >
                    <social.Icon size={18} />
                  </a>
                ))}
                {/* Viber social link preserved */}
                <a
                  href="viber://chat?number=+639763891702"
                  className="w-10 h-10 flex items-center justify-center transition-all"
                  style={{
                    border: `2px solid ${dayTheme.colors.border}`,
                    color: "#555",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      dayTheme.colors.coin;
                    (
                      e.currentTarget as HTMLAnchorElement
                    ).style.borderColor = dayTheme.colors.coin;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "#555";
                    (
                      e.currentTarget as HTMLAnchorElement
                    ).style.borderColor = dayTheme.colors.border;
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
