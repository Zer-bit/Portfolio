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
    title: "void",
    description:
      "An advanced Android music player that lets you browse and convert video media into high-quality audio files for offline listening. The application uses Dart for the user interface and is powered by a high-performance Rust core via FFI for internal logic, utility functions, and algorithms. Supported by a robust backend deployed in Rust.",
    tech: ["Dart", "Rust", "Flutter", "Android SDK", "FFI", "FFmpeg"],
    image: "/Images/void-img.png",
    link: "#",
    accent: COLORS.primary.green,
  },
  {
    title: "Youtube mp3 API",
    description:
      "A high-performance API service designed to fetch and convert YouTube video data into high-quality MP3 or M4A formats, written in Rust for optimal execution speed, safety, and rapid data processing.",
    tech: ["Rust", "REST API", "YouTube API", "JSON"],
    image: "/Images/youtube-mp3-api.svg",
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
    items: ["Flutter", "Dart", "React Native"],
    color: COLORS.secondary.blue,
  },
  {
    name: "Backend & Cloud",
    icon: Cpu,
    items: ["Node.js", "C#", "Rust", "Firebase", "Supabase", "PostgreSQL", "MySQL", "REST API", "Redis"],
    color: COLORS.accent.orange,
  },
  {
    name: "DevOps & Tools",
    icon: Rocket,
    items: [
      "Git",
      "Github",
      "Docker",
      "Vercel",
      "EmailJS",
      "Google Apps Script",
      "SSMS",
      "Visual Studio 2022",
      "Visual Studio Code",
      "NetBeans",
      "Unity",
      "Oracle VirtualBox",
    ],
    color: COLORS.secondary.blue,
  },
  {
    name: "Cybersecurity & OS",
    icon: Shield,
    items: ["Linux Kernel", "Kali Linux", "Ubuntu", "Windows", "Fedora"],
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
  {
    name: "Adaptability",
    description:
      "Quick to learn and adapt to new technologies, tools, and challenges. If I don't know something, I'll figure it out.",
    icon: Rocket,
    color: COLORS.secondary.blue,
  },
];

export interface ExperienceProject {
  title: string;
  link?: string;
}

export interface ExperienceEntry {
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  overview: string;
  details: string[];
  projects?: ExperienceProject[];
  tech: string[];
  accent: string;
}

// Experience Data
export const experience: ExperienceEntry[] = [
  {
    jobTitle: "Technical Executive Secretary",
    company: "Inspire Holdings Incorporated",
    startDate: "May 2026",
    endDate: "Present",
    overview: "Execute a unique, hybrid role combining high-level executive administrative support with technical asset management, digital maintenance, and secretarial operations.",
    details: [
      "Streamline daily executive functions by managing corporate schedules, high-priority communications, and documentation with precision.",
      "Maintain company digital systems, including web portals, domain assets, and database backups, ensuring maximum operational uptime.",
      "Optimize record-keeping by designing secure, structured digital archives for confidential corporate and technical documents."
    ],
    tech: ["Technical Operations", "Digital Maintenance", "Database Management", "Google Workspace", "Office Productivity Tools"],
    accent: COLORS.accent.orange,
  },
  {
    jobTitle: "Full Stack Developer",
    company: "Inspire Holdings Incorporated",
    startDate: "Jan 2026",
    endDate: "May 2026",
    overview: "Designed and built websites for business clients, managing both the front-end layout and backend storage. Focused on turning customer ideas into fully working web platforms.",
    details: [
      "Created the official company website to establish a clean and professional online presence.",
      "Developed a pageant management website with profile pages, event schedules, and real-time voting.",
      "Collaborated directly with business clients to draft layouts, design screens, and publish websites.",
      "Set up database systems and online connections to handle user accounts and interactive features."
    ],
    projects: [
      { title: "Inspire Holdings Incorporated", link: "https://www.inspireholdings.ph/" },
      { title: "iPageant Inspire", link: "https://pageant-inspire.vercel.app/" }
    ],
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Firebase", "EmailJS", "APIs"],
    accent: COLORS.primary.green,
  },
  {
    jobTitle: "Freelance Web Developer",
    company: "Self-Employed",
    startDate: "2024",
    endDate: "Present",
    overview: "Created custom websites and web systems for small businesses, schools, and personal projects. Managed every step of the work, from drawing layouts to writing code, setting up databases, and launching websites.",
    details: [
      "Developed the Inspire Book Slider, an interactive digital annual report website utilizing React, Next.js, and Framer Motion.",
      "Created the YouTube mp3 API to handle video searching and audio conversions using Node.js and REST APIs.",
      "Built the SHS Club Management System, integrating custom user interfaces with vanilla and MySQL database storage.",
      "Leveraged Supabase and PostgreSQL to design secure database schemas and user login flows for freelance clients.",
      "Utilized Docker to containerize development environments and Git/Vercel for version control and website deployment."
    ],
    projects: [
      { title: "Inspire Book Slider", link: "https://inspire-book-slider.vercel.app/" },
      { title: "Youtube mp3 API" },
      { title: "SHS Club Management System" }
    ],
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "MySQL", "Supabase", "PostgreSQL", "REST API", "Docker", "Git", "Vercel"],
    accent: COLORS.secondary.blue,
  },
  {
    jobTitle: "Mobile App Developer",
    company: "Personal Project",
    startDate: "2025",
    endDate: "Present",
    overview: "Built and launched mobile apps for offline media playback and video search tools. Guided the entire development process from visual layout design to releasing on app stores.",
    details: [
      "Built 'void', an Android music player that lets users download and play audio files offline without internet.",
      "Added search features to help users find, search, and catalog their favorite music tracks easily.",
      "Used media conversion tools to let users save audio files in different formats directly on their devices.",
      "Designed app screens, wrote the backend logic, improved app speed, and managed new updates."
    ],
    projects: [
      { title: "void" }
    ],
    tech: ["Flutter", "Dart", "Android SDK", "YouTube Data API", "FFmpeg", "State Management"],
    accent: COLORS.accent.orange,
  },
];
