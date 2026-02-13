"use client";

import React from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useTilt } from "./hooks/use-tilt";

const projects = [
    {
        title: "Inspire Holdings Incorporated",
        description: "A comprehensive corporate website showcasing company services, portfolio, and client engagement features with modern design and seamless user experience.",
        tech: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Firebase", "EmailJS"],
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
        link: "https://www.inspireholdings.ph/",
    },
    {
        title: "iPageant Inspire",
        description: "A dynamic pageant management platform featuring contestant profiles, event scheduling, and interactive voting system with real-time updates.",
        tech: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Firebase", "EmailJS"],
        image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800",
        link: "https://pageant-inspire.vercel.app/",
    },
];

const ProjectCard = ({ project, index }: { project: typeof projects[0]; index: number }) => {
    const { ref, style } = useTilt(8);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            style={style}
            className="group relative bg-white/5 rounded-3xl overflow-hidden holographic-border preserve-3d"
        >
            <div className="aspect-video overflow-hidden relative">
                <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100"
                />
                {/* Glitch overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay" />
            </div>

            <div className="p-8 relative">
                <h4 className="text-xl font-bold mb-3 group-hover:text-violet-400 transition-colors">
                    {project.title}
                </h4>
                <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                    {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                    {project.tech.map((t) => (
                        <span
                            key={t}
                            className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-violet-500/10 text-violet-400 rounded-full border border-violet-500/20 hover:bg-violet-500/20 transition-colors"
                        >
                            {t}
                        </span>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/5 rounded-full hover:bg-violet-600 transition-all text-white hover:scale-110 hover:-rotate-12 duration-300"
                    >
                        <ExternalLink size={20} />
                    </a>
                </div>

                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 pointer-events-none rounded-3xl" />
            </div>
        </motion.div>
    );
};

const Project = () => {
    return (
        <div id="projects" className="py-24 bg-black relative z-[10]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
                    <div>
                        <h2 className="text-violet-500 font-medium tracking-widest mb-4 uppercase text-sm">Case Studies</h2>
                        <h3 className="text-4xl md:text-5xl font-bold">Featured <span className="text-gradient">Projects</span></h3>
                    </div>
                    <p className="text-gray-400 max-w-sm">
                        A selection of my recent work exploring the intersection of design and technology.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
                    {projects.map((project, i) => (
                        <ProjectCard key={project.title} project={project} index={i} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Project;
