"use client";

import React from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { dayTheme } from "../../lib/theme";

// Dynamically import Block with ssr:false (Requirement 17.1)
const Block = dynamic(
  () => import("../game/block").then((mod) => ({ default: mod.BlockComponent })),
  { ssr: false }
);

/**
 * Footer — Mario-themed site footer.
 *
 * Displays the "JEZER." logo in pixel-art font with the "." styled in the
 * theme coin color, a row of brick blocks along the top edge, and the
 * copyright text on a ground-colored background.
 *
 * @example
 * ```tsx
 * import Footer from "@/components/layout/footer";
 * <Footer />
 * ```
 */
const Footer = () => {
  return (
    <footer
      style={{ backgroundColor: dayTheme.colors.ground }}
      className="relative overflow-hidden"
    >
      {/* Brick block row along the top edge */}
      <div
        style={{
          display: "flex",
          overflow: "hidden",
          lineHeight: 0,
        }}
        aria-hidden="true"
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <Block key={i} variant="brick" size={32} />
        ))}
      </div>

      {/* Footer content */}
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Logo */}
          <div className="pixel-text text-xl mb-4" style={{ color: dayTheme.colors.text }}>
            JEZER<span style={{ color: dayTheme.colors.coin }}>.</span>
          </div>

          {/* Copyright */}
          <p className="text-sm" style={{ color: dayTheme.colors.text }}>
            © {new Date().getFullYear()} Jezer Mantilla Parales. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
