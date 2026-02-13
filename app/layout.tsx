import type { Metadata } from "next";
import "./globals.css";
import Starfield from "./starfield";
import Spotlight from "./spotlight";
import Navbar from "./navbar";
import MagneticCursor from "./magnetic-cursor";
import ScrollProgress from "./scroll-progress";
import ParticleNetwork from "./particle-network";

export const metadata: Metadata = {
    title: "Jezer Parales | Portfolio",
    description: "Web Developer Portfolio",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className="antialiased bg-black text-white selection:bg-violet-500/30 overflow-x-hidden">
                <MagneticCursor />
                <ScrollProgress />
                <ParticleNetwork />
                <Starfield />
                <Spotlight />
                <Navbar />
                <div className="relative z-10 w-full overflow-x-hidden">
                    {children}
                </div>
            </body>
        </html>
    );
}

