import PersonalInfo from "./personalInfo";
import Project from "./project";
import Skills from "./skills";
import Contact from "./contact";
import Footer from "./footer";

export default function Home() {
    return (
        <main className="min-h-screen bg-black">
            <PersonalInfo />
            <Skills />
            <Project />
            <Contact />
            <Footer />
        </main>
    );
}
