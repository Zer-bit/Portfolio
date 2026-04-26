"use client";

import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
    return (
        <footer className="py-12 border-t border-black/10 bg-[#f0f0f0] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="text-xl font-bold tracking-tighter mb-4">
                        <span className="text-black">JEZER</span>
                        <span className="text-[#9cbd09]">.</span>
                    </div>
                    <p className="text-gray-600 text-sm">
                        © {new Date().getFullYear()} Jezer Mantilla Parales. All rights reserved.
                    </p>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;
