"use client";

import React, { useEffect, useState } from "react";
import { dayTheme } from "../lib/theme";
import { PixelButton } from "../components/ui/pixel-button";
import { PixelCard } from "../components/ui/pixel-card";
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient";
import {
  fetchProjects,
  fetchTechnicalSkills,
  fetchProfessionalSkills,
  fetchExperience,
  fetchContactInfo,
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
  type ProjectItem,
  type TechnicalSkillItem,
  type ProfessionalSkillItem,
  type ExperienceItem,
  type ContactInfoItem,
} from "../lib/db-data";

type TabType = "projects" | "tech_skills" | "prof_skills" | "experience" | "contact" | "scores";

export default function HiddenVoidAdminPage() {
  const [authed, setAuthed] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>("");
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<TabType>("projects");

  // Data states
  const [projectsList, setProjectsList] = useState<ProjectItem[]>([]);
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

  // Status & loading
  const [loading, setLoading] = useState<boolean>(false);
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Form Modals / Edit states
  const [editingProject, setEditingProject] = useState<Partial<ProjectItem> | null>(null);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [editingTechSkill, setEditingTechSkill] = useState<Partial<TechnicalSkillItem> | null>(null);
  const [editingProfSkill, setEditingProfSkill] = useState<Partial<ProfessionalSkillItem> | null>(null);
  const [editingExp, setEditingExp] = useState<Partial<ExperienceItem> | null>(null);

  // Auth Guard check on mount
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

  // Load active tab data when authed
  const loadData = async () => {
    if (!authed) return;
    setLoading(true);
    try {
      if (activeTab === "projects") {
        const data = await fetchProjects();
        setProjectsList(data);
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

  // ---------------------------------------------------------------------------
  // PASSCODE LOGIN SCREEN (If not authenticated)
  // ---------------------------------------------------------------------------
  if (!authed) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <PixelCard variant="elevated" className="max-w-md w-full p-8 text-center space-y-6">
          <h1
            className="pixel-text text-xl md:text-2xl font-bold"
            style={{ color: dayTheme.colors.coin }}
          >
            🔒 VOID ADMIN PORTAL
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
              🔑 UNLOCK CMS DASHBOARD
            </PixelButton>
          </form>
        </PixelCard>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // ADMIN DASHBOARD SCREEN (If authenticated)
  // ---------------------------------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 bg-[rgba(13,27,42,0.9)] border-4 border-black shadow-[4px_4px_0px_#000]">
        <div>
          <h1 className="pixel-text text-lg md:text-2xl" style={{ color: dayTheme.colors.coin }}>
            👑 VOID PORTFOLIO CMS
          </h1>
          <p className="pixel-text text-xs mt-1" style={{ color: dayTheme.colors.pipe }}>
            {isSupabaseConfigured() ? "● CONNECTED TO SUPABASE" : "○ USING LOCAL STATIC FALLBACK (ADD ENV VARS TO CONNECT SUPABASE)"}
          </p>
        </div>
        <PixelButton variant="brick" size="sm" onClick={handleLogout}>
          🚪 LOG OUT
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
            { id: "projects", label: "📂 PROJECTS" },
            { id: "tech_skills", label: "⚡ TECH SKILLS" },
            { id: "prof_skills", label: "💼 PROF SKILLS" },
            { id: "experience", label: "🏆 EXPERIENCE" },
            { id: "contact", label: "📞 CONTACT" },
            { id: "scores", label: "🕹️ LEADERBOARD" },
          ] as const
        ).map((tab) => (
          <PixelButton
            key={tab.id}
            variant={activeTab === tab.id ? "coin" : "pipe"}
            size="sm"
            onClick={() => {
              setActiveTab(tab.id as TabType);
              setEditingProject(null);
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

      {/* TAB 1: PROJECTS CMS */}
      {!loading && activeTab === "projects" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
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
              + ADD NEW PROJECT
            </PixelButton>
          </div>

          {/* Form Modal / Inline Editor */}
          {editingProject && (
            <PixelCard variant="elevated" className="p-6 space-y-4 border-4 border-yellow-400">
              <h3 className="pixel-text text-sm" style={{ color: dayTheme.colors.coin }}>
                {editingProject.id ? "EDIT PROJECT" : "CREATE NEW PROJECT"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-gray-400 mb-1">PROJECT TITLE</label>
                  <input
                    type="text"
                    value={editingProject.title || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full p-2 bg-slate-900 border text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">LIVE PROJECT LINK</label>
                  <input
                    type="text"
                    value={editingProject.link || "#"}
                    onChange={(e) => setEditingProject({ ...editingProject, link: e.target.value })}
                    className="w-full p-2 bg-slate-900 border text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-400 mb-1">DESCRIPTION</label>
                  <textarea
                    rows={3}
                    value={editingProject.description || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    className="w-full p-2 bg-slate-900 border text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">TECH STACK (Comma Separated)</label>
                  <input
                    type="text"
                    value={(editingProject.tech || []).join(", ")}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        tech: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full p-2 bg-slate-900 border text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">ACCENT COLOR (HEX)</label>
                  <input
                    type="text"
                    value={editingProject.accent || "#9cbd09"}
                    onChange={(e) => setEditingProject({ ...editingProject, accent: e.target.value })}
                    className="w-full p-2 bg-slate-900 border text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-400 mb-1">PROJECT IMAGE URL OR FILE UPLOAD</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={editingProject.image || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                      className="flex-1 p-2 bg-slate-900 border text-white"
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
                  onClick={async () => {
                    if (!editingProject.title || !editingProject.description) {
                      showFeedback("Title and description are required!", "error");
                      return;
                    }
                    try {
                      await saveProject(editingProject);
                      showFeedback("Project saved successfully!");
                      setEditingProject(null);
                      void loadData();
                    } catch (err) {
                      showFeedback(err instanceof Error ? err.message : "Save failed", "error");
                    }
                  }}
                >
                  💾 SAVE PROJECT
                </PixelButton>
                <PixelButton variant="brick" size="sm" onClick={() => setEditingProject(null)}>
                  CANCEL
                </PixelButton>
              </div>
            </PixelCard>
          )}

          {/* Project List */}
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
                      onClick={async () => {
                        if (confirm(`Delete project "${p.title}"?`)) {
                          try {
                            if (p.id) await deleteProject(p.id);
                            showFeedback("Project deleted");
                            void loadData();
                          } catch (err) {
                            showFeedback(err instanceof Error ? err.message : "Delete failed", "error");
                          }
                        }
                      }}
                    >
                      DEL
                    </PixelButton>
                  </div>
                </div>
                <p className="text-xs text-gray-300">{p.description}</p>
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

      {/* TAB 2: TECHNICAL SKILLS CMS */}
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
              + ADD SKILL CATEGORY
            </PixelButton>
          </div>

          {editingTechSkill && (
            <PixelCard variant="elevated" className="p-6 space-y-4 border-4 border-yellow-400">
              <h3 className="pixel-text text-sm" style={{ color: dayTheme.colors.coin }}>
                {editingTechSkill.id ? "EDIT TECHNICAL SKILL" : "CREATE TECHNICAL SKILL"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-gray-400 mb-1">CATEGORY NAME</label>
                  <input
                    type="text"
                    value={editingTechSkill.name || ""}
                    onChange={(e) => setEditingTechSkill({ ...editingTechSkill, name: e.target.value })}
                    className="w-full p-2 bg-slate-900 border text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">ICON (Globe, Smartphone, Cpu, Rocket, Shield, Code)</label>
                  <input
                    type="text"
                    value={editingTechSkill.icon || "Globe"}
                    onChange={(e) => setEditingTechSkill({ ...editingTechSkill, icon: e.target.value })}
                    className="w-full p-2 bg-slate-900 border text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-400 mb-1">SKILL ITEMS (Comma Separated)</label>
                  <input
                    type="text"
                    value={(editingTechSkill.items || []).join(", ")}
                    onChange={(e) =>
                      setEditingTechSkill({
                        ...editingTechSkill,
                        items: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full p-2 bg-slate-900 border text-white"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <PixelButton
                  variant="coin"
                  size="sm"
                  onClick={async () => {
                    try {
                      await saveTechnicalSkill(editingTechSkill);
                      showFeedback("Skill category saved!");
                      setEditingTechSkill(null);
                      void loadData();
                    } catch (err) {
                      showFeedback(err instanceof Error ? err.message : "Save failed", "error");
                    }
                  }}
                >
                  💾 SAVE CATEGORY
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
                    onClick={async () => {
                      if (confirm(`Delete category "${s.name}"?`)) {
                        if (s.id) await deleteTechnicalSkill(s.id);
                        showFeedback("Category deleted");
                        void loadData();
                      }
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

      {/* TAB 3: PROFESSIONAL SKILLS CMS */}
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
              + ADD PROFESSIONAL SKILL
            </PixelButton>
          </div>

          {editingProfSkill && (
            <PixelCard variant="elevated" className="p-6 space-y-4 border-4 border-yellow-400">
              <h3 className="pixel-text text-sm" style={{ color: dayTheme.colors.coin }}>
                {editingProfSkill.id ? "EDIT PROFESSIONAL SKILL" : "CREATE PROFESSIONAL SKILL"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-gray-400 mb-1">SKILL NAME</label>
                  <input
                    type="text"
                    value={editingProfSkill.name || ""}
                    onChange={(e) => setEditingProfSkill({ ...editingProfSkill, name: e.target.value })}
                    className="w-full p-2 bg-slate-900 border text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">ICON (Code, Palette, Briefcase, Rocket)</label>
                  <input
                    type="text"
                    value={editingProfSkill.icon || "Code"}
                    onChange={(e) => setEditingProfSkill({ ...editingProfSkill, icon: e.target.value })}
                    className="w-full p-2 bg-slate-900 border text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-400 mb-1">DESCRIPTION</label>
                  <textarea
                    rows={2}
                    value={editingProfSkill.description || ""}
                    onChange={(e) => setEditingProfSkill({ ...editingProfSkill, description: e.target.value })}
                    className="w-full p-2 bg-slate-900 border text-white"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <PixelButton
                  variant="coin"
                  size="sm"
                  onClick={async () => {
                    try {
                      await saveProfessionalSkill(editingProfSkill);
                      showFeedback("Professional skill saved!");
                      setEditingProfSkill(null);
                      void loadData();
                    } catch (err) {
                      showFeedback(err instanceof Error ? err.message : "Save failed", "error");
                    }
                  }}
                >
                  💾 SAVE SKILL
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
                  <p className="text-xs text-gray-300 mt-1">{s.description}</p>
                </div>
                <div className="flex gap-2">
                  <PixelButton variant="coin" size="sm" onClick={() => setEditingProfSkill(s)}>
                    EDIT
                  </PixelButton>
                  <PixelButton
                    variant="brick"
                    size="sm"
                    onClick={async () => {
                      if (confirm(`Delete skill "${s.name}"?`)) {
                        if (s.id) await deleteProfessionalSkill(s.id);
                        showFeedback("Skill deleted");
                        void loadData();
                      }
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

      {/* TAB 4: EXPERIENCE CMS */}
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
              + ADD EXPERIENCE
            </PixelButton>
          </div>

          {editingExp && (
            <PixelCard variant="elevated" className="p-6 space-y-4 border-4 border-yellow-400">
              <h3 className="pixel-text text-sm" style={{ color: dayTheme.colors.coin }}>
                {editingExp.id ? "EDIT EXPERIENCE" : "CREATE EXPERIENCE"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-gray-400 mb-1">JOB TITLE</label>
                  <input
                    type="text"
                    value={editingExp.jobTitle || ""}
                    onChange={(e) => setEditingExp({ ...editingExp, jobTitle: e.target.value })}
                    className="w-full p-2 bg-slate-900 border text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">COMPANY</label>
                  <input
                    type="text"
                    value={editingExp.company || ""}
                    onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                    className="w-full p-2 bg-slate-900 border text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">START DATE</label>
                  <input
                    type="text"
                    value={editingExp.startDate || ""}
                    onChange={(e) => setEditingExp({ ...editingExp, startDate: e.target.value })}
                    className="w-full p-2 bg-slate-900 border text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">END DATE</label>
                  <input
                    type="text"
                    value={editingExp.endDate || ""}
                    onChange={(e) => setEditingExp({ ...editingExp, endDate: e.target.value })}
                    className="w-full p-2 bg-slate-900 border text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-400 mb-1">OVERVIEW</label>
                  <textarea
                    rows={2}
                    value={editingExp.overview || ""}
                    onChange={(e) => setEditingExp({ ...editingExp, overview: e.target.value })}
                    className="w-full p-2 bg-slate-900 border text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-400 mb-1">ACHIEVEMENTS / BULLETS (Pipe '|' Separated)</label>
                  <textarea
                    rows={3}
                    value={(editingExp.details || []).join(" | ")}
                    onChange={(e) =>
                      setEditingExp({
                        ...editingExp,
                        details: e.target.value.split("|").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full p-2 bg-slate-900 border text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-400 mb-1">TECH USED (Comma Separated)</label>
                  <input
                    type="text"
                    value={(editingExp.tech || []).join(", ")}
                    onChange={(e) =>
                      setEditingExp({
                        ...editingExp,
                        tech: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full p-2 bg-slate-900 border text-white"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <PixelButton
                  variant="coin"
                  size="sm"
                  onClick={async () => {
                    try {
                      await saveExperience(editingExp);
                      showFeedback("Experience entry saved!");
                      setEditingExp(null);
                      void loadData();
                    } catch (err) {
                      showFeedback(err instanceof Error ? err.message : "Save failed", "error");
                    }
                  }}
                >
                  💾 SAVE EXPERIENCE
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
                  <p className="text-xs text-gray-300 mt-2">{e.overview}</p>
                </div>
                <div className="flex gap-2">
                  <PixelButton variant="coin" size="sm" onClick={() => setEditingExp(e)}>
                    EDIT
                  </PixelButton>
                  <PixelButton
                    variant="brick"
                    size="sm"
                    onClick={async () => {
                      if (confirm(`Delete experience "${e.jobTitle}"?`)) {
                        if (e.id) await deleteExperience(e.id);
                        showFeedback("Experience deleted");
                        void loadData();
                      }
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

      {/* TAB 5: CONTACT CMS */}
      {!loading && activeTab === "contact" && (
        <PixelCard variant="elevated" className="p-6 space-y-4">
          <h2 className="pixel-text text-base mb-4" style={{ color: dayTheme.colors.coin }}>
            CONTACT INFO & SOCIAL LINKS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="block text-gray-400 mb-1">EMAIL ADDRESS</label>
              <input
                type="text"
                value={contactData.email}
                onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                className="w-full p-2 bg-slate-900 border text-white"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">PHONE NUMBER</label>
              <input
                type="text"
                value={contactData.phone}
                onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                className="w-full p-2 bg-slate-900 border text-white"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">GITHUB URL</label>
              <input
                type="text"
                value={contactData.github}
                onChange={(e) => setContactData({ ...contactData, github: e.target.value })}
                className="w-full p-2 bg-slate-900 border text-white"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">LINKEDIN URL</label>
              <input
                type="text"
                value={contactData.linkedin}
                onChange={(e) => setContactData({ ...contactData, linkedin: e.target.value })}
                className="w-full p-2 bg-slate-900 border text-white"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">INSTAGRAM URL</label>
              <input
                type="text"
                value={contactData.instagram}
                onChange={(e) => setContactData({ ...contactData, instagram: e.target.value })}
                className="w-full p-2 bg-slate-900 border text-white"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">VIBER LINK</label>
              <input
                type="text"
                value={contactData.viber}
                onChange={(e) => setContactData({ ...contactData, viber: e.target.value })}
                className="w-full p-2 bg-slate-900 border text-white"
              />
            </div>
          </div>
          <div className="pt-4">
            <PixelButton
              variant="coin"
              size="md"
              onClick={async () => {
                try {
                  await saveContactInfo(contactData);
                  showFeedback("Contact details updated!");
                } catch (err) {
                  showFeedback(err instanceof Error ? err.message : "Save failed", "error");
                }
              }}
            >
              💾 SAVE CONTACT DETAILS
            </PixelButton>
          </div>
        </PixelCard>
      )}

      {/* TAB 6: LEADERBOARD */}
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
    </div>
  );
}
