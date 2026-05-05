import { Globe, Smartphone, Cpu, Rocket, Shield, Code, Palette, Briefcase } from "lucide-react";
import { COLORS } from "./constants";

// Utility: convert a project title to a URL-safe kebab-case slug
export function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // strip special characters
    .trim()
    .replace(/\s+/g, "-");        // spaces → hyphens
}

// Projects Data
export const projects = [
  {
    title: "Inspire Holdings Incorporated",
    description:
      "A comprehensive corporate website showcasing company services, portfolio, and client engagement features with modern design and seamless user experience.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Firebase", "EmailJS"],
    image: "/Images/IHI.png",
    link: "https://www.inspireholdings.ph/",
    accent: COLORS.primary.green,
  },
  {
    title: "iPageant Inspire",
    description:
      "A dynamic pageant management platform featuring contestant profiles, event scheduling, and interactive voting system with real-time updates.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Firebase", "EmailJS"],
    image: "/Images/inspirepageant.png",
    link: "https://pageant-inspire.vercel.app/",
    accent: COLORS.secondary.blue,
  },
  {
    title: "SHS Club Management System",
    description:
      "A centralized platform for managing student clubs, memberships, and school activities with administrative controls and real-time record tracking.",
    tech: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
    image: "/Images/shsclub.png",
    link: "#",
    accent: COLORS.accent.orange,
  },
  {
    title: "jezsic",
    description:
      "An advanced Android music player that supports offline playback, YouTube video browsing, and integrated MP3 conversion for a seamless offline listening experience.",
    tech: ["Flutter", "Dart", "Android SDK", "YouTube Data API", "FFmpeg"],
    image: "/Images/jezsic-img.png",
    link: "#",
    accent: COLORS.primary.green,
  },
  {
    title: "Youtube mp3 API",
    description:
      "A specialized API service designed to fetch and convert YouTube video data into high-quality MP3 formats, utilizing pure JavaScript and JSON for rapid data processing.",
    tech: ["JavaScript", "JSON", "YouTube API", "REST API"],
    image: "https://developers.google.com/static/youtube/images/yt-data-api-search_720.png",
    link: "#",
    accent: COLORS.secondary.blue,
  },
  {
    title: "Inspire Book Slider",
    description:
      "An interactive digital annual report featuring a sophisticated book-slider interface, providing an engaging and immersive reading experience for corporate disclosures.",
    tech: ["Next.js", "TypeScript", "Framer Motion", "Tailwind CSS"],
    image: "/Images/inspire-annual-report-img.png",
    link: "https://inspire-book-slider.vercel.app/",
    accent: COLORS.accent.orange,
  },
];

// Technical Skills Data
export const technicalSkills = [
  {
    name: "Frontend Development",
    icon: Globe,
    items: ["HTML", "CSS", "JavaScript", "React", "Next.js", "TypeScript", "Tailwind CSS"],
    color: COLORS.primary.green,
  },
  {
    name: "Mobile Development",
    icon: Smartphone,
    items: ["Flutter", "Dart"],
    color: COLORS.secondary.blue,
  },
  {
    name: "Backend & Cloud",
    icon: Cpu,
    items: ["Node.js", "Firebase", "MySQL", "EmailJS", "SSMS", "APIs", "Google Apps Script"],
    color: COLORS.accent.orange,
  },
  {
    name: "DevOps & Tools",
    icon: Rocket,
    items: [
      "Git",
      "Github",
      "Vercel",
      "Visual Studio Code 2022",
      "Visual Studio Code",
      "NetBeans",
      "Unity",
      "Oracle Virtual Box",
    ],
    color: COLORS.secondary.blue,
  },
  {
    name: "Cybersecurity & OS",
    icon: Shield,
    items: ["Linux Kernel", "Kali Linux", "Ubuntu"],
    color: COLORS.primary.green,
  },
];

// Professional Skills Data
export const professionalSkills = [
  {
    name: "Technical Leadership",
    description: "Executing complex projects with precision and problem-solving.",
    icon: Code,
    color: COLORS.primary.green,
  },
  {
    name: "UI/UX Design",
    description: "Creating intuitive and premium user interfaces.",
    icon: Palette,
    color: COLORS.accent.orange,
  },
  {
    name: "Communication & Collaboration",
    description:
      "Strong verbal and written skills with active listening. Effective team coordination and independent work.",
    icon: Briefcase,
    color: COLORS.secondary.blue,
  },
  {
    name: "Customer Service",
    description: "Dedicated to delivering exceptional client experiences.",
    icon: Code,
    color: COLORS.accent.orange,
  },
  {
    name: "Time Management",
    description: "Strong organizational and time management skills.",
    icon: Palette,
    color: COLORS.primary.green,
  },
];

// Experience Data
export const experience = [
  {
    jobTitle: "Full Stack Developer",
    company: "Inspire Holdings Incorporated",
    startDate: "2024",
    endDate: "Present",
    description:
      "Designed and developed full-stack web applications for corporate clients, including the company website and the iPageant platform. Built features using Next.js, TypeScript, Firebase, and Tailwind CSS. Collaborated directly with stakeholders to deliver polished, production-ready products.",
    accent: COLORS.primary.green,
  },
  {
    jobTitle: "Freelance Web Developer",
    company: "Self-Employed",
    startDate: "2023",
    endDate: "Present",
    description:
      "Delivered custom web solutions for small businesses and personal projects. Responsibilities included UI/UX design, frontend development, backend integration, and deployment on Vercel. Projects include the Inspire Book Slider and various client landing pages.",
    accent: COLORS.secondary.blue,
  },
  {
    jobTitle: "Mobile App Developer",
    company: "Personal Project",
    startDate: "2023",
    endDate: "2024",
    description:
      "Built jezsic, an Android music player using Flutter and Dart. Integrated the YouTube Data API for video browsing and implemented offline MP3 conversion via FFmpeg. Managed the full development lifecycle from design to release.",
    accent: COLORS.accent.orange,
  },
];
