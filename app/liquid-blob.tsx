"use client";

import React from "react";
import { motion } from "framer-motion";

interface LiquidBlobProps {
    className?: string;
    color?: string;
    size?: number;
}

const LiquidBlob: React.FC<LiquidBlobProps> = ({
    className = "",
    color = "#8b5cf6",
    size = 400
}) => {
    return (
        <motion.div
            className={`absolute rounded-full blur-[100px] ${className}`}
            style={{
                width: size,
                height: size,
                background: color,
            }}
            animate={{
                scale: [1, 1.2, 1.1, 1],
                rotate: [0, 90, 180, 270, 360],
                borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%",
                    "70% 30% 30% 70% / 70% 70% 30% 30%",
                    "50% 50% 50% 50% / 50% 50% 50% 50%",
                    "30% 70% 70% 30% / 30% 30% 70% 70%"],
            }}
            transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        />
    );
};

export default LiquidBlob;
