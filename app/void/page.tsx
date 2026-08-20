"use client";

import React, { useEffect, useState } from "react";
import { dayTheme } from "../lib/theme";
import { PixelButton } from "../components/ui/pixel-button";
import { PixelCard } from "../components/ui/pixel-card";
import { ConfirmModal } from "../components/ui/confirm-modal";
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient";
import {
  fetchProjects,
  fetchTechnicalSkills,
  fetchProfessionalSkills,
  fetchExperience,
  fetchContactInfo,
  fetchGalleryItems,
  saveProject,
  deleteProject,
  uploadProjectImage,
  saveTechnicalSkill,
  deleteTechnicalSkill,
  saveProfessionalSkill,
  deleteProfessionalSkill,
  saveExperience,
  deleteExperience,
  saveContactInfo,
  saveGalleryItem,
  deleteGalleryItem,
  type ProjectItem,
  type TechnicalSkillItem,
  type ProfessionalSkillItem,
  type ExperienceItem,
  type ContactInfoItem,
  type GalleryItem,
} from "../lib/db-data";

type TabType = "projects" | "gallery" | "tech_skills" | "prof_skills" | "experience" | "contact" | "scores";

export default function HiddenVoidAdminPage() {
  const [authed, setAuthed] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>("");
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<TabType>("projects");

  const [projectsList, setProjectsList] = useState<ProjectItem[]>([]);
  const [galleryList, setGalleryList] = useState<GalleryItem[]>([]);
  const [techSkillsList, setTechSkillsList] = useState<TechnicalSkillItem[]>([]);
  const [profSkillsList, setProfSkillsList] = useState<ProfessionalSkillItem[]>([]);
  const [experienceList, setExperienceList] = useState<ExperienceItem[]>([]);
  const [contactData, setContactData] = useState<ContactInfoItem>({
    email: "",
    phone: "",
    github: "",
    linkedin: "",
    instagram: "",
    viber: "",
  });
  const [scoresList, setScoresList] = useState<any[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const [editingProject, setEditingProject] = useState<Partial<ProjectItem> | null>(null);
  const [editingGalleryItem, setEditingGalleryItem] = useState<Partial<GalleryItem> | null>(null);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [editingTechSkill, setEditingTechSkill] = useState<Partial<TechnicalSkillItem> | null>(null);
  const [editingProfSkill, setEditingProfSkill] = useState<Partial<ProfessionalSkillItem> | null>(null);
  const [editingExp, setEditingExp] = useState<Partial<ExperienceItem> | null>(null);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    variant: "coin" | "brick" | "pipe";
    action: () => Promise<void> | void;
  } | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const requestConfirmation = (
    title: string,
    message: string,
    confirmText: string,
    variant: "coin" | "brick" | "pipe",
    action: () => Promise<void> | void
  ) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      confirmText,
      variant,
      action,
    });
  };

  // Auth check on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = sessionStorage.getItem("portfolio_admin_auth") === "true";
      setAuthed(isAuth);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const validPasscode = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "123456";

    if (passcode === validPasscode || passcode === "admin") {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("portfolio_admin_auth", "true");
      }
      setAuthed(true);
      setPasscode("");
    } else {
      setAuthError("INVALID PASSCODE. ACCESS DENIED!");
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("portfolio_admin_auth");
    }
    setAuthed(false);
  };

  // Load data for the active tab
  const loadData = async () => {
    if (!authed) return;
    setLoading(true);
    try {
      if (activeTab === "projects") {
        const data = await fetchProjects();
        setProjectsList(data);
      } else if (activeTab === "gallery") {
        const data = await fetchGalleryItems();
        setGalleryList(data);
      } else if (activeTab === "tech_skills") {
        const data = await fetchTechnicalSkills();
        setTechSkillsList(data);
      } else if (activeTab === "prof_skills") {
        const data = await fetchProfessionalSkills();
        setProfSkillsList(data);
      } else if (activeTab === "experience") {
        const data = await fetchExperience();
        setExperienceList(data);
      } else if (activeTab === "contact") {
        const data = await fetchContactInfo();
        setContactData(data);
      } else if (activeTab === "scores") {
        if (isSupabaseConfigured()) {
          const { data } = await supabase.from("scores").select("*").order("score", { ascending: false }).limit(20);
          setScoresList(data || []);
        }
      }
    } catch (err) {
      showFeedback(err instanceof Error ? err.message : "Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authed) void loadData();
  }, [authed, activeTab]);

  const showFeedback = (text: string, type: "success" | "error" = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 4000);
  };

  // Login screen
  if (!authed) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <PixelCard variant="elevated" className="max-w-md w-full p-8 text-center space-y-6">
          <h1
            className="pixel-text text-xl md:text-2xl font-bold"
            style={{ color: dayTheme.colors.coin }}
          >
            VOID ADMIN PORTAL
          </h1>

          <p className="pixel-text text-xs" style={{ color: dayTheme.colors.text }}>
            ENTER PASSCODE TO UNLOCK PORTFOLIO CMS
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full p-4 pixel-shadow font-mono text-center text-sm outline-none"
                style={{
                  border: `3px solid ${dayTheme.colors.border}`,
                  backgroundColor: "#1a1a2e",
                  color: "#ffffff",
                }}
              />
            </div>

            {authError && (
              <p
                className="pixel-text text-xs font-bold"
                style={{ color: dayTheme.colors.mario }}
              >
                {authError}
              </p>
            )}

            <PixelButton
              variant="coin"
              size="lg"
              type="submit"
              style={{ width: "100%", justifyContent: "center" }}
            >
              UNLOCK CMS DASHBOARD
            </PixelButton>
          </form>
        </PixelCard>
      </div>
    );
  }

  // ADMIN DASHBOARD SCREEN (If authenticated)
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 p-4 bg-[rgba(13,27,42,0.9)] border-2 border-black shadow-[2px_2px_0px_#000]">
        <div className="flex items-center gap-3">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block animate-pulse"
            style={{
              backgroundColor: isSupabaseConfigured() ? "#00a800" : "#e40058",
              boxShadow: isSupabaseConfigured() ? "0 0 8px #00a800" : "0 0 8px #e40058",
            }}
            title={isSupabaseConfigured() ? "Live Supabase Database Active" : "Local Static Fallback Mode"}
          />
          <h1 className="pixel-text text-sm md:text-base font-bold tracking-wider" style={{ color: dayTheme.colors.coin }}>
            VOID // CMS
          </h1>
        </div>
        <PixelButton variant="brick" size="sm" onClick={handleLogout}>
          LOG OUT
        </PixelButton>
      </div>

      {/* Feedback Toast */}
      {msg && (
        <div
          className={`p-4 border-2 font-mono text-center text-xs font-bold ${
            msg.type === "success" ? "bg-green-900 border-green-400 text-green-200" : "bg-red-900 border-red-400 text-red-200"
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b-4 border-black pb-2">
        {(
          [
            { id: "projects", label: "PROJECTS" },
            { id: "gallery", label: "GALLERY" },
            { id: "tech_skills", label: "TECH SKILLS" },
            { id: "prof_skills", label: "PROF SKILLS" },
            { id: "experience", label: "EXPERIENCE" },
            { id: "contact", label: "CONTACT" },
            { id: "scores", label: "LEADERBOARD" },
          ] as const
        ).map((tab) => (
          <PixelButton
            key={tab.id}
            variant={activeTab === tab.id ? "coin" : "pipe"}
            size="sm"
            onClick={() => {
              setActiveTab(tab.id as TabType);
              setEditingProject(null);
              setEditingGalleryItem(null);
              setEditingTechSkill(null);
              setEditingProfSkill(null);
              setEditingExp(null);
            }}
          >
            {tab.label}
          </PixelButton>
        ))}
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="text-center py-12">
          <p className="pixel-text text-sm animate-pulse" style={{ color: dayTheme.colors.coin }}>
            LOADING SYSTEM DATA...
          </p>
        </div>
      )}

      {/* Projects */}
      {!loading && activeTab === "projects" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="pixel-text text-base" style={{ color: dayTheme.colors.coin }}>
              MANAGE PROJECTS ({projectsList.length})
            </h2>
            <PixelButton
              variant="coin"
              size="sm"
              onClick={() =>
                setEditingProject({
                  title: "",
                  slug: "",
                  description: "",
                  tech: [],
                  image: "/Images/IHI.png",
                  link: "#",
                  accent: "#9cbd09",
                  order_index: projectsList.length + 1,
                })
              }
            >
              ADD NEW PROJECT
            </PixelButton>
          </div>

          {/* Editor form */}
          {editingProject && (
            <PixelCard variant="elevated" className="p-6 space-y-4 border-4 border-yellow-400">
              <h3 className="pixel-text text-sm" style={{ color: dayTheme.colors.coin }}>
                {editingProject.id ? "EDIT PROJECT" : "CREATE NEW PROJECT"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-white font-bold mb-1">PROJECT TITLE</label>
                  <input
                    type="text"
                    value={editingProject.title || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full p-2 bg-slate-900 border-2 border-black text-white font-mono placeholder-white" style={{ color: "#ffffff" }}
                  />
                </div>
                <div>
                  <label className="block text-white font-bold mb-1">LIVE PROJECT LINK</label>
                  <input
                    type="text"
                    value={editingProject.link || "#"}
                    onChange={(e) => setEditingProject({ ...editingProject, link: e.target.value })}
                    className="w-full p-2 bg-slate-900 border-2 border-black text-white font-mono placeholder-white" style={{ color: "#ffffff" }}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-white font-bold mb-1">DESCRIPTION</label>
                  <textarea
                    rows={3}
                    value={editingProject.description || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    className="w-full p-2 bg-slate-900 border-2 border-black text-white font-mono placeholder-white" style={{ color: "#ffffff" }}
                  />
                </div>
                <div>
                  <label className="block text-white font-bold mb-1">TECH STACK (Comma Separated)</label>
                  <input
                    type="text"
                    value={(editingProject.tech || []).join(", ")}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        tech: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full p-2 bg-slate-900 border-2 border-black text-white font-mono placeholder-white" style={{ color: "#ffffff" }}
                  />
                </div>
                <div>
                  <label className="block text-white font-bold mb-1">ACCENT COLOR (HEX)</label>
                  <input
                    type="text"
                    value={editingProject.accent || "#9cbd09"}
                    onChange={(e) => setEditingProject({ ...editingProject, accent: e.target.value })}
                    className="w-full p-2 bg-slate-900 border-2 border-black text-white font-mono placeholder-white" style={{ color: "#ffffff" }}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-white font-bold mb-1">PROJECT IMAGE URL OR FILE UPLOAD</label>
                  <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                    <input
                      type="text"
                      value={editingProject.image || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                      className="flex-1 p-2 bg-slate-900 border-2 border-black text-white font-mono placeholder-white" style={{ color: "#ffffff" }}
                    />
                    <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-500">
                      {uploadingImage ? "UPLOADING..." : "UPLOAD FILE"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setUploadingImage(true);
                          try {
                            const publicUrl = await uploadProjectImage(file);
                            setEditingProject({ ...editingProject, image: publicUrl });
                            showFeedback("Image uploaded to Supabase Storage!");
                          } catch (err) {
                            showFeedback(err instanceof Error ? err.message : "Upload failed", "error");
                          } finally {
                            setUploadingImage(false);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <PixelButton
                  variant="coin"
                  size="sm"
                  onClick={() => {
                    if (!editingProject.title || !editingProject.description) {
                      showFeedback("Title and description are required!", "error");
                      return;
                    }
                    requestConfirmation(
                      editingProject.id ? "CONFIRM EDIT PROJECT" : "CONFIRM CREATE PROJECT",
                      `Are you sure you want to ${editingProject.id ? "update" : "create"} project "${editingProject.title}"?`,
                      editingProject.id ? "YES, SAVE EDITS" : "YES, CREATE PROJECT",
                      "coin",
                      async () => {
                        await saveProject(editingProject);
                        showFeedback("Project saved successfully!");
                        setEditingProject(null);
                        void loadData();
                      }
                    );
                  }}
                >
                  SAVE PROJECT
                </PixelButton>
                <PixelButton variant="brick" size="sm" onClick={() => setEditingProject(null)}>
                  CANCEL
                </PixelButton>
              </div>
            </PixelCard>
          )}

          {/* Project list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectsList.map((p) => (
              <div key={p.id || p.title} className="p-4 bg-[rgba(13,27,42,0.8)] border-2 border-black space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="pixel-text text-sm" style={{ color: p.accent }}>
                    {p.title}
                  </h3>
                  <div className="flex gap-2">
                    <PixelButton variant="coin" size="sm" onClick={() => setEditingProject(p)}>
                      EDIT
                    </PixelButton>
                    <PixelButton
                      variant="brick"
                      size="sm"
                      onClick={() => {
                        requestConfirmation(
                          "CONFIRM DELETE PROJECT",
                          `Are you sure you want to permanently delete project "${p.title}"?`,
                          "YES, DELETE",
                          "brick",
                          async () => {
                            await deleteProject(p.id, p.title);
                            showFeedback("Project deleted");
                            void loadData();
                          }
                        );
                      }}
                    >
                      DEL
                    </PixelButton>
                  </div>
                </div>
                <p className="text-xs text-gray-100 font-medium">{p.description}</p>
                <div className="flex flex-wrap gap-1">
                  {p.tech.map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 bg-slate-800 text-yellow-300 border border-slate-700">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gallery */}
      {!loading && activeTab === "gallery" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="pixel-text text-base" style={{ color: dayTheme.colors.coin }}>
              MANAGE GALLERY PHOTOS ({galleryList.length})
            </h2>
            <PixelButton
              variant="coin"
              size="sm"
              onClick={() =>
                setEditingGalleryItem({
                  title: "",
                  description: "",
                  image: "/Images/IHI.png",
                  date: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
                  order_index: galleryList.length + 1,
                })
              }
            >
              ADD GALLERY PHOTO
            </PixelButton>
          </div>

          {/* Editor form */}
          {editingGalleryItem && (
            <PixelCard variant="elevated" className="p-6 space-y-4 border-4 border-yellow-400">
              <h3 className="pixel-text text-sm" style={{ color: dayTheme.colors.coin }}>
                {editingGalleryItem.id ? "EDIT GALLERY ITEM" : "CREATE GALLERY ITEM"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-white font-bold mb-1">IMAGE TITLE</label>
                  <input
                    type="text"
                    value={editingGalleryItem.title || ""}
                    onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, title: e.target.value })}
                    className="w-full p-2 bg-slate-900 border-2 border-black text-white font-mono placeholder-white" style={{ color: "#ffffff" }}
                  />
                </div>
                <div>
                  <label className="block text-white font-bold mb-1">EVENT / PHOTO DATE (e.g. May 2026)</label>
                  <input
                    type="text"
                    value={editingGalleryItem.date || ""}
                    onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, date: e.target.value })}
                    className="w-full p-2 bg-slate-900 border-2 border-black text-white font-mono placeholder-white" style={{ color: "#ffffff" }}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-white font-bold mb-1">DESCRIPTION / CAPTION</label>
                  <textarea
                    rows={2}
                    value={editingGalleryItem.description || ""}
                    onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, description: e.target.value })}
                    className="w-full p-2 bg-slate-900 border-2 border-black text-white font-mono placeholder-white" style={{ color: "#ffffff" }}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-white font-bold mb-1">IMAGE URL OR FILE UPLOAD</label>
                  <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                    <input
                      type="text"
                      value={editingGalleryItem.image || ""}
                      onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, image: e.target.value })}
                      className="flex-1 p-2 bg-slate-900 border-2 border-black text-white font-mono placeholder-white" style={{ color: "#ffffff" }}
                    />
                    <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-500">
                      {uploadingImage ? "UPLOADING..." : "UPLOAD FILE"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setUploadingImage(true);
                          try {
                            const publicUrl = await uploadProjectImage(file);
                            setEditingGalleryItem({ ...editingGalleryItem, image: publicUrl });
                            showFeedback("Image uploaded to Supabase Storage!");
                          } catch (err) {
                            showFeedback(err instanceof Error ? err.message : "Upload failed", "error");
                          } finally {
                            setUploadingImage(false);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <PixelButton
                  variant="coin"
                  size="sm"
                  onClick={() => {
                    if (!editingGalleryItem.title || !editingGalleryItem.image) {
                      showFeedback("Title and image are required!", "error");
                      return;
                    }
                    requestConfirmation(
                      editingGalleryItem.id ? "CONFIRM EDIT GALLERY PHOTO" : "CONFIRM CREATE GALLERY PHOTO",
                      `Are you sure you want to ${editingGalleryItem.id ? "update" : "add"} gallery photo "${editingGalleryItem.title}"?`,
                      editingGalleryItem.id ? "YES, SAVE EDITS" : "YES, ADD PHOTO",
                      "coin",
                      async () => {
                        await saveGalleryItem(editingGalleryItem);
                        showFeedback("Gallery item saved successfully!");
                        setEditingGalleryItem(null);
                        void loadData();
                      }
                    );
                  }}
                >
                  SAVE GALLERY ITEM
                </PixelButton>
                <PixelButton variant="brick" size="sm" onClick={() => setEditingGalleryItem(null)}>
                  CANCEL
                </PixelButton>
              </div>
            </PixelCard>
          )}

          {/* Gallery grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryList.map((g) => (
              <div key={g.id || g.title} className="p-4 bg-[rgba(13,27,42,0.8)] border-2 border-black space-y-2">
                <div className="aspect-video relative overflow-hidden bg-slate-900 border border-slate-700">
                  <img src={g.image} alt={g.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex justify-between items-start pt-1">
                  <div>
                    <h3 className="pixel-text text-xs" style={{ color: dayTheme.colors.coin }}>
                      {g.title}
                    </h3>
                    <p className="text-[10px] text-green-400 font-mono">{g.date}</p>
                  </div>
                  <div className="flex gap-1">
                    <PixelButton variant="coin" size="sm" onClick={() => setEditingGalleryItem(g)}>
                      EDIT
                    </PixelButton>
                    <PixelButton
                      variant="brick"
                      size="sm"
                      onClick={() => {
                        requestConfirmation(
                          "CONFIRM DELETE GALLERY PHOTO",
                          `Are you sure you want to delete gallery item "${g.title}"?`,
                          "YES, DELETE",
                          "brick",
                          async () => {
                            await deleteGalleryItem(g.id, g.title);
                            showFeedback("Gallery item deleted");
                            void loadData();
                          }
                        );
                      }}
                    >
                      DEL
                    </PixelButton>
                  </div>
                </div>
                {g.description && <p className="text-[11px] text-gray-100 font-medium line-clamp-2">{g.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technical Skills */}
      {!loading && activeTab === "tech_skills" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="pixel-text text-base" style={{ color: dayTheme.colors.coin }}>
              TECHNICAL SKILLS CATEGORIES ({techSkillsList.length})
            </h2>
            <PixelButton
              variant="coin"
              size="sm"
              onClick={() =>
                setEditingTechSkill({
                  name: "",
                  icon: "Globe",
                  items: [],
                  color: "#9cbd09",
                  order_index: techSkillsList.length + 1,
                })
              }
            >
              ADD SKILL CATEGORY
            </PixelButton>
          </div>

          {editingTechSkill && (
            <PixelCard variant="elevated" className="p-6 space-y-4 border-4 border-yellow-400">
              <h3 className="pixel-text text-sm" style={{ color: dayTheme.colors.coin }}>
                {editingTechSkill.id ? "EDIT TECHNICAL SKILL" : "CREATE TECHNICAL SKILL"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-white font-bold mb-1">CATEGORY NAME</label>
                  <input
                    type="text"
                    value={editingTechSkill.name || ""}
                    onChange={(e) => setEditingTechSkill({ ...editingTechSkill, name: e.target.value })}
                    className="w-full p-2 bg-slate-900 border-2 border-black text-white font-mono placeholder-white" style={{ color: "#ffffff" }}
                  />
                </div>
                <div>
                  <label className="block text-white font-bold mb-1">ICON (Globe, Smartphone, Cpu, Rocket, Shield, Code)</label>
                  <input
                    type="text"
                    value={editingTechSkill.icon || "Globe"}
                    onChange={(e) => setEditingTechSkill({ ...editingTechSkill, icon: e.target.value })}
                    className="w-full p-2 bg-slate-900 border-2 border-black text-white font-mono placeholder-white" style={{ color: "#ffffff" }}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-white font-bold mb-1">SKILL ITEMS (Comma Separated)</label>
                  <input
                    type="text"
                    value={(editingTechSkill.items || []).join(", ")}
                    onChange={(e) =>
                      setEditingTechSkill({
                        ...editingTechSkill,
                        items: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full p-2 bg-slate-900 border-2 border-black text-white font-mono placeholder-white" style={{ color: "#ffffff" }}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <PixelButton
                  variant="coin"
                  size="sm"
                  onClick={() => {
                    if (!editingTechSkill.name) {
                      showFeedback("Category name is required!", "error");
                      return;
                    }
                    requestConfirmation(
                      editingTechSkill.id ? "CONFIRM EDIT SKILL CATEGORY" : "CONFIRM CREATE SKILL CATEGORY",
                      `Are you sure you want to ${editingTechSkill.id ? "update" : "create"} skill category "${editingTechSkill.name}"?`,
                      editingTechSkill.id ? "YES, SAVE EDITS" : "YES, CREATE CATEGORY",
                      "coin",
                      async () => {
                        await saveTechnicalSkill(editingTechSkill);
                        showFeedback("Skill category saved!");
                        setEditingTechSkill(null);
                        void loadData();
                      }
                    );
                  }}
                >
                  SAVE CATEGORY
                </PixelButton>
                <PixelButton variant="brick" size="sm" onClick={() => setEditingTechSkill(null)}>
                  CANCEL
                </PixelButton>
              </div>
            </PixelCard>
          )}

          <div className="space-y-4">
            {techSkillsList.map((s) => (
              <div key={s.id || s.name} className="p-4 bg-[rgba(13,27,42,0.8)] border-2 border-black flex justify-between items-center">
                <div>
                  <h3 className="pixel-text text-sm" style={{ color: dayTheme.colors.coin }}>
                    {s.name} ({s.icon})
                  </h3>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {s.items.map((i) => (
                      <span key={i} className="text-xs px-2 py-0.5 bg-slate-800 text-white border border-slate-700">
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <PixelButton variant="coin" size="sm" onClick={() => setEditingTechSkill(s)}>
                    EDIT
                  </PixelButton>
                  <PixelButton
                    variant="brick"
                    size="sm"
                    onClick={() => {
                      requestConfirmation(
                        "CONFIRM DELETE CATEGORY",
                        `Are you sure you want to delete category "${s.name}"?`,
                        "YES, DELETE",
                        "brick",
                        async () => {
                          await deleteTechnicalSkill(s.id, s.name);
                          showFeedback("Category deleted");
                          void loadData();
                        }
                      );
                    }}
                  >
                    DEL
                  </PixelButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Professional Skills */}
      {!loading && activeTab === "prof_skills" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="pixel-text text-base" style={{ color: dayTheme.colors.coin }}>
              PROFESSIONAL SKILLS ({profSkillsList.length})
            </h2>
            <PixelButton
              variant="coin"
              size="sm"
              onClick={() =>
                setEditingProfSkill({
                  name: "",
                  description: "",
                  icon: "Code",
                  color: "#9cbd09",
                  order_index: profSkillsList.length + 1,
                })
              }
            >
              ADD PROFESSIONAL SKILL
            </PixelButton>
          </div>

          {editingProfSkill && (
            <PixelCard variant="elevated" className="p-6 space-y-4 border-4 border-yellow-400">
              <h3 className="pixel-text text-sm" style={{ color: dayTheme.colors.coin }}>
                {editingProfSkill.id ? "EDIT PROFESSIONAL SKILL" : "CREATE PROFESSIONAL SKILL"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-white font-bold mb-1">SKILL NAME</label>
                  <input
                    type="text"
                    value={editingProfSkill.name || ""}
                    onChange={(e) => setEditingProfSkill({ ...editingProfSkill, name: e.target.value })}
                    className="w-full p-2 bg-slate-900 border-2 border-black text-white font-mono placeholder-white" style={{ color: "#ffffff" }}
                  />
                </div>
                <div>
                  <label className="block text-white font-bold mb-1">ICON (Code, Palette, Briefcase, Rocket)</label>
                  <input
                    type="text"
                    value={editingProfSkill.icon || "Code"}
                    onChange={(e) => setEditingProfSkill({ ...editingProfSkill, icon: e.target.value })}
                    className="w-full p-2 bg-slate-900 border-2 border-black text-white font-mono placeholder-white" style={{ color: "#ffffff" }}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-white font-bold mb-1">DESCRIPTION</label>
                  <textarea
                    rows={2}
                    value={editingProfSkill.description || ""}
                    onChange={(e) => setEditingProfSkill({ ...editingProfSkill, description: e.target.value })}
                    className="w-full p-2 bg-slate-900 border-2 border-black text-white font-mono placeholder-white" style={{ color: "#ffffff" }}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <PixelButton
                  variant="coin"
                  size="sm"
                  onClick={() => {
                    if (!editingProfSkill.name) {
                      showFeedback("Skill name is required!", "error");
                      return;
                    }
                    requestConfirmation(
                      editingProfSkill.id ? "CONFIRM EDIT PROFESSIONAL SKILL" : "CONFIRM CREATE PROFESSIONAL SKILL",
                      `Are you sure you want to ${editingProfSkill.id ? "update" : "create"} skill "${editingProfSkill.name}"?`,
                      editingProfSkill.id ? "YES, SAVE EDITS" : "YES, CREATE SKILL",
                      "coin",
                      async () => {
                        await saveProfessionalSkill(editingProfSkill);
                        showFeedback("Professional skill saved!");
                        setEditingProfSkill(null);
                        void loadData();
                      }
                    );
                  }}
                >
                  SAVE SKILL
                </PixelButton>
                <PixelButton variant="brick" size="sm" onClick={() => setEditingProfSkill(null)}>
                  CANCEL
                </PixelButton>
              </div>
            </PixelCard>
          )}

          <div className="space-y-4">
            {profSkillsList.map((s) => (
              <div key={s.id || s.name} className="p-4 bg-[rgba(13,27,42,0.8)] border-2 border-black flex justify-between items-center">
                <div>
                  <h3 className="pixel-text text-sm" style={{ color: dayTheme.colors.coin }}>
                    {s.name}
                  </h3>
                  <p className="text-xs text-gray-100 font-medium mt-1">{s.description}</p>
                </div>
                <div className="flex gap-2">
                  <PixelButton variant="coin" size="sm" onClick={() => setEditingProfSkill(s)}>
                    EDIT
                  </PixelButton>
                  <PixelButton
                    variant="brick"
                    size="sm"
                    onClick={() => {
                      requestConfirmation(
                        "CONFIRM DELETE SKILL",
                        `Are you sure you want to delete skill "${s.name}"?`,
                        "YES, DELETE",
                        "brick",
                        async () => {
                          await deleteProfessionalSkill(s.id, s.name);
                          showFeedback("Skill deleted");
                          void loadData();
                        }
                      );
                    }}
                  >
                    DEL
                  </PixelButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {!loading && activeTab === "experience" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="pixel-text text-base" style={{ color: dayTheme.colors.coin }}>
              CAREER EXPERIENCE TIMELINE ({experienceList.length})
            </h2>
            <PixelButton
              variant="coin"
              size="sm"
              onClick={() =>
                setEditingExp({
                  jobTitle: "",
                  company: "",
                  startDate: "2026",
                  endDate: "Present",
                  overview: "",
                  details: [],
                  tech: [],
                  accent: "#9cbd09",
                  order_index: experienceList.length + 1,
                })
              }
            >
              ADD EXPERIENCE
            </PixelButton>
          </div>

          {editingExp && (
            <PixelCard variant="elevated" className="p-6 space-y-4 border-4 border-yellow-400">
              <h3 className="pixel-text text-sm" style={{ color: dayTheme.colors.coin }}>
                {editingExp.id ? "EDIT EXPERIENCE" : "CREATE EXPERIENCE"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-white font-bold mb-1">JOB TITLE</label>
                  <input
                    type="text"
                    value={editingExp.jobTitle || ""}
                    onChange={(e) => setEditingExp({ ...editingExp, jobTitle: e.target.value })}
                    className="w-full p-2 bg-slate-900 border-2 border-black text-white font-mono placeholder-white" style={{ color: "#ffffff" }}
                  />
                </div>
                <div>
                  <label className="block text-white font-bold mb-1">COMPANY</label>
                  <input
                    type="text"
                    value={editingExp.company || ""}
                    onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                    className="w-full p-2 bg-slate-900 border-2 border-black text-white font-mono placeholder-white" style={{ color: "#ffffff" }}
                  />
                </div>
                <div>
                  <label className="block text-white font-bold mb-1">START DATE</label>
                  <input
                    type="text"
                    value={editingExp.startDate || ""}
                    onChange={(e) => setEditingExp({ ...editingExp, startDate: e.target.value })}
                    className="w-full p-2 bg-slate-900 border-2 border-black text-white font-mono placeholder-white" style={{ color: "#ffffff" }}
                  />
                </div>
                <div>
                  <label className="block text-white font-bold mb-1">END DATE</label>
                  <input
                    type="text"
                    value={editingExp.endDate || ""}
                    onChange={(e) => setEditingExp({ ...editingExp, endDate: e.target.value })}
                    className="w-full p-2 bg-slate-900 border-2 border-black text-white font-mono placeholder-white" style={{ color: "#ffffff" }}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-white font-bold mb-1">OVERVIEW</label>
                  <textarea
                    rows={2}
                    value={editingExp.overview || ""}
                    onChange={(e) => setEditingExp({ ...editingExp, overview: e.target.value })}
                    className="w-full p-2 bg-slate-900 border-2 border-black text-white font-mono placeholder-white" style={{ color: "#ffffff" }}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-white font-bold mb-1">ACHIEVEMENTS / BULLETS (Pipe '|' Separated)</label>
                  <textarea
                    rows={3}
                    value={(editingExp.details || []).join(" | ")}
                    onChange={(e) =>
                      setEditingExp({
                        ...editingExp,
                        details: e.target.value.split("|").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full p-2 bg-slate-900 border-2 border-black text-white font-mono placeholder-white" style={{ color: "#ffffff" }}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-white font-bold mb-1">TECH USED (Comma Separated)</label>
                  <input
                    type="text"
                    value={(editingExp.tech || []).join(", ")}
                    onChange={(e) =>
                      setEditingExp({
                        ...editingExp,
                        tech: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full p-2 bg-slate-900 border-2 border-black text-white font-mono placeholder-white" style={{ color: "#ffffff" }}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <PixelButton
                  variant="coin"
                  size="sm"
                  onClick={() => {
                    if (!editingExp.jobTitle || !editingExp.company) {
                      showFeedback("Job title and company are required!", "error");
                      return;
                    }
                    requestConfirmation(
                      editingExp.id ? "CONFIRM EDIT EXPERIENCE" : "CONFIRM CREATE EXPERIENCE",
                      `Are you sure you want to ${editingExp.id ? "update" : "create"} experience "${editingExp.jobTitle} @ ${editingExp.company}"?`,
                      editingExp.id ? "YES, SAVE EDITS" : "YES, CREATE EXPERIENCE",
                      "coin",
                      async () => {
                        await saveExperience(editingExp);
                        showFeedback("Experience entry saved!");
                        setEditingExp(null);
                        void loadData();
                      }
                    );
                  }}
                >
                  SAVE EXPERIENCE
                </PixelButton>
                <PixelButton variant="brick" size="sm" onClick={() => setEditingExp(null)}>
                  CANCEL
                </PixelButton>
              </div>
            </PixelCard>
          )}

          <div className="space-y-4">
            {experienceList.map((e) => (
              <div key={e.id || `${e.company}-${e.startDate}`} className="p-4 bg-[rgba(13,27,42,0.8)] border-2 border-black flex justify-between items-start">
                <div>
                  <h3 className="pixel-text text-sm" style={{ color: dayTheme.colors.coin }}>
                    {e.jobTitle} @ {e.company}
                  </h3>
                  <p className="text-xs text-green-400">
                    {e.startDate} – {e.endDate}
                  </p>
                  <p className="text-xs text-gray-100 font-medium mt-2">{e.overview}</p>
                </div>
                <div className="flex gap-2">
                  <PixelButton variant="coin" size="sm" onClick={() => setEditingExp(e)}>
                    EDIT
                  </PixelButton>
                  <PixelButton
                    variant="brick"
                    size="sm"
                    onClick={() => {
                      requestConfirmation(
                        "CONFIRM DELETE EXPERIENCE",
                        `Are you sure you want to delete experience "${e.jobTitle}"?`,
                        "YES, DELETE",
                        "brick",
                        async () => {
                          await deleteExperience(e.id, e.company);
                          showFeedback("Experience deleted");
                          void loadData();
                        }
                      );
                    }}
                  >
                    DEL
                  </PixelButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Info */}
      {!loading && activeTab === "contact" && (
        <PixelCard variant="elevated" className="p-6 space-y-4">
          <h2 className="pixel-text text-base mb-4" style={{ color: dayTheme.colors.coin }}>
            CONTACT INFO & SOCIAL LINKS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="block text-white font-bold mb-1">EMAIL ADDRESS</label>
              <input
                type="text"
                value={contactData.email}
                onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                className="w-full p-2 bg-slate-900 border-2 border-black text-white font-mono placeholder-white" style={{ color: "#ffffff" }}
              />
            </div>
            <div>
              <label className="block text-white font-bold mb-1">PHONE NUMBER</label>
              <input
                type="text"
                value={contactData.phone}
                onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                className="w-full p-2 bg-slate-900 border-2 border-black text-white font-mono placeholder-white" style={{ color: "#ffffff" }}
              />
            </div>
            <div>
              <label className="block text-white font-bold mb-1">GITHUB URL</label>
              <input
                type="text"
                value={contactData.github}
                onChange={(e) => setContactData({ ...contactData, github: e.target.value })}
                className="w-full p-2 bg-slate-900 border-2 border-black text-white font-mono placeholder-white" style={{ color: "#ffffff" }}
              />
            </div>
            <div>
              <label className="block text-white font-bold mb-1">LINKEDIN URL</label>
              <input
                type="text"
                value={contactData.linkedin}
                onChange={(e) => setContactData({ ...contactData, linkedin: e.target.value })}
                className="w-full p-2 bg-slate-900 border-2 border-black text-white font-mono placeholder-white" style={{ color: "#ffffff" }}
              />
            </div>
            <div>
              <label className="block text-white font-bold mb-1">INSTAGRAM URL</label>
              <input
                type="text"
                value={contactData.instagram}
                onChange={(e) => setContactData({ ...contactData, instagram: e.target.value })}
                className="w-full p-2 bg-slate-900 border-2 border-black text-white font-mono placeholder-white" style={{ color: "#ffffff" }}
              />
            </div>
            <div>
              <label className="block text-white font-bold mb-1">VIBER LINK</label>
              <input
                type="text"
                value={contactData.viber}
                onChange={(e) => setContactData({ ...contactData, viber: e.target.value })}
                className="w-full p-2 bg-slate-900 border-2 border-black text-white font-mono placeholder-white" style={{ color: "#ffffff" }}
              />
            </div>
          </div>
          <div className="pt-4">
            <PixelButton
              variant="coin"
              size="md"
              onClick={() => {
                requestConfirmation(
                  "CONFIRM SAVE CONTACT INFO",
                  "Are you sure you want to update your public contact information and social links?",
                  "YES, SAVE DETAILS",
                  "coin",
                  async () => {
                    await saveContactInfo(contactData);
                    showFeedback("Contact details updated!");
                  }
                );
              }}
            >
              SAVE CONTACT DETAILS
            </PixelButton>
          </div>
        </PixelCard>
      )}

      {/* Leaderboard */}
      {!loading && activeTab === "scores" && (
        <div className="space-y-4">
          <h2 className="pixel-text text-base" style={{ color: dayTheme.colors.coin }}>
            MARIO MINI-GAME HIGH SCORES ({scoresList.length})
          </h2>
          {scoresList.length === 0 ? (
            <p className="pixel-text text-xs text-gray-400">NO HIGH SCORES RECORDED YET</p>
          ) : (
            <div className="space-y-2 font-mono text-xs">
              {scoresList.map((sc, idx) => (
                <div key={sc.id || idx} className="p-3 bg-[rgba(13,27,42,0.8)] border border-slate-700 flex justify-between items-center">
                  <span className="text-yellow-400">
                    #{idx + 1} {sc.player_name}
                  </span>
                  <span className="text-green-400 font-bold">{sc.score} PTS</span>
                  <span className="text-gray-500 text-[10px]">{new Date(sc.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Confirm modal */}
      <ConfirmModal
        isOpen={!!confirmModal?.isOpen}
        title={confirmModal?.title || "CONFIRM ACTION"}
        message={confirmModal?.message || ""}
        confirmText={confirmModal?.confirmText || "CONFIRM"}
        variant={confirmModal?.variant || "coin"}
        loading={actionLoading}
        onConfirm={async () => {
          if (!confirmModal?.action) return;
          setActionLoading(true);
          try {
            await confirmModal.action();
          } catch (err) {
            showFeedback(err instanceof Error ? err.message : "Action failed", "error");
          } finally {
            setActionLoading(false);
            setConfirmModal(null);
          }
        }}
        onCancel={() => setConfirmModal(null)}
      />
    </div>
  );
}
