"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import TextScramble from "./text-scramble";
import LiquidBlob from "./liquid-blob";

const PersonalInfo = () => {
    const [showScramble, setShowScramble] = useState(true);

    return (
        <div id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-mesh">
            {/* Liquid Blob Backgrounds */}
            <LiquidBlob
                className="top-1/4 left-1/4 opacity-20"
                color="rgba(139, 92, 246, 0.3)"
                size={500}
            />
            <LiquidBlob
                className="bottom-1/4 right-1/4 opacity-10"
                color="rgba(6, 182, 212, 0.2)"
                size={600}
            />

            {/* Animated Background Glows */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.3, 0.2],
                    x: [0, 50, 0],
                    y: [0, -30, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[128px] pointer-events-none"
            />
            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.1, 0.2, 0.1],
                    x: [0, -50, 0],
                    y: [0, 30, 0]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[128px] pointer-events-none"
            />

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-3 mb-6"
                    >
                        <span className="h-px w-8 bg-violet-500"></span>
                        <span className="text-violet-400 font-bold tracking-[0.2em] uppercase text-xs">
                            Available for projects
                        </span>
                    </motion.div>

                    <div className="mb-8">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="text-6xl md:text-8xl font-black leading-none mb-2 tracking-tight"
                        >
                            {showScramble ? (
                                <>
                                    Jezer <TextScramble text="Parales" className="text-gradient" delay={500} />
                                </>
                            ) : (
                                <>
                                    Jezer <span className="text-gradient hover:animate-pulse transition-all">Parales</span>
                                </>
                            )}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-2xl md:text-4xl font-light text-white/40 tracking-wide"
                        >
                            Architecting <span className="text-white font-medium italic">Digital</span> Universes
                        </motion.p>
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-gray-400 text-lg mb-10 max-w-lg leading-relaxed"
                    >
                        Crafting high-performance web applications with a focus on
                        <span className="text-violet-300"> aesthetic excellence</span> and
                        <span className="text-cyan-300"> technical precision</span>.
                        Let's level up your digital presence.
                    </motion.p>

                    <div className="flex flex-wrap items-center gap-8">
                        <motion.a
                            href="#projects"
                            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(139, 92, 246, 0.4)" }}
                            whileTap={{ scale: 0.95 }}
                            className="px-10 py-5 bg-violet-600 text-white font-bold rounded-2xl flex items-center gap-3 transition-all cursor-pointer shadow-xl shadow-violet-950/40 relative group overflow-hidden holographic-border"
                        >
                            <span className="relative z-10">Explore Work</span>
                            <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-cyan-500 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[length:200%_auto] shimmer" />
                        </motion.a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PersonalInfo;
