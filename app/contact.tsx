"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MessageSquare, Send, Loader2, CheckCircle2, Github, Linkedin, Instagram } from "lucide-react";

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwtBx0wlXlgT6OvYpRvxmhxgn4fwxEveL4XxNcze_F2H1peDTw3FsgEgdbZYMIbEM4/exec";

const Contact = () => {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        try {
            const response = await fetch(APPS_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors", // Required for Apps Script
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            setStatus("success");
            setFormData({ name: "", email: "", message: "" });
            setTimeout(() => setStatus("idle"), 5000);
        } catch (error) {
            console.error("Form error:", error);
            setStatus("error");
            setTimeout(() => setStatus("idle"), 5000);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div id="contact" className="py-24 bg-black relative overflow-hidden z-[10]">
            {/* Decorative Glow */}
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-violet-600/10 rounded-full blur-[100px]" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    <div>
                        <h2 className="text-violet-500 font-medium tracking-widest mb-4 uppercase text-sm">Get in touch</h2>
                        <h3 className="text-4xl md:text-5xl font-bold mb-8">Let's build something <span className="text-gradient">extraordinary</span>.</h3>

                        <p className="text-gray-400 text-lg mb-12">
                            Have a project in mind? Or just want to say hi? I'm always open to new opportunities and creative collaborations.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-500 group-hover:bg-violet-600 group-hover:text-white transition-all">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email me at</p>
                                    <p className="font-medium text-white/90">jezermantilla263026@gmail.com</p>
                                </div>
                            </div>
                            {/* Social Links Sub-section */}
                            <div className="pt-8 border-t border-white/5">
                                <p className="text-sm text-gray-500 mb-6 uppercase tracking-widest font-medium">Find me on</p>
                                <div className="flex items-center gap-6">
                                    {[
                                        { Icon: Github, href: "https://github.com/Zer-bit", label: "Github" },
                                        { Icon: Linkedin, href: "https://www.linkedin.com/in/jezer-parales-201488386", label: "LinkedIn" },
                                        { Icon: Instagram, href: "https://www.instagram.com/zeretsui/", label: "Instagram" },
                                        {
                                            Icon: () => (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                                </svg>
                                            ),
                                            href: "viber://chat?number=+639763891702",
                                            label: "Viber (+63 976 389 1702)"
                                        },
                                    ].map((social, i) => (
                                        <motion.a
                                            key={i}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ y: -5, scale: 1.1 }}
                                            className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-violet-400 hover:bg-violet-500/10 transition-all"
                                            title={social.label}
                                        >
                                            <social.Icon />
                                        </motion.a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/5 border border-white/10 p-8 md:p-12 rounded-[2rem] backdrop-blur-sm relative"
                    >
                        <AnimatePresence mode="wait">
                            {status === "success" ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center py-12 text-center"
                                >
                                    <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6">
                                        <CheckCircle2 size={48} />
                                    </div>
                                    <h4 className="text-2xl font-bold mb-2">Message Sent!</h4>
                                    <p className="text-gray-400">Thanks for reaching out. I'll get back to you soon.</p>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="form"
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Name</label>
                                            <input
                                                required
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="John Doe"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500/50 transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Email</label>
                                            <input
                                                required
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="john@gmail.com"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500/50 transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Message</label>
                                        <textarea
                                            required
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows={4}
                                            placeholder="Feel free to express yourself..."
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500/50 transition-colors resize-none"
                                        />
                                    </div>
                                    <button
                                        disabled={status === "loading"}
                                        className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        {status === "loading" ? (
                                            <>Sending... <Loader2 size={18} className="animate-spin" /></>
                                        ) : (
                                            <>Send Message <Send size={18} className="group-hover:translate-x-1 transition-transform" /></>
                                        )}
                                    </button>
                                    {status === "error" && (
                                        <p className="text-red-400 text-sm text-center">Something went wrong. Please try again.</p>
                                    )}
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
