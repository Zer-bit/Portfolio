"use client";

import React from "react";
import { motion } from "framer-motion";
import { dayTheme } from "../../lib/theme";
import { BRICK_SVG_BASE64 } from "../../lib/constants";

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
          width: "100%",
          height: "32px",
          backgroundImage: `url("data:image/svg+xml;base64,${BRICK_SVG_BASE64}")`,
          backgroundRepeat: "repeat-x",
          backgroundSize: "32px 32px",
          imageRendering: "pixelated",
        }}
        aria-hidden="true"
      />

      {/* Footer content */}
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >


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
