"use client";

// Renders a fixed circular SVG progress indicator in the bottom-right corner that...

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { dayTheme } from "../../lib/theme";

// Dynamically import Coin with no SSR to avoid hydration issues
const Coin = dynamic(
  () => import("../game/coin").then((mod) => ({ default: mod.CoinComponent })),
  { ssr: false }
);

const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      // Guard against division by zero when page doesn't scroll
      const scrolled = winHeightPx > 0 ? (scrollPx / winHeightPx) * 100 : 0;
      setScrollProgress(scrolled);
    };

    window.addEventListener("scroll", updateScrollProgress);
    updateScrollProgress();

    return () => {
      window.removeEventListener("scroll", updateScrollProgress);
    };
  }, []);

  const circumference = 2 * Math.PI * 28; // radius = 28
  const strokeDashoffset =
    circumference - (scrollProgress / 100) * circumference;

  return (
    <div className="fixed bottom-8 right-8 z-[9998] hidden md:block">
      <div className="relative w-16 h-16">
        {/* SVG progress ring */}
        <svg className="w-16 h-16 transform -rotate-90">
          {/* Background circle — theme border color */}
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke={dayTheme.colors.border}
            strokeWidth="3"
            fill="none"
            strokeOpacity="0.3"
          />
          {/* Progress arc — theme coin color, square caps for pixel-art look */}
          <motion.circle
            cx="32"
            cy="32"
            r="28"
            stroke={dayTheme.colors.coin}
            strokeWidth="3"
            fill="none"
            strokeLinecap="square"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
            }}
            transition={{ duration: 0.1 }}
          />
        </svg>

        {/* Center content: coin at 100%, percentage otherwise */}
        <div className="absolute inset-0 flex items-center justify-center">
          {scrollProgress >= 100 ? (
            <Coin size={20} />
          ) : (
            <span
              className="text-xs font-bold"
              style={{ color: dayTheme.colors.coin }}
            >
              {Math.round(scrollProgress)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScrollProgress;
