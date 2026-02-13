"use client";

import React from "react";
import { motion } from "framer-motion";
import { Code, Briefcase, Rocket, Cpu, Palette, Globe } from "lucide-react";

const technicalSkills = [
    { name: "Frontend Development", icon: Globe, items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
    { name: "Backend & Cloud", icon: Cpu, items: ["Node.js", "Firebase", "MySQL", "EmailJS", "SSMS"] },
    { name: "DevOps & Tools", icon: Rocket, items: ["Git", "Github", "Vercel", "Visual Studio Code 2022", "Visual Studio Code", "Antigravity", "Kiro", "NetBeans", "Unity", "Oracle Virtual Box"] },
];

const professionalSkills = [
    { name: "Technical Leadership", description: "Executing complex projects with precision.", icon: Code },
    { name: "UI/UX Design", description: "Creating intuitive and premium user interfaces.", icon: Palette },
    { name: "Collaboration", description: "Effective communication and team coordination.", icon: Briefcase },
];

const Skills = () => {
    return (
        <div id="skills" className="py-24 bg-black relative z-[10]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-violet-500 font-medium tracking-widest mb-4 uppercase text-sm">Capabilities</h2>
                    <h3 className="text-4xl md:text-5xl font-bold">Skills & <span className="text-gradient">Expertise</span></h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Technical Skills */}
                    <div>
                        <h4 className="text-2xl font-bold mb-8 flex items-center gap-3">
                            <span className="text-violet-500 bg-violet-500/10 p-2 rounded-lg"><Code size={24} /></span>
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
                                    className="bg-white/5 p-6 rounded-2xl holographic-border hover:scale-[1.02] transition-all duration-300 group"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <category.icon className="text-violet-400 group-hover:rotate-12 transition-transform duration-300" size={20} />
                                        <h5 className="font-bold">{category.name}</h5>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {category.items.map((skill) => (
                                            <span key={skill} className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-full text-xs font-semibold border border-violet-500/10 hover:bg-violet-500/20 hover:scale-105 transition-all cursor-default">
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
                        <h4 className="text-2xl font-bold mb-8 flex items-center gap-3">
                            <span className="text-violet-500 bg-violet-500/10 p-2 rounded-lg"><Briefcase size={24} /></span>
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
                                    className="group bg-white/5 p-6 rounded-2xl holographic-border flex items-start gap-5 hover:scale-[1.02] transition-all duration-300"
                                >
                                    <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center text-violet-500 group-hover:bg-violet-600 group-hover:text-white transition-all group-hover:rotate-12 duration-300">
                                        <skill.icon size={24} />
                                    </div>
                                    <div>
                                        <h5 className="font-bold mb-1">{skill.name}</h5>
                                        <p className="text-gray-500 text-sm leading-relaxed">{skill.description}</p>
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
