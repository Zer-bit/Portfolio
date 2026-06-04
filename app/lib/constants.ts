// Color Palette
export const COLORS = {
  primary: {
    green: "#9cbd09",
    greenDark: "#7a9a07",
    greenLight: "#b8d42e",
  },
  secondary: {
    blue: "#0ea5e9",
    blueDark: "#0284c7",
  },
  accent: {
    orange: "#f97316",
    orangeDark: "#ea580c",
  },
  neutral: {
    background: "#f0f0f0",
    foreground: "#111111",
  },
} as const;

// Social Links
export const SOCIAL_LINKS = {
  github: "https://github.com/Zer-bit",
  linkedin: "https://www.linkedin.com/in/jezer-parales-201488386",
  instagram: "https://www.instagram.com/zeretsui/",
  viber: "viber://chat?number=+639763891702",
  email: "mailto:jezermantilla263026@gmail.com",
} as const;

// Contact Information
export const CONTACT_INFO = {
  email: "jezermantilla263026@gmail.com",
  phone: "+63 976 389 1702",
} as const;

// Google Apps Script URL
export const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyaTDnX4uuklVWAp6C9KwNT9pHzFhEoDd_IaTfxy_fqAk07hiICcjTREYr3-5dLXV4/exec";

// Route Constants
export const ROUTES = {
  home: "/",
  world: "/world",
  about: "/about",
  projects: "/projects",
  skills: "/skills",
  experience: "/experience",
  contact: "/contact",
  settings: "/settings",
  game: "/game",
} as const;

// Navigation Links
export const NAV_LINKS = [
  { name: "World", href: ROUTES.world, id: "world" },
  { name: "About", href: ROUTES.about, id: "about" },
  { name: "Projects", href: ROUTES.projects, id: "projects" },
  { name: "Skills", href: ROUTES.skills, id: "skills" },
  { name: "Experience", href: ROUTES.experience, id: "experience" },
  { name: "Contact", href: ROUTES.contact, id: "contact" },
  { name: "Game", href: ROUTES.game, id: "game" },
] as const;

// Base64 encoded 16x16 pixel-art brick SVG for infinite repeating backgrounds
export const BRICK_SVG_BASE64 = "PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9IiNkMDcwMzAiIC8+PHJlY3QgeD0iMCIgeT0iNyIgd2lkdGg9IjE2IiBoZWlnaHQ9IjIiIGZpbGw9IiNhMDUwMjAiIC8+PHJlY3QgeD0iNyIgeT0iMCIgd2lkdGg9IjIiIGhlaWdodD0iNyIgZmlsbD0iI2EwNTAyMCIgLz48cmVjdCB4PSIzIiB5PSI5IiB3aWR0aD0iMiIgaGVpZ2h0PSI3IiBmaWxsPSIjYTA1MDIwIiAvPjxyZWN0IHg9IjExIiB5PSI5IiB3aWR0aD0iMiIgaGVpZ2h0PSI3IiBmaWxsPSIjYTA1MDIwIiAvPjwvc3ZnPg==";
