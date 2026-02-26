"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Github, Linkedin, Instagram, Sparkles } from "lucide-react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeLink, setActiveLink] = useState("home");

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    const navLinks = [
        { name: "Home", href: "#home", id: "home" },
        { name: "Skills", href: "#skills", id: "skills" },
        { name: "Projects", href: "#projects", id: "projects" },
        { name: "Contact", href: "#contact", id: "contact" },
    ];

    return (
        <nav
            className="fixed top-0 left-0 w-full z-[10000] pointer-events-none"
        >
            <motion.div
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`w-full transition-all duration-500 pointer-events-auto ${isOpen
                    ? "bg-[#050505] py-6 border-b holographic-border"
                    : scrolled
                        ? "bg-black/80 backdrop-blur-2xl py-4 border-b border-white/10 shadow-[0_8px_32px_rgba(139,92,246,0.15)]"
                        : "bg-transparent py-6"
                    }`}
            >
                {/* Animated gradient line at top */}
                {scrolled && (
                    <motion.div
                        className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent"
                        initial={{ width: "0%", opacity: 0 }}
                        animate={{ width: "100%", opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                )}

                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative z-[10001]">
                    {/* Logo with holographic effect */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.05 }}
                        className="relative group cursor-pointer"
                    >
                        <div className="absolute -inset-2 bg-gradient-to-r from-violet-600 via-cyan-500 to-violet-600 rounded-lg blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500 animate-pulse" />
                        <div className="relative flex items-center gap-2">
                            <Sparkles className="text-violet-400 w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                            <span className="text-2xl font-black tracking-tighter">
                                <span className="text-gradient">JEZER</span>
                                <span className="text-violet-500">.</span>
                            </span>
                        </div>
                    </motion.div>

                    {/* Desktop Nav with premium styling */}
                    <div className="hidden md:flex items-center gap-2 bg-white/5 backdrop-blur-xl rounded-full px-6 py-3 border border-white/10">
                        {navLinks.map((link, i) => (
                            <motion.a
                                key={link.name}
                                href={link.href}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => setActiveLink(link.id)}
                                className="relative px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors cursor-pointer group"
                            >
                                {link.name}

                                {/* Animated underline */}
                                <motion.div
                                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"
                                    initial={{ scaleX: 0 }}
                                    whileHover={{ scaleX: 1 }}
                                    transition={{ duration: 0.3 }}
                                />

                                {/* Active indicator */}
                                {activeLink === link.id && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute inset-0 bg-violet-500/10 rounded-full -z-10"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}

                                {/* Hover glow */}
                                <div className="absolute inset-0 bg-violet-500/0 group-hover:bg-violet-500/5 rounded-full transition-colors duration-300" />
                            </motion.a>
                        ))}
                    </div>



                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <motion.button
                            onClick={() => setIsOpen(!isOpen)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="relative p-3 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 cursor-pointer outline-none z-[10002]"
                            aria-label="Toggle menu"
                        >
                            <AnimatePresence mode="wait">
                                {isOpen ? (
                                    <motion.div
                                        key="close"
                                        initial={{ opacity: 0, rotate: -90 }}
                                        animate={{ opacity: 1, rotate: 0 }}
                                        exit={{ opacity: 0, rotate: 90 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <X size={24} className="text-violet-400" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="menu"
                                        initial={{ opacity: 0, rotate: 90 }}
                                        animate={{ opacity: 1, rotate: 0 }}
                                        exit={{ opacity: 0, rotate: -90 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Menu size={24} className="text-white" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Mobile Nav Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="md:hidden fixed inset-0 bg-[#050505] flex flex-col pt-32 px-10 overflow-hidden z-[9999] pointer-events-auto"
                    >
                        {/* Creative Background Elements */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.1, 0.2, 0.1],
                                    rotate: [0, 45, 0],
                                }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px]"
                            />
                            <motion.div
                                animate={{
                                    scale: [1.2, 1, 1.2],
                                    opacity: [0.05, 0.15, 0.05],
                                    rotate: [0, -45, 0],
                                }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]"
                            />
                        </div>

                        {/* Navigation Links with Numbers */}
                        <div className="relative z-10 flex flex-col space-y-4">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, x: 50, skewX: -10 }}
                                    animate={{ opacity: 1, x: 0, skewX: 0 }}
                                    transition={{
                                        delay: 0.1 + i * 0.1,
                                        duration: 0.6,
                                        ease: [0.16, 1, 0.3, 1]
                                    }}
                                    className="group relative"
                                >
                                    <span className="absolute -left-8 top-1/2 -translate-y-1/2 text-8xl font-black text-white/[0.02] transition-colors group-hover:text-violet-500/5 select-none font-mono">
                                        0{i + 1}
                                    </span>
                                    <a
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="relative block text-5xl md:text-6xl font-black text-white hover:text-violet-500 transition-all duration-300 uppercase italic tracking-tighter"
                                    >
                                        <span className="relative z-10">{link.name}</span>
                                        <motion.div
                                            className="absolute bottom-0 left-0 h-1 bg-violet-500 rounded-full"
                                            initial={{ width: 0 }}
                                            whileHover={{ width: "100%" }}
                                        />
                                    </a>
                                </motion.div>
                            ))}
                        </div>

                        {/* Bottom Info Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-auto pb-12 relative z-10 border-t border-white/5 pt-8"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <div>
                                    <p className="text-[10px] text-violet-400 font-bold uppercase tracking-[0.3em] mb-2">Current Status</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                                        <span className="text-sm font-medium text-white/60 tracking-wider uppercase">Available for hire</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-5">
                                    {[
                                        { Icon: Github, href: "https://github.com/Zer-bit" },
                                        { Icon: Linkedin, href: "https://www.linkedin.com/in/jezer-parales-201488386" },
                                        { Icon: Instagram, href: "https://www.instagram.com/zeretsui/" },
                                    ].map((social, i) => (
                                        <a
                                            key={i}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-violet-400 hover:bg-violet-500/10 transition-all"
                                        >
                                            <social.Icon size={18} />
                                        </a>
                                    ))}
                                    <a
                                        href="viber://chat?number=+639763891702"
                                        className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-violet-400 hover:bg-violet-500/10 transition-all"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
