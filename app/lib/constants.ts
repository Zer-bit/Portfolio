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
  { name: "Skills", href: ROUTES.skills, id: "skills" },
  { name: "Projects", href: ROUTES.projects, id: "projects" },
  { name: "Experience", href: ROUTES.experience, id: "experience" },
  { name: "Contact", href: ROUTES.contact, id: "contact" },
  { name: "Game", href: ROUTES.game, id: "game" },
] as const;
