import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/layout/navbar";
import ScrollProgress from "./components/ui/scroll-progress";

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
            <body className="antialiased bg-[#f0f0f0] text-[#111111] selection:bg-[#9cbd09]/30 overflow-x-hidden">
                <ScrollProgress />
                <Navbar />
                <div className="relative z-10 w-full overflow-x-hidden">
                    {children}
                </div>
            </body>
        </html>
    );
}

