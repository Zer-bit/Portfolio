"use client";

import dynamic from "next/dynamic";
import { dayTheme } from "../lib/theme";

const MarioGame = dynamic(
  () => import("../components/game/MarioGame"),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          width: "100%",
          aspectRatio: "16 / 9",
          background: dayTheme.colors.sky,
          border: `4px solid ${dayTheme.colors.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "clamp(8px, 2vw, 12px)",
          color: dayTheme.colors.text,
        }}
      >
        LOADING...
      </div>
    ),
  }
);

export default function GamePage() {
  return (
    <main
      style={{
        /* sit flush below the fixed navbar (56px) */
        paddingTop: "56px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        background: "#000",
      }}
    >
      <h1
        className="pixel-text"
        style={{
          color: dayTheme.colors.coin,
          fontSize: "clamp(9px, 2vw, 14px)",
          textAlign: "center",
          margin: "8px 0 4px",
          letterSpacing: "0.1em",
        }}
      >
        MARIO GAME
      </h1>
      <MarioGame />
    </main>
  );
}
