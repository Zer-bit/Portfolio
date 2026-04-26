"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
        <nav className="fixed top-0 left-0 w-full z-[10000] pointer-events-none">
            <motion.div
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`w-full transition-all duration-500 pointer-events-auto ${
                    isOpen
                        ? "bg-white py-6 border-b border-black/10"
                        : scrolled
                        ? "bg-white/90 backdrop-blur-2xl py-4 border-b border-black/10 shadow-lg"
                        : "bg-transparent py-6"
                }`}
            >
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative z-[10001]">
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.05 }}
                        className="relative group cursor-pointer"
                    >
                        <div className="relative flex items-center gap-2">
                            <Sparkles className="text-[#9cbd09] w-5 h-5 transition-transform duration-500" />
                            <span className="text-2xl font-black tracking-tighter">
                                <span className="text-gradient">JEZER</span>
                                <span className="text-[#9cbd09]">.</span>
                            </span>
                        </div>
                    </motion.div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-2 bg-white/80 backdrop-blur-xl rounded-full px-6 py-3 border border-black/10">
                        {navLinks.map((link, i) => (
                            <motion.a
                                key={link.name}
                                href={link.href}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => setActiveLink(link.id)}
                                className="relative px-4 py-2 text-sm font-semibold text-gray-600 hover:text-black transition-colors cursor-pointer group"
                            >
                                {link.name}

                                {/* Animated underline */}
                                <motion.div
                                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#9cbd09] rounded-full"
                                    initial={{ scaleX: 0 }}
                                    whileHover={{ scaleX: 1 }}
                                    transition={{ duration: 0.3 }}
                                />

                                {/* Active indicator */}
                                {activeLink === link.id && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute inset-0 bg-[#9cbd09]/10 rounded-full -z-10"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}

                                {/* Hover glow */}
                                <div className="absolute inset-0 bg-[#9cbd09]/0 group-hover:bg-[#9cbd09]/5 rounded-full transition-colors duration-300" />
                            </motion.a>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <motion.button
                            onClick={() => setIsOpen(!isOpen)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="relative p-3 rounded-xl bg-white/80 backdrop-blur-xl border border-black/10 cursor-pointer outline-none z-[10002]"
                            aria-label="Toggle menu"
                        >
                            <motion.div
                                initial={false}
                                animate={{ rotate: isOpen ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {isOpen ? (
                                    <X size={24} className="text-[#9cbd09]" />
                                ) : (
                                    <Menu size={24} className="text-black" />
                                )}
                            </motion.div>
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Mobile Nav Overlay */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="md:hidden fixed inset-0 bg-white flex flex-col pt-32 px-10 overflow-hidden z-[9999] pointer-events-auto"
                >
                    {/* Navigation Links */}
                    <div className="relative z-10 flex flex-col space-y-4">
                        {navLinks.map((link, i) => (
                            <motion.div
                                key={link.name}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                    delay: 0.1 + i * 0.1,
                                    duration: 0.6,
                                    ease: [0.16, 1, 0.3, 1]
                                }}
                                className="group relative"
                            >
                                <span className="absolute -left-8 top-1/2 -translate-y-1/2 text-8xl font-black text-black/5 transition-colors group-hover:text-[#9cbd09]/10 select-none font-mono">
                                    0{i + 1}
                                </span>
                                <a
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="relative block text-5xl md:text-6xl font-black text-black hover:text-[#9cbd09] transition-all duration-300 uppercase italic tracking-tighter"
                                >
                                    <span className="relative z-10">{link.name}</span>
                                    <motion.div
                                        className="absolute bottom-0 left-0 h-1 bg-[#9cbd09] rounded-full"
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
                        className="mt-auto pb-12 relative z-10 border-t border-black/10 pt-8"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div>
                                <p className="text-[10px] text-[#9cbd09] font-bold uppercase tracking-[0.3em] mb-2">Current Status</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-[#9cbd09]" />
                                    <span className="text-sm font-medium text-black/60 tracking-wider uppercase">Available for hire</span>
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
                                        className="w-10 h-10 rounded-lg bg-black/5 flex items-center justify-center text-gray-600 hover:text-[#9cbd09] hover:bg-[#9cbd09]/10 transition-all"
                                    >
                                        <social.Icon size={18} />
                                    </a>
                                ))}
                                <a
                                    href="viber://chat?number=+639763891702"
                                    className="w-10 h-10 rounded-lg bg-black/5 flex items-center justify-center text-gray-600 hover:text-[#9cbd09] hover:bg-[#9cbd09]/10 transition-all"
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
        </nav>
    );
};

export default Navbar;
