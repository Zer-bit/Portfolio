"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, Loader2, CheckCircle2, Github, Linkedin, Instagram } from "lucide-react";
import { PixelButton } from "../ui/pixel-button";
import { useSound } from "../../hooks/use-sound";

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyaTDnX4uuklVWAp6C9KwNT9pHzFhEoDd_IaTfxy_fqAk07hiICcjTREYr3-5dLXV4/exec";

const Contact = () => {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });
    const { playClick } = useSound();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        try {
            const response = await fetch(APPS_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
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
        <div id="contact" className="py-24 bg-[#f0f0f0] relative overflow-hidden z-[10]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    <div>
                        <h2 className="text-[#9cbd09] font-medium tracking-widest mb-4 uppercase text-sm">Get in touch</h2>
                        <h3 className="text-4xl md:text-5xl font-bold mb-8 text-black">Let's build something <span className="text-gradient-orange">extraordinary</span>.</h3>

                        <p className="text-gray-600 text-lg mb-12">
                            Have a project in mind? Or just want to say hi? I'm always open to new opportunities and creative collaborations.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-2xl bg-[#0ea5e9]/10 flex items-center justify-center text-[#0ea5e9] group-hover:bg-[#0ea5e9] group-hover:text-white transition-all">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email me at</p>
                                    <a href="mailto:jezermantilla263026@gmail.com" onClick={playClick} className="font-medium text-black hover:text-[#0ea5e9] transition-colors">
                                        jezermantilla263026@gmail.com
                                    </a>
                                </div>
                            </div>
                            
                            <div className="pt-8 border-t border-black/10">
                                <p className="text-sm text-gray-500 mb-6 uppercase tracking-widest font-medium">Find me on</p>
                                <div className="flex items-center gap-6">
                                    {[
                                        { Icon: Github, href: "https://github.com/Zer-bit", label: "Github", color: "#9cbd09" },
                                        { Icon: Linkedin, href: "https://www.linkedin.com/in/jezer-parales-201488386", label: "LinkedIn", color: "#0ea5e9" },
                                        { Icon: Instagram, href: "https://www.instagram.com/zeretsui/", label: "Instagram", color: "#f97316" },
                                        {
                                            Icon: () => (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                                </svg>
                                            ),
                                            href: "viber://chat?number=+639763891702",
                                            label: "Viber (+63 976 389 1702)",
                                            color: "#9cbd09"
                                        },
                                    ].map((social, i) => (
                                        <motion.a
                                            key={i}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ y: -5, scale: 1.1 }}
                                            onClick={playClick}
                                            className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center text-gray-600 transition-all"
                                            style={{
                                                ['--hover-color' as any]: social.color,
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.color = social.color;
                                                e.currentTarget.style.backgroundColor = `${social.color}15`;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.color = '';
                                                e.currentTarget.style.backgroundColor = '';
                                            }}
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
                        className="bg-white/80 border border-black/10 p-8 md:p-12 rounded-[2rem] backdrop-blur-sm relative shadow-sm"
                    >
                        {status === "success" ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-12 text-center"
                            >
                                <div className="w-20 h-20 bg-[#9cbd09]/10 text-[#9cbd09] rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle2 size={48} />
                                </div>
                                <h4 className="text-2xl font-bold mb-2 text-black">Message Sent!</h4>
                                <p className="text-gray-600">Thanks for reaching out. I'll get back to you soon.</p>
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
                                        <label className="text-sm font-medium text-gray-600">Name</label>
                                        <input
                                            required
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            className="w-full bg-white/80 border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#9cbd09] focus:ring-2 focus:ring-[#9cbd09]/20 transition-all text-black"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-600">Email</label>
                                        <input
                                            required
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john@gmail.com"
                                            className="w-full bg-white/80 border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 transition-all text-black"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-600">Message</label>
                                    <textarea
                                        required
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="Feel free to express yourself..."
                                        className="w-full bg-white/80 border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#9cbd09] focus:ring-2 focus:ring-[#9cbd09]/20 transition-all resize-none text-black"
                                    />
                                </div>
                                <PixelButton
                                    type="submit"
                                    variant="brick"
                                    size="lg"
                                    disabled={status === "loading"}
                                    style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                                >
                                    {status === "loading" ? (
                                        <>Sending... <Loader2 size={16} className="animate-spin" /></>
                                    ) : (
                                        <>Send Message <Send size={16} /></>
                                    )}
                                </PixelButton>
                                {status === "error" && (
                                    <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>
                                )}
                            </motion.form>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
