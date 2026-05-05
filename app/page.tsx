import HeroSection from "./features/hero/index";
import Skills from "./features/skills/index";
import ProjectsSection from "./features/projects/index";
import ContactSection from "./features/contact/index";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <Skills />
      <ProjectsSection />
      <ContactSection />
    </main>
  );
}
