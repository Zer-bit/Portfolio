"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ScrollProgress = () => {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const updateScrollProgress = () => {
            const scrollPx = document.documentElement.scrollTop;
            const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (scrollPx / winHeightPx) * 100;
            setScrollProgress(scrolled);
        };

        window.addEventListener("scroll", updateScrollProgress);
        updateScrollProgress();

        return () => {
            window.removeEventListener("scroll", updateScrollProgress);
        };
    }, []);

    const circumference = 2 * Math.PI * 28; // radius = 28
    const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

    return (
        <div className="fixed bottom-8 right-8 z-[9998] hidden md:block">
            <div className="relative w-16 h-16">
                {/* Background circle */}
                <svg className="w-16 h-16 transform -rotate-90">
                    <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="rgba(139, 92, 246, 0.1)"
                        strokeWidth="3"
                        fill="none"
                    />
                    {/* Progress circle */}
                    <motion.circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="url(#gradient)"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        style={{
                            strokeDasharray: circumference,
                            strokeDashoffset: strokeDashoffset,
                        }}
                        transition={{ duration: 0.1 }}
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="50%" stopColor="#06b6d4" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Percentage text */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-violet-400">
                        {Math.round(scrollProgress)}%
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ScrollProgress;
