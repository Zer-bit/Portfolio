import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./styles/globals.css";
import GameLayout from "./components/layout/game-layout";

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
        <html lang="en" className={`scroll-smooth ${pressStart2P.variable}`}>
            <body className="antialiased overflow-x-hidden">
                <GameLayout theme="day">
                    {children}
                </GameLayout>
            </body>
        </html>
    );
}
