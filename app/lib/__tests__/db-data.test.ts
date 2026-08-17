import { describe, it, expect } from "vitest";
import {
  fetchProjects,
  fetchTechnicalSkills,
  fetchProfessionalSkills,
  fetchExperience,
  fetchContactInfo,
} from "../db-data";

describe("db-data service layer", () => {
  it("fetches projects (falling back gracefully to static data if Supabase isn't connected)", async () => {
    const projects = await fetchProjects();
    expect(projects).toBeDefined();
    expect(projects.length).toBeGreaterThan(0);
    expect(projects[0].title).toBeDefined();
  });

  it("fetches technical skills with fallback", async () => {
    const skills = await fetchTechnicalSkills();
    expect(skills).toBeDefined();
    expect(skills.length).toBeGreaterThan(0);
  });

  it("fetches professional skills with fallback", async () => {
    const skills = await fetchProfessionalSkills();
    expect(skills).toBeDefined();
    expect(skills.length).toBeGreaterThan(0);
  });

  it("fetches experience entries with fallback", async () => {
    const exp = await fetchExperience();
    expect(exp).toBeDefined();
    expect(exp.length).toBeGreaterThan(0);
  });

  it("fetches contact info with fallback", async () => {
    const contact = await fetchContactInfo();
    expect(contact.email).toBeDefined();
    expect(contact.github).toBeDefined();
  });
});
