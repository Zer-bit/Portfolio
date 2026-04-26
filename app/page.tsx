import Hero from "./components/sections/hero";
import Projects from "./components/sections/projects";
import Skills from "./components/sections/skills";
import Contact from "./components/sections/contact";
import Footer from "./components/layout/footer";

export default function Home() {
    return (
        <main className="min-h-screen bg-[#f0f0f0]">
            <Hero />
            <Skills />
            <Projects />
            <Contact />
            <Footer />
        </main>
    );
}
