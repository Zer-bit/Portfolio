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
  galleryItems as staticGalleryItems,
  type GalleryItem,
  toSlug,
} from "./data";
export type { GalleryItem };
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
    if (uploadError.message.includes("Bucket not found") || uploadError.message.includes("not found")) {
      throw new Error("Supabase Storage bucket 'portfolio-assets' not found. Create public bucket 'portfolio-assets' in Supabase Storage dashboard!");
    }
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from("portfolio-assets").getPublicUrl(filePath);
  return data.publicUrl;
}

export async function saveProject(project: Partial<ProjectItem>): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error("Supabase not configured. Check .env.local");

  const title = project.title || "New Project";
  const slug = project.slug || toSlug(title) || `project-${Date.now()}`;
  const payload = {
    title,
    slug,
    description: project.description || "",
    tech: project.tech ?? [],
    image: project.image || "/Images/IHI.png",
    link: project.link || "#",
    accent: project.accent || "#9cbd09",
    order_index: project.order_index ?? 99,
  };

  console.log("[db-data] saveProject", { id: project.id, title, slug, payload });

  if (project.id) {
    const { error } = await supabase.from("projects").update(payload).eq("id", project.id);
    if (error) { console.error("[db-data] saveProject UPDATE error:", error); throw new Error(`Save failed: ${error.message}`); }
    console.log("[db-data] saveProject UPDATE success, id:", project.id);
  } else {
    const { data: existing } = await supabase.from("projects").select("id").or(`slug.eq.${slug},title.eq.${title}`).limit(1);
    if (existing && existing.length > 0) {
      const { error } = await supabase.from("projects").update(payload).eq("id", existing[0].id);
      if (error) { console.error("[db-data] saveProject UPSERT error:", error); throw new Error(`Save failed: ${error.message}`); }
      console.log("[db-data] saveProject UPSERT success, id:", existing[0].id);
    } else {
      const { error } = await supabase.from("projects").insert(payload);
      if (error) { console.error("[db-data] saveProject INSERT error:", error); throw new Error(`Save failed: ${error.message}`); }
      console.log("[db-data] saveProject INSERT success");
    }
  }
}

export async function deleteProject(id?: string, title?: string): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error("Supabase not configured. Check .env.local");
  console.log("[db-data] deleteProject", { id, title });
  if (id) {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) { console.error("[db-data] deleteProject error:", error); throw new Error(`Delete failed: ${error.message}`); }
    console.log("[db-data] deleteProject success, id:", id);
  } else if (title) {
    const { error } = await supabase.from("projects").delete().eq("title", title);
    if (error) { console.error("[db-data] deleteProject error:", error); throw new Error(`Delete failed: ${error.message}`); }
    console.log("[db-data] deleteProject success, title:", title);
  } else {
    throw new Error("Cannot delete: no id or title provided");
  }
}

export async function saveTechnicalSkill(skill: Partial<TechnicalSkillItem>): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error("Supabase not configured. Check .env.local");
  const payload = {
    name: skill.name || "New Skill Category",
    icon: skill.icon || "Globe",
    items: skill.items ?? [],
    color: skill.color || "#9cbd09",
    order_index: skill.order_index ?? 99,
  };
  console.log("[db-data] saveTechnicalSkill", { id: skill.id, payload });

  if (skill.id) {
    const { error } = await supabase.from("technical_skills").update(payload).eq("id", skill.id);
    if (error) { console.error("[db-data] saveTechnicalSkill error:", error); throw new Error(`Save failed: ${error.message}`); }
    console.log("[db-data] saveTechnicalSkill UPDATE success");
  } else {
    const { data: existing } = await supabase.from("technical_skills").select("id").eq("name", payload.name).limit(1);
    if (existing && existing.length > 0) {
      const { error } = await supabase.from("technical_skills").update(payload).eq("id", existing[0].id);
      if (error) { console.error("[db-data] saveTechnicalSkill UPSERT error:", error); throw new Error(`Save failed: ${error.message}`); }
      console.log("[db-data] saveTechnicalSkill UPSERT success");
    } else {
      const { error } = await supabase.from("technical_skills").insert(payload);
      if (error) { console.error("[db-data] saveTechnicalSkill INSERT error:", error); throw new Error(`Save failed: ${error.message}`); }
      console.log("[db-data] saveTechnicalSkill INSERT success");
    }
  }
}

export async function deleteTechnicalSkill(id?: string, name?: string): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error("Supabase not configured. Check .env.local");
  console.log("[db-data] deleteTechnicalSkill", { id, name });
  if (id) {
    const { error } = await supabase.from("technical_skills").delete().eq("id", id);
    if (error) { console.error("[db-data] deleteTechnicalSkill error:", error); throw new Error(`Delete failed: ${error.message}`); }
    console.log("[db-data] deleteTechnicalSkill success");
  } else if (name) {
    const { error } = await supabase.from("technical_skills").delete().eq("name", name);
    if (error) { console.error("[db-data] deleteTechnicalSkill error:", error); throw new Error(`Delete failed: ${error.message}`); }
    console.log("[db-data] deleteTechnicalSkill success");
  } else {
    throw new Error("Cannot delete: no id or name provided");
  }
}

export async function saveProfessionalSkill(skill: Partial<ProfessionalSkillItem>): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error("Supabase not configured. Check .env.local");
  const payload = {
    name: skill.name || "New Professional Skill",
    description: skill.description || "",
    icon: skill.icon || "Code",
    color: skill.color || "#9cbd09",
    order_index: skill.order_index ?? 99,
  };
  console.log("[db-data] saveProfessionalSkill", { id: skill.id, payload });

  if (skill.id) {
    const { error } = await supabase.from("professional_skills").update(payload).eq("id", skill.id);
    if (error) { console.error("[db-data] saveProfessionalSkill error:", error); throw new Error(`Save failed: ${error.message}`); }
    console.log("[db-data] saveProfessionalSkill UPDATE success");
  } else {
    const { data: existing } = await supabase.from("professional_skills").select("id").eq("name", payload.name).limit(1);
    if (existing && existing.length > 0) {
      const { error } = await supabase.from("professional_skills").update(payload).eq("id", existing[0].id);
      if (error) { console.error("[db-data] saveProfessionalSkill UPSERT error:", error); throw new Error(`Save failed: ${error.message}`); }
      console.log("[db-data] saveProfessionalSkill UPSERT success");
    } else {
      const { error } = await supabase.from("professional_skills").insert(payload);
      if (error) { console.error("[db-data] saveProfessionalSkill INSERT error:", error); throw new Error(`Save failed: ${error.message}`); }
      console.log("[db-data] saveProfessionalSkill INSERT success");
    }
  }
}

export async function deleteProfessionalSkill(id?: string, name?: string): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error("Supabase not configured. Check .env.local");
  console.log("[db-data] deleteProfessionalSkill", { id, name });
  if (id) {
    const { error } = await supabase.from("professional_skills").delete().eq("id", id);
    if (error) { console.error("[db-data] deleteProfessionalSkill error:", error); throw new Error(`Delete failed: ${error.message}`); }
    console.log("[db-data] deleteProfessionalSkill success");
  } else if (name) {
    const { error } = await supabase.from("professional_skills").delete().eq("name", name);
    if (error) { console.error("[db-data] deleteProfessionalSkill error:", error); throw new Error(`Delete failed: ${error.message}`); }
    console.log("[db-data] deleteProfessionalSkill success");
  } else {
    throw new Error("Cannot delete: no id or name provided");
  }
}

export async function saveExperience(exp: Partial<ExperienceItem>): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error("Supabase not configured. Check .env.local");
  const payload = {
    job_title: exp.jobTitle || "Job Title",
    company: exp.company || "Company",
    start_date: exp.startDate || "2026",
    end_date: exp.endDate || "Present",
    overview: exp.overview || "",
    details: exp.details ?? [],
    projects: exp.projects ?? [],
    tech: exp.tech ?? [],
    accent: exp.accent || "#9cbd09",
    order_index: exp.order_index ?? 99,
  };
  console.log("[db-data] saveExperience", { id: exp.id, payload });

  if (exp.id) {
    const { error } = await supabase.from("experience").update(payload).eq("id", exp.id);
    if (error) { console.error("[db-data] saveExperience error:", error); throw new Error(`Save failed: ${error.message}`); }
    console.log("[db-data] saveExperience UPDATE success");
  } else {
    const { data: existing } = await supabase.from("experience").select("id").eq("company", payload.company).limit(1);
    if (existing && existing.length > 0) {
      const { error } = await supabase.from("experience").update(payload).eq("id", existing[0].id);
      if (error) { console.error("[db-data] saveExperience UPSERT error:", error); throw new Error(`Save failed: ${error.message}`); }
      console.log("[db-data] saveExperience UPSERT success");
    } else {
      const { error } = await supabase.from("experience").insert(payload);
      if (error) { console.error("[db-data] saveExperience INSERT error:", error); throw new Error(`Save failed: ${error.message}`); }
      console.log("[db-data] saveExperience INSERT success");
    }
  }
}

export async function deleteExperience(id?: string, company?: string): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error("Supabase not configured. Check .env.local");
  console.log("[db-data] deleteExperience", { id, company });
  if (id) {
    const { error } = await supabase.from("experience").delete().eq("id", id);
    if (error) { console.error("[db-data] deleteExperience error:", error); throw new Error(`Delete failed: ${error.message}`); }
    console.log("[db-data] deleteExperience success");
  } else if (company) {
    const { error } = await supabase.from("experience").delete().eq("company", company);
    if (error) { console.error("[db-data] deleteExperience error:", error); throw new Error(`Delete failed: ${error.message}`); }
    console.log("[db-data] deleteExperience success");
  } else {
    throw new Error("Cannot delete: no id or company provided");
  }
}

export async function saveContactInfo(contact: Partial<ContactInfoItem>): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error("Supabase not configured. Check .env.local");
  const payload = {
    email: contact.email || "",
    phone: contact.phone || "",
    github: contact.github || "",
    linkedin: contact.linkedin || "",
    instagram: contact.instagram || "",
    viber: contact.viber || "",
  };
  console.log("[db-data] saveContactInfo", { id: contact.id, payload });

  if (contact.id) {
    const { error } = await supabase.from("contact_info").update(payload).eq("id", contact.id);
    if (error) { console.error("[db-data] saveContactInfo error:", error); throw new Error(`Save failed: ${error.message}`); }
    console.log("[db-data] saveContactInfo UPDATE success");
  } else {
    const { data: existing } = await supabase.from("contact_info").select("id").limit(1);
    if (existing && existing.length > 0) {
      const { error } = await supabase.from("contact_info").update(payload).eq("id", existing[0].id);
      if (error) { console.error("[db-data] saveContactInfo UPSERT error:", error); throw new Error(`Save failed: ${error.message}`); }
      console.log("[db-data] saveContactInfo UPSERT success");
    } else {
      const { error } = await supabase.from("contact_info").insert(payload);
      if (error) { console.error("[db-data] saveContactInfo INSERT error:", error); throw new Error(`Save failed: ${error.message}`); }
      console.log("[db-data] saveContactInfo INSERT success");
    }
  }
}

export async function fetchGalleryItems(): Promise<GalleryItem[]> {
  if (!isSupabaseConfigured()) return staticGalleryItems;
  try {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("order_index", { ascending: true });
    if (error || !data || data.length === 0) return staticGalleryItems;

    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description || "",
      image: item.image,
      date: item.date || "",
      order_index: item.order_index ?? 0,
    }));
  } catch (err) {
    console.warn("Supabase fetch gallery items failed, returning static fallback:", err);
    return staticGalleryItems;
  }
}

export async function saveGalleryItem(item: Partial<GalleryItem>): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error("Supabase not configured. Check .env.local");
  const payload = {
    title: item.title || "Gallery Photo",
    description: item.description || "",
    image: item.image || "/Images/IHI.png",
    date: item.date || "",
    order_index: item.order_index ?? 99,
  };
  console.log("[db-data] saveGalleryItem", { id: item.id, payload });

  if (item.id) {
    const { error } = await supabase.from("gallery").update(payload).eq("id", item.id);
    if (error) { console.error("[db-data] saveGalleryItem error:", error); throw new Error(`Save failed: ${error.message}`); }
    console.log("[db-data] saveGalleryItem UPDATE success");
  } else {
    const { data: existing } = await supabase.from("gallery").select("id").eq("title", payload.title).limit(1);
    if (existing && existing.length > 0) {
      const { error } = await supabase.from("gallery").update(payload).eq("id", existing[0].id);
      if (error) { console.error("[db-data] saveGalleryItem UPSERT error:", error); throw new Error(`Save failed: ${error.message}`); }
      console.log("[db-data] saveGalleryItem UPSERT success");
    } else {
      const { error } = await supabase.from("gallery").insert(payload);
      if (error) { console.error("[db-data] saveGalleryItem INSERT error:", error); throw new Error(`Save failed: ${error.message}`); }
      console.log("[db-data] saveGalleryItem INSERT success");
    }
  }
}

export async function deleteGalleryItem(id?: string, title?: string): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error("Supabase not configured. Check .env.local");
  console.log("[db-data] deleteGalleryItem", { id, title });
  if (id) {
    const { error } = await supabase.from("gallery").delete().eq("id", id);
    if (error) { console.error("[db-data] deleteGalleryItem error:", error); throw new Error(`Delete failed: ${error.message}`); }
    console.log("[db-data] deleteGalleryItem success");
  } else if (title) {
    const { error } = await supabase.from("gallery").delete().eq("title", title);
    if (error) { console.error("[db-data] deleteGalleryItem error:", error); throw new Error(`Delete failed: ${error.message}`); }
    console.log("[db-data] deleteGalleryItem success");
  } else {
    throw new Error("Cannot delete: no id or title provided");
  }
}
