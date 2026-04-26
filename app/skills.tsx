"use client";

import React from "react";
import { motion } from "framer-motion";
import { Code, Briefcase, Rocket, Cpu, Palette, Globe, Smartphone, Shield } from "lucide-react";

const technicalSkills = [
    { name: "Frontend Development", icon: Globe, items: ["HTML", "CSS", "JavaScript", "React", "Next.js", "TypeScript", "Tailwind CSS"], color: "#9cbd09" },
    { name: "Mobile Development", icon: Smartphone, items: ["Flutter", "Dart"], color: "#0ea5e9" },
    { name: "Backend & Cloud", icon: Cpu, items: ["Node.js", "Firebase", "MySQL", "EmailJS", "SSMS", "APIs", "Google Apps Script"], color: "#f97316" },
    { name: "DevOps & Tools", icon: Rocket, items: ["Git", "Github", "Vercel", "Visual Studio Code 2022", "Visual Studio Code", "NetBeans", "Unity", "Oracle Virtual Box"], color: "#0ea5e9" },
    { name: "Cybersecurity & OS", icon: Shield, items: ["Linux Kernel", "Kali Linux", "Ubuntu"], color: "#9cbd09" },
];

const professionalSkills = [
    { name: "Technical Leadership", description: "Executing complex projects with precision and problem-solving.", icon: Code, color: "#9cbd09" },
    { name: "UI/UX Design", description: "Creating intuitive and premium user interfaces.", icon: Palette, color: "#f97316" },
    { name: "Communication & Collaboration", description: "Strong verbal and written skills with active listening. Effective team coordination and independent work.", icon: Briefcase, color: "#0ea5e9" },
    { name: "Customer Service", description: "Dedicated to delivering exceptional client experiences.", icon: Code, color: "#f97316" },
    { name: "Time Management", description: "Strong organizational and time management skills.", icon: Palette, color: "#9cbd09" },
];

const Skills = () => {
    return (
        <div id="skills" className="py-24 bg-[#f0f0f0] relative z-[10]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-[#9cbd09] font-medium tracking-widest mb-4 uppercase text-sm">Capabilities</h2>
                    <h3 className="text-4xl md:text-5xl font-bold text-black">Skills & <span className="text-gradient">Expertise</span></h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Technical Skills */}
                    <div>
                        <h4 className="text-2xl font-bold mb-8 flex items-center gap-3 text-black">
                            <span className="text-[#9cbd09] bg-[#9cbd09]/10 p-2 rounded-lg"><Code size={24} /></span>
                            Technical Proficiencies
                        </h4>
                        <div className="space-y-6">
                            {technicalSkills.map((category, i) => (
                                <motion.div
                                    key={category.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white/80 p-6 rounded-2xl border border-black/10 hover:scale-[1.02] transition-all duration-300 group shadow-sm"
                                    style={{ borderLeft: `4px solid ${category.color}` }}
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <category.icon style={{ color: category.color }} size={20} />
                                        <h5 className="font-bold text-black">{category.name}</h5>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {category.items.map((skill) => (
                                            <span
                                                key={skill}
                                                className="px-3 py-1 rounded-full text-xs font-semibold border hover:scale-105 transition-all cursor-default"
                                                style={{
                                                    backgroundColor: `${category.color}15`,
                                                    color: category.color,
                                                    borderColor: `${category.color}30`,
                                                }}
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Professional Skills */}
                    <div>
                        <h4 className="text-2xl font-bold mb-8 flex items-center gap-3 text-black">
                            <span className="text-[#0ea5e9] bg-[#0ea5e9]/10 p-2 rounded-lg"><Briefcase size={24} /></span>
                            Professional Skills
                        </h4>
                        <div className="space-y-6">
                            {professionalSkills.map((skill, i) => (
                                <motion.div
                                    key={skill.name}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group bg-white/80 p-6 rounded-2xl border border-black/10 flex items-start gap-5 hover:scale-[1.02] transition-all duration-300 shadow-sm"
                                >
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                                        style={{
                                            backgroundColor: `${skill.color}15`,
                                            color: skill.color,
                                        }}
                                    >
                                        <skill.icon size={24} />
                                    </div>
                                    <div>
                                        <h5 className="font-bold mb-1 text-black">{skill.name}</h5>
                                        <p className="text-gray-600 text-sm leading-relaxed">{skill.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Skills;
