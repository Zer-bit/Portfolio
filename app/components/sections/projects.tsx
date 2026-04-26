"use client";

import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { useTilt } from "../../hooks/use-tilt";
import NotificationToast from "../ui/notification-toast";

const projects = [
    {
        title: "Inspire Holdings Incorporated",
        description: "A comprehensive corporate website showcasing company services, portfolio, and client engagement features with modern design and seamless user experience.",
        tech: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Firebase", "EmailJS"],
        image: "/Images/IHI.png",
        link: "https://www.inspireholdings.ph/",
        accent: "#9cbd09",
    },
    {
        title: "iPageant Inspire",
        description: "A dynamic pageant management platform featuring contestant profiles, event scheduling, and interactive voting system with real-time updates.",
        tech: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Firebase", "EmailJS"],
        image: "/Images/inspirepageant.png",
        link: "https://pageant-inspire.vercel.app/",
        accent: "#0ea5e9",
    },
    {
        title: "SHS Club Management System",
        description: "A centralized platform for managing student clubs, memberships, and school activities with administrative controls and real-time record tracking.",
        tech: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
        image: "/Images/shsclub.png",
        link: "#",
        accent: "#f97316",
    },
    {
        title: "jezsic",
        description: "An advanced Android music player that supports offline playback, YouTube video browsing, and integrated MP3 conversion for a seamless offline listening experience.",
        tech: ["Flutter", "Dart", "Android SDK", "YouTube Data API", "FFmpeg"],
        image: "/Images/jezsic-img.png",
        link: "#",
        accent: "#9cbd09",
    },
    {
        title: "Youtube mp3 API",
        description: "A specialized API service designed to fetch and convert YouTube video data into high-quality MP3 formats, utilizing pure JavaScript and JSON for rapid data processing.",
        tech: ["JavaScript", "JSON", "YouTube API", "REST API"],
        image: "https://developers.google.com/static/youtube/images/yt-data-api-search_720.png",
        link: "#",
        accent: "#0ea5e9",
    },
    {
        title: "Inspire Book Slider",
        description: "An interactive digital annual report featuring a sophisticated book-slider interface, providing an engaging and immersive reading experience for corporate disclosures.",
        tech: ["Next.js", "TypeScript", "Framer Motion", "Tailwind CSS"],
        image: "/Images/inspire-annual-report-img.png",
        link: "https://inspire-book-slider.vercel.app/",
        accent: "#f97316",
    },
];

const ProjectCard = ({ project, index, onNotice }: { project: typeof projects[0]; index: number; onNotice: (msg: string) => void }) => {
    const { ref, style } = useTilt(8);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            style={style}
            className="group relative bg-white/80 rounded-3xl overflow-hidden border border-black/10 preserve-3d shadow-sm hover:shadow-md transition-shadow duration-300"
        >
            <div className="aspect-video overflow-hidden relative">
                <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                />
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(135deg, ${project.accent}15, ${project.accent}05)` }}
                />
            </div>

            <div className="p-8 relative flex-grow flex flex-col min-h-[280px]">
                <h4
                    className="text-xl font-bold mb-3 text-black transition-colors duration-300"
                    style={{ color: undefined }}
                    onMouseEnter={e => (e.currentTarget.style.color = project.accent)}
                    onMouseLeave={e => (e.currentTarget.style.color = '')}
                >
                    {project.title}
                </h4>

                <div className="relative flex-grow">
                    {/* Default View */}
                    <div className="group-hover:opacity-0 group-hover:invisible transition-all duration-300">
                        <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                            {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-8">
                            {project.tech.map((t) => (
                                <span
                                    key={t}
                                    className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border transition-colors"
                                    style={{
                                        backgroundColor: `${project.accent}15`,
                                        color: project.accent,
                                        borderColor: `${project.accent}30`,
                                    }}
                                >
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Hover View */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto overflow-y-auto scrollbar-hide">
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {project.description}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 mt-auto pt-4 border-t border-black/10 transition-colors">
                    <a
                        href={project.link}
                        target={project.link === "#" ? "_self" : "_blank"}
                        rel="noopener noreferrer"
                        onClick={(e) => {
                            if (project.link === "#") {
                                e.preventDefault();
                                onNotice("This project is not deployed or published yet.");
                            }
                        }}
                        className="p-2 rounded-full transition-all duration-300 text-white hover:scale-110"
                        style={{ backgroundColor: project.accent }}
                    >
                        <ExternalLink size={18} />
                    </a>
                    <span
                        className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: project.accent }}
                    >
                        {project.link === "#" ? "Coming Soon" : "Live Project"}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

const Project = () => {
    const [notification, setNotification] = React.useState({ isVisible: false, message: "" });

    const showNotice = (message: string) => {
        setNotification({ isVisible: true, message });
    };

    return (
        <div id="projects" className="py-24 bg-[#f0f0f0] relative z-[10]">
            <NotificationToast
                isVisible={notification.isVisible}
                message={notification.message}
                onClose={() => setNotification({ ...notification, isVisible: false })}
            />
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
                    <div>
                        <h2 className="text-[#9cbd09] font-medium tracking-widest mb-4 uppercase text-sm">Case Studies</h2>
                        <h3 className="text-4xl md:text-5xl font-bold text-black">Featured <span className="text-gradient">Projects</span></h3>
                    </div>
                    <p className="text-gray-600 max-w-sm">
                        A selection of my recent work exploring the intersection of design and technology.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
                    {projects.map((project, i) => (
                        <ProjectCard
                            key={project.title}
                            project={project}
                            index={i}
                            onNotice={showNotice}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Project;
