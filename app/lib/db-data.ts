/**
 * app/lib/db-data.ts — Unified Data Access & Storage Layer
 *
 * Fetches dynamic content from Supabase database tables with automatic,
 * resilient fallback to local static data (`app/lib/data.ts` & `constants.ts`).
 */

import { supabase, isSupabaseConfigured } from "./supabaseClient";
import {
  projects as staticProjects,
  technicalSkills as staticTechnicalSkills,
  professionalSkills as staticProfessionalSkills,
  experience as staticExperience,
  toSlug,
} from "./data";
import { CONTACT_INFO, SOCIAL_LINKS } from "./constants";

export interface ProjectItem {
  id?: string;
  title: string;
  slug: string;
  description: string;
  tech: string[];
  image: string;
  link: string;
  accent: string;
  order_index?: number;
}

export interface TechnicalSkillItem {
  id?: string;
  name: string;
  icon: string;
  items: string[];
  color: string;
  order_index?: number;
}

export interface ProfessionalSkillItem {
  id?: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  order_index?: number;
}

export interface ExperienceItem {
  id?: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  overview: string;
  details: string[];
  projects?: { title: string; link?: string }[];
  tech: string[];
  accent: string;
  order_index?: number;
}

export interface ContactInfoItem {
  id?: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  instagram: string;
  viber: string;
}

// ---------------------------------------------------------------------------
// FETCH METHODS (with static fallback)
// ---------------------------------------------------------------------------

export async function fetchProjects(): Promise<ProjectItem[]> {
  if (!isSupabaseConfigured()) {
    return staticProjects.map((p, idx) => ({ ...p, slug: toSlug(p.title), order_index: idx + 1 }));
  }
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("order_index", { ascending: true });

    if (error || !data || data.length === 0) {
      return staticProjects.map((p, idx) => ({ ...p, slug: toSlug(p.title), order_index: idx + 1 }));
    }

    return data.map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug || toSlug(row.title),
      description: row.description,
      tech: Array.isArray(row.tech) ? row.tech : [],
      image: row.image,
      link: row.link,
      accent: row.accent,
      order_index: row.order_index,
    }));
  } catch {
    return staticProjects.map((p, idx) => ({ ...p, slug: toSlug(p.title), order_index: idx + 1 }));
  }
}

export async function fetchProjectBySlug(slug: string): Promise<ProjectItem | null> {
  const allProjects = await fetchProjects();
  const match = allProjects.find((p) => p.slug === slug || toSlug(p.title) === slug);
  return match ?? null;
}

export async function fetchTechnicalSkills(): Promise<TechnicalSkillItem[]> {
  if (!isSupabaseConfigured()) {
    return staticTechnicalSkills.map((s, idx) => ({
      name: s.name,
      icon: s.icon.name || "Globe",
      items: s.items,
      color: s.color,
      order_index: idx + 1,
    }));
  }
  try {
    const { data, error } = await supabase
      .from("technical_skills")
      .select("*")
      .order("order_index", { ascending: true });

    if (error || !data || data.length === 0) {
      return staticTechnicalSkills.map((s, idx) => ({
        name: s.name,
        icon: s.icon.name || "Globe",
        items: s.items,
        color: s.color,
        order_index: idx + 1,
      }));
    }

    return data.map((row) => ({
      id: row.id,
      name: row.name,
      icon: row.icon || "Globe",
      items: Array.isArray(row.items) ? row.items : [],
      color: row.color,
      order_index: row.order_index,
    }));
  } catch {
    return staticTechnicalSkills.map((s, idx) => ({
      name: s.name,
      icon: s.icon.name || "Globe",
      items: s.items,
      color: s.color,
      order_index: idx + 1,
    }));
  }
}

export async function fetchProfessionalSkills(): Promise<ProfessionalSkillItem[]> {
  if (!isSupabaseConfigured()) {
    return staticProfessionalSkills.map((s, idx) => ({
      name: s.name,
      description: s.description,
      icon: s.icon.name || "Code",
      color: s.color,
      order_index: idx + 1,
    }));
  }
  try {
    const { data, error } = await supabase
      .from("professional_skills")
      .select("*")
      .order("order_index", { ascending: true });

    if (error || !data || data.length === 0) {
      return staticProfessionalSkills.map((s, idx) => ({
        name: s.name,
        description: s.description,
        icon: s.icon.name || "Code",
        color: s.color,
        order_index: idx + 1,
      }));
    }

    return data.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      icon: row.icon || "Code",
      color: row.color,
      order_index: row.order_index,
    }));
  } catch {
    return staticProfessionalSkills.map((s, idx) => ({
      name: s.name,
      description: s.description,
      icon: s.icon.name || "Code",
      color: s.color,
      order_index: idx + 1,
    }));
  }
}

export async function fetchExperience(): Promise<ExperienceItem[]> {
  if (!isSupabaseConfigured()) {
    return staticExperience.map((e, idx) => ({
      jobTitle: e.jobTitle,
      company: e.company,
      startDate: e.startDate,
      endDate: e.endDate,
      overview: e.overview,
      details: e.details,
      projects: e.projects,
      tech: e.tech,
      accent: e.accent,
      order_index: idx + 1,
    }));
  }
  try {
    const { data, error } = await supabase
      .from("experience")
      .select("*")
      .order("order_index", { ascending: true });

    if (error || !data || data.length === 0) {
      return staticExperience.map((e, idx) => ({
        jobTitle: e.jobTitle,
        company: e.company,
        startDate: e.startDate,
        endDate: e.endDate,
        overview: e.overview,
        details: e.details,
        projects: e.projects,
        tech: e.tech,
        accent: e.accent,
        order_index: idx + 1,
      }));
    }

    return data.map((row) => ({
      id: row.id,
      jobTitle: row.job_title,
      company: row.company,
      startDate: row.start_date,
      endDate: row.end_date,
      overview: row.overview,
      details: Array.isArray(row.details) ? row.details : [],
      projects: Array.isArray(row.projects) ? row.projects : [],
      tech: Array.isArray(row.tech) ? row.tech : [],
      accent: row.accent,
      order_index: row.order_index,
    }));
  } catch {
    return staticExperience.map((e, idx) => ({
      jobTitle: e.jobTitle,
      company: e.company,
      startDate: e.startDate,
      endDate: e.endDate,
      overview: e.overview,
      details: e.details,
      projects: e.projects,
      tech: e.tech,
      accent: e.accent,
      order_index: idx + 1,
    }));
  }
}

export async function fetchContactInfo(): Promise<ContactInfoItem> {
  const fallback: ContactInfoItem = {
    email: CONTACT_INFO.email,
    phone: CONTACT_INFO.phone,
    github: SOCIAL_LINKS.github,
    linkedin: SOCIAL_LINKS.linkedin,
    instagram: SOCIAL_LINKS.instagram,
    viber: SOCIAL_LINKS.viber,
  };

  if (!isSupabaseConfigured()) return fallback;

  try {
    const { data, error } = await supabase.from("contact_info").select("*").limit(1);
    if (error || !data || data.length === 0) return fallback;
    const row = data[0];
    return {
      id: row.id,
      email: row.email || fallback.email,
      phone: row.phone || fallback.phone,
      github: row.github || fallback.github,
      linkedin: row.linkedin || fallback.linkedin,
      instagram: row.instagram || fallback.instagram,
      viber: row.viber || fallback.viber,
    };
  } catch {
    return fallback;
  }
}

// ---------------------------------------------------------------------------
// MUTATION / STORAGE METHODS (Admin Operations)
// ---------------------------------------------------------------------------

export async function uploadProjectImage(file: File): Promise<string> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured yet. Add credentials to .env.local");
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `projects/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("portfolio-assets")
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from("portfolio-assets").getPublicUrl(filePath);
  return data.publicUrl;
}

export async function saveProject(project: Partial<ProjectItem>): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error("Supabase not configured");

  const slug = project.slug || (project.title ? toSlug(project.title) : "project");
  const payload = {
    title: project.title,
    slug,
    description: project.description,
    tech: project.tech ?? [],
    image: project.image,
    link: project.link || "#",
    accent: project.accent || "#9cbd09",
    order_index: project.order_index ?? 99,
  };

  if (project.id) {
    const { error } = await supabase.from("projects").update(payload).eq("id", project.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("projects").insert(payload);
    if (error) throw error;
  }
}

export async function deleteProject(id: string): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error("Supabase not configured");
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}

export async function saveTechnicalSkill(skill: Partial<TechnicalSkillItem>): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error("Supabase not configured");
  const payload = {
    name: skill.name,
    icon: skill.icon || "Globe",
    items: skill.items ?? [],
    color: skill.color || "#9cbd09",
    order_index: skill.order_index ?? 99,
  };

  if (skill.id) {
    const { error } = await supabase.from("technical_skills").update(payload).eq("id", skill.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("technical_skills").insert(payload);
    if (error) throw error;
  }
}

export async function deleteTechnicalSkill(id: string): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error("Supabase not configured");
  const { error } = await supabase.from("technical_skills").delete().eq("id", id);
  if (error) throw error;
}

export async function saveProfessionalSkill(skill: Partial<ProfessionalSkillItem>): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error("Supabase not configured");
  const payload = {
    name: skill.name,
    description: skill.description,
    icon: skill.icon || "Code",
    color: skill.color || "#9cbd09",
    order_index: skill.order_index ?? 99,
  };

  if (skill.id) {
    const { error } = await supabase.from("professional_skills").update(payload).eq("id", skill.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("professional_skills").insert(payload);
    if (error) throw error;
  }
}

export async function deleteProfessionalSkill(id: string): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error("Supabase not configured");
  const { error } = await supabase.from("professional_skills").delete().eq("id", id);
  if (error) throw error;
}

export async function saveExperience(exp: Partial<ExperienceItem>): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error("Supabase not configured");
  const payload = {
    job_title: exp.jobTitle,
    company: exp.company,
    start_date: exp.startDate,
    end_date: exp.endDate,
    overview: exp.overview,
    details: exp.details ?? [],
    projects: exp.projects ?? [],
    tech: exp.tech ?? [],
    accent: exp.accent || "#9cbd09",
    order_index: exp.order_index ?? 99,
  };

  if (exp.id) {
    const { error } = await supabase.from("experience").update(payload).eq("id", exp.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("experience").insert(payload);
    if (error) throw error;
  }
}

export async function deleteExperience(id: string): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error("Supabase not configured");
  const { error } = await supabase.from("experience").delete().eq("id", id);
  if (error) throw error;
}

export async function saveContactInfo(contact: Partial<ContactInfoItem>): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error("Supabase not configured");
  const payload = {
    email: contact.email,
    phone: contact.phone,
    github: contact.github,
    linkedin: contact.linkedin,
    instagram: contact.instagram,
    viber: contact.viber,
  };

  if (contact.id) {
    const { error } = await supabase.from("contact_info").update(payload).eq("id", contact.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("contact_info").insert(payload);
    if (error) throw error;
  }
}
