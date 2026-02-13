"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

const Spotlight = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <motion.div
            className="fixed inset-0 z-10 pointer-events-none"
            style={{
                background: `radial-gradient(600px circle at var(--x) var(--y), rgba(139, 92, 246, 0.08), transparent 80%)`,
            } as any}
        >
            <motion.div
                className="absolute inset-0"
                style={{
                    "--x": `${smoothX}px`,
                    "--y": `${smoothY}px`,
                } as any}
            />
        </motion.div>
    );
};

export default Spotlight;
