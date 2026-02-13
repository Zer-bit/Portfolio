"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useMousePosition } from "./hooks/use-mouse-position";

const MagneticCursor = () => {
    const { x, y } = useMousePosition();
    const [isPointer, setIsPointer] = useState(false);
    const [isHidden, setIsHidden] = useState(false);

    useEffect(() => {
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isClickable =
                target.tagName === "A" ||
                target.tagName === "BUTTON" ||
                target.closest("a") ||
                target.closest("button") ||
                window.getComputedStyle(target).cursor === "pointer";

            setIsPointer(!!isClickable);
        };

        const handleMouseOut = () => {
            setIsPointer(false);
        };

        document.addEventListener("mouseover", handleMouseOver);
        document.addEventListener("mouseout", handleMouseOut);

        return () => {
            document.removeEventListener("mouseover", handleMouseOver);
            document.removeEventListener("mouseout", handleMouseOut);
        };
    }, []);

    // Hide default cursor
    useEffect(() => {
        document.body.style.cursor = "none";
        const allElements = document.querySelectorAll("*");
        allElements.forEach((el) => {
            (el as HTMLElement).style.cursor = "none";
        });

        return () => {
            document.body.style.cursor = "auto";
        };
    }, []);

    if (isHidden) return null;

    return (
        <>
            {/* Main cursor dot */}
            <motion.div
                className="fixed top-0 left-0 w-3 h-3 rounded-full bg-violet-500 pointer-events-none z-[99999] mix-blend-difference"
                animate={{
                    x: x - 6,
                    y: y - 6,
                    scale: isPointer ? 0.5 : 1,
                }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 28,
                    mass: 0.5,
                }}
            />

            {/* Cursor ring */}
            <motion.div
                className="fixed top-0 left-0 w-10 h-10 rounded-full border-2 border-violet-400/50 pointer-events-none z-[99998] mix-blend-difference"
                animate={{
                    x: x - 20,
                    y: y - 20,
                    scale: isPointer ? 1.5 : 1,
                    opacity: isPointer ? 0.8 : 0.5,
                }}
                transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 15,
                    mass: 0.1,
                }}
            />

            {/* Trailing glow */}
            <motion.div
                className="fixed top-0 left-0 w-20 h-20 rounded-full bg-violet-500/20 blur-xl pointer-events-none z-[99997]"
                animate={{
                    x: x - 40,
                    y: y - 40,
                }}
                transition={{
                    type: "spring",
                    stiffness: 50,
                    damping: 20,
                }}
            />
        </>
    );
};

export default MagneticCursor;
