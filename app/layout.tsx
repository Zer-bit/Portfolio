import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./styles/globals.css";
import PageTransition from "./components/layout/PageTransition";
import { ProgressTrackerProvider } from "./lib/progress-tracker";
import { ThemeProvider } from "./lib/theme-context";
import ThemedGameLayout from "./components/layout/ThemedGameLayout";

/**
 * "Press Start 2P" loaded via next/font/google.
 * The CSS variable `--font-press-start-2p` is applied to the <html> element
 * so that `pixel.css` and Tailwind can reference it globally.
 */
const pressStart2P = Press_Start_2P({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-press-start-2p",
    display: "swap",
});

import { SITE_URL } from "./lib/constants";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: "Jezer Parales | Full Stack Web Developer Portfolio",
        template: "%s | Jezer Parales",
    },
    description:
        "Personal portfolio of Jezer Parales, a Full Stack Developer specializing in React, Next.js, TypeScript, and Flutter. Explore interactive Mario-themed level maps showcasing web development projects, skills, and experience.",
    keywords: [
        "Jezer Parales",
        "Jezer Mantilla Parales",
        "Full Stack Developer",
        "Web Developer Philippines",
        "React Developer",
        "Next.js Developer",
        "TypeScript Engineer",
        "Flutter Mobile Developer",
        "Retro Portfolio",
        "Mario Portfolio",
        "Software Engineer Philippines",
    ],
    authors: [{ name: "Jezer Parales", url: "https://github.com/Zer-bit" }],
    creator: "Jezer Parales",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: SITE_URL,
        title: "Jezer Parales | Full Stack Web Developer Portfolio",
        description:
            "Explore the Mario-themed developer portfolio of Jezer Parales. Featuring full-stack web and mobile apps, technical skills breakdown, and work achievements.",
        siteName: "Jezer Parales Portfolio",
        images: [
            {
                url: "/Images/IHI.png",
                width: 1200,
                height: 675,
                alt: "Jezer Parales Portfolio Overview",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Jezer Parales | Full Stack Web Developer Portfolio",
        description:
            "Explore the Mario-themed developer portfolio of Jezer Parales. Featuring full-stack web and mobile apps.",
        images: ["/Images/IHI.png"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Jezer Parales",
    "alternateName": "Jezer Mantilla Parales",
    "url": SITE_URL,
    "image": `${SITE_URL}/Images/IHI.png`,
    "sameAs": [
        "https://github.com/Zer-bit",
        "https://www.linkedin.com/in/jezer-parales-201488386",
        "https://www.instagram.com/zeretsui/",
    ],
    "jobTitle": "Full Stack Developer",
    "worksFor": {
        "@type": "Organization",
        "name": "Inspire Holdings Incorporated",
    },
    "description":
        "Jezer Parales is a Full Stack Web Developer from the Philippines specializing in React, Next.js, TypeScript, Node.js, and Mobile App Development.",
};

const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Jezer Parales Portfolio",
    "url": SITE_URL,
    "description":
        "Interactive retro Mario-themed portfolio of Full Stack Web Developer Jezer Parales.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" data-scroll-behavior="smooth" className={pressStart2P.variable}>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
                />
            </head>
            <body className="antialiased overflow-x-hidden">
                <ProgressTrackerProvider>
                    <ThemeProvider>
                        <ThemedGameLayout>
                            <PageTransition>{children}</PageTransition>
                        </ThemedGameLayout>
                    </ThemeProvider>
                </ProgressTrackerProvider>
            </body>
        </html>
    );
}
