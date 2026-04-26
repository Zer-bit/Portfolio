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
                        stroke="rgba(156, 189, 9, 0.2)"
                        strokeWidth="3"
                        fill="none"
                    />
                    {/* Progress circle */}
                    <motion.circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="#9cbd09"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        style={{
                            strokeDasharray: circumference,
                            strokeDashoffset: strokeDashoffset,
                        }}
                        transition={{ duration: 0.1 }}
                    />
                </svg>

                {/* Percentage text */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-[#9cbd09]">
                        {Math.round(scrollProgress)}%
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ScrollProgress;
