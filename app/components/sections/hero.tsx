"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

const PersonalInfo = () => {
    return (
        <div id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-mesh">
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
                        <span className="h-px w-8 bg-[#9cbd09]"></span>
                        <span className="text-[#9cbd09] font-bold tracking-[0.2em] uppercase text-xs">
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
                            Jezer <span className="text-gradient">Parales</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-2xl md:text-4xl font-light text-black/60 tracking-wide"
                        >
                            Architecting <span className="text-black font-medium italic">Digital</span> Universe
                        </motion.p>
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-gray-600 text-lg mb-10 max-w-lg leading-relaxed"
                    >
                        Developing cutting-edge <span className="text-[#9cbd09] font-semibold">websites</span> and <span className="text-[#0ea5e9] font-semibold">seamless applications</span>. Let's bridge the gap between imagination and a high-performance digital reality.
                        <br />
                        <span className="text-black font-bold inline-block mt-4 text-xl tracking-wider uppercase">Let's level <span className="text-gradient-orange">UP!</span></span>
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1 }}
                        className="flex items-center gap-4"
                    >
                        {/* Primary CTA */}
                        <a
                            href="#contact"
                            className="inline-flex items-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-[#f97316]/20 hover:shadow-[#f97316]/30 hover:scale-105"
                        >
                            Hire Me
                        </a>
                        {/* Secondary CTA */}
                        <a
                            href="#projects"
                            className="inline-flex items-center gap-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-[#0ea5e9]/20 hover:shadow-[#0ea5e9]/30 hover:scale-105"
                        >
                            View Work
                        </a>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.2 }}
                        className="flex flex-col items-start justify-center mt-10"
                    >
                        <div className="w-12 h-12 rounded-full border border-[#9cbd09]/30 text-[#9cbd09] flex items-center justify-center pointer-events-none">
                            <ArrowDown size={24} />
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default PersonalInfo;
