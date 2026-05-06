"use client";

/**
 * @file navbar.tsx — Navbar Layout Component
 *
 * Single fixed top bar that combines the Mario HUD stats (score, coins, world)
 * with the site navigation. The HUD strip sits on the left; the logo + nav
 * links sit on the right. This replaces the previous two-bar layout.
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, Github, Linkedin, Instagram } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { dayTheme } from "../../lib/theme";
import { NAV_LINKS } from "../../lib/constants";
import { useProgressTracker } from "../../lib/progress-tracker";
import { useThemeContext } from "../../lib/theme-context";

// Dynamic imports for game components (ssr: false)
const Coin = dynamic(
  () => import("../game/coin").then((mod) => ({ default: mod.CoinComponent })),
  { ssr: false }
);

const Block = dynamic(
  () => import("../game/block").then((mod) => ({ default: mod.BlockComponent })),
  { ssr: false }
);

// ---------------------------------------------------------------------------
// Route → World Label mapping (moved from PlayerHUD)
// ---------------------------------------------------------------------------

const WORLD_LABEL_MAP: Record<string, string> = {
  "/":           "WORLD-1",
  "/world":      "WORLD-2",
  "/about":      "WORLD-3",
  "/projects":   "WORLD-4",
  "/skills":     "WORLD-5",
  "/experience": "WORLD-6",
  "/contact":    "WORLD-7",
  "/settings":   "WORLD-8",
  "/game":       "WORLD-9",
};

function getWorldLabel(pathname: string): string {
  const normalized =
    pathname !== "/" && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const parentPath = "/" + normalized.split("/")[1];
  return WORLD_LABEL_MAP[normalized] ?? WORLD_LABEL_MAP[parentPath] ?? "WORLD-?";
}

// ---------------------------------------------------------------------------
// HUD strip — score / coins / world label
// ---------------------------------------------------------------------------

function HUDStrip({ coins, worldLabel }: { coins: number; worldLabel: string }) {
  // Score = 100 points per visited page
  const score = coins * 100;

  return (
    <div
      className="flex items-center gap-4"
      role="status"
      aria-label="Game HUD"
    >
      {/* Score */}
      <div className="hidden sm:block">
        <span className="pixel-text block" style={{ color: "#aaa", fontSize: "7px" }}>
          SCORE
        </span>
        <span className="pixel-text" style={{ color: "#fff", fontSize: "9px" }}>
          {String(score).padStart(6, "0")}
        </span>
      </div>

      {/* Coins */}
      <div className="flex items-center gap-1">
        <Coin size={12} />
        <span className="pixel-text" style={{ color: dayTheme.colors.coin, fontSize: "9px" }}>
          ×{coins}
        </span>
      </div>

      {/* World */}
      <div>
        <span className="pixel-text block" style={{ color: "#aaa", fontSize: "7px" }}>
          WORLD
        </span>
        <span className="pixel-text" style={{ color: "#fff", fontSize: "9px" }}>
          {worldLabel}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Navbar
// ---------------------------------------------------------------------------

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { visitedRoutes } = useProgressTracker();
  const { theme, toggleTheme } = useThemeContext();
  const worldLabel = getWorldLabel(pathname);

  // Game is only accessible from the world map, not the top nav
  const navLinks = NAV_LINKS.filter((link) => link.id !== "game");

  // Hide the entire navbar on the landing page — it appears after "PRESS START"
  const isLanding = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  if (isLanding) return null;

  return (
    <nav className="fixed top-0 left-0 w-full z-[10000] pointer-events-none">
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full transition-all duration-300 pointer-events-auto ${
          isOpen
            ? "bg-black border-b-2 border-black"
            : scrolled
            ? "bg-black/95 backdrop-blur-2xl border-b-2 border-black shadow-lg"
            : "bg-black/80 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14 relative z-[10001]">

          {/* LEFT — HUD stats */}
          <HUDStrip coins={visitedRoutes.length} worldLabel={worldLabel} />

          {/* CENTER / RIGHT — Logo + desktop nav */}
          <div className="flex items-center gap-4">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              className="cursor-pointer"
            >
              <Link href="/" aria-label="JEZER. — go to home page" style={{ textDecoration: "none" }}>
                <div className="flex items-center gap-2">
                  <Coin size={14} />
                  <span className="pixel-text" style={{ color: "#fff", fontSize: "11px" }}>
                    JEZER<span style={{ color: dayTheme.colors.coin }}>.</span>
                  </span>
                </div>
              </Link>
            </motion.div>

            {/* Desktop nav links */}
            <div
              className="hidden md:flex items-center gap-1 px-4 py-2"
              style={{
                border: `2px solid rgba(255,255,255,0.2)`,
                backgroundColor: "rgba(255,255,255,0.08)",
              }}
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link
                    href={link.href}
                    aria-label={`Navigate to ${link.name}`}
                    className="relative px-3 py-1 cursor-pointer pixel-text block transition-colors"
                    style={{
                      fontSize: "8px",
                      color: pathname === link.href ? dayTheme.colors.coin : "rgba(255,255,255,0.75)",
                      borderBottom: pathname === link.href
                        ? `2px solid ${dayTheme.colors.coin}`
                        : "2px solid transparent",
                    }}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Theme toggle button */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 cursor-pointer outline-none pixel-text"
              style={{
                border: `2px solid rgba(255,255,255,0.2)`,
                backgroundColor: "rgba(255,255,255,0.08)",
                color: dayTheme.colors.coin,
                fontSize: "12px",
                lineHeight: 1,
              }}
              aria-label={`Switch to ${theme === "day" ? "night" : "day"} theme`}
              title={`Switch to ${theme === "day" ? "night" : "day"} theme`}
            >
              {theme === "day" ? "🌙" : "☀"}
            </motion.button>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 cursor-pointer outline-none"
                style={{ border: `2px solid rgba(255,255,255,0.3)` }}
                aria-label="Toggle menu"
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isOpen
                    ? <X size={20} style={{ color: dayTheme.colors.coin }} />
                    : <Menu size={20} style={{ color: "#fff" }} />
                  }
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile Nav Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="md:hidden fixed inset-0 bg-black flex flex-col overflow-hidden z-[9999] pointer-events-auto"
          style={{ borderTop: `2px solid ${dayTheme.colors.coin}` }}
        >
          {/* Brick block decorative row */}
          <div
            className="flex items-center gap-0 pt-14 px-4 pb-2"
            style={{ borderBottom: `2px solid rgba(255,255,255,0.15)` }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <Block key={i} variant="brick" size={32} />
            ))}
          </div>

          {/* Navigation Links */}
          <div className="relative z-10 flex flex-col space-y-4 px-10 pt-8">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  aria-label={`Navigate to ${link.name}`}
                  className="block uppercase pixel-text hover:opacity-70 transition-opacity"
                  style={{
                    fontSize: "28px",
                    color: pathname === link.href ? dayTheme.colors.coin : "#fff",
                    borderBottom: pathname === link.href
                      ? `2px solid ${dayTheme.colors.coin}`
                      : "none",
                    paddingBottom: "4px",
                  }}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Bottom info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-auto pb-12 px-10 pt-8"
            style={{ borderTop: `2px solid rgba(255,255,255,0.15)` }}
          >
            <div className="flex flex-col gap-6">
              <div>
                <p className="pixel-text mb-2" style={{ fontSize: "9px", color: dayTheme.colors.coin }}>
                  CURRENT STATUS
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2" style={{ background: dayTheme.colors.coin }} />
                  <span className="pixel-text" style={{ fontSize: "9px", color: "rgba(255,255,255,0.7)" }}>
                    AVAILABLE FOR HIRE
                  </span>
                </div>
              </div>

              {/* Theme toggle in mobile menu */}
              <button
                onClick={toggleTheme}
                className="pixel-text flex items-center gap-2 cursor-pointer"
                style={{ fontSize: "9px", color: dayTheme.colors.coin, background: "none", border: "none" }}
                aria-label={`Switch to ${theme === "day" ? "night" : "day"} theme`}
              >
                {theme === "day" ? "🌙 NIGHT MODE" : "☀ DAY MODE"}
              </button>

              <div className="flex items-center gap-4">
                {[
                  { Icon: Github,    href: "https://github.com/Zer-bit",                              label: "GitHub profile" },
                  { Icon: Linkedin,  href: "https://www.linkedin.com/in/jezer-parales-201488386",     label: "LinkedIn profile" },
                  { Icon: Instagram, href: "https://www.instagram.com/zeretsui/",                     label: "Instagram profile" },
                ].map(({ Icon, href, label }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-10 h-10 flex items-center justify-center transition-colors"
                    style={{ border: `2px solid rgba(255,255,255,0.3)`, color: "rgba(255,255,255,0.7)" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = dayTheme.colors.coin;
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = dayTheme.colors.coin;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.7)";
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.3)";
                    }}
                  >
                    <Icon size={18} />
                  </a>
                ))}
                <a
                  href="viber://chat?number=+639763891702"
                  aria-label="Viber contact"
                  className="w-10 h-10 flex items-center justify-center transition-colors"
                  style={{ border: `2px solid rgba(255,255,255,0.3)`, color: "rgba(255,255,255,0.7)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = dayTheme.colors.coin;
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = dayTheme.colors.coin;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.7)";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.3)";
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
