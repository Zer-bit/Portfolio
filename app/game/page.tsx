"use client";

import dynamic from "next/dynamic";
import { dayTheme, pixelGrid } from "../lib/theme";

const MarioGame = dynamic(
  () => import("../components/game/MarioGame"),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          margin: "0 auto",
          padding: pixelGrid.px4,
        }}
      >
        <div
          style={{
            width: "100%",
            paddingBottom: "56.25%",
            position: "relative",
            background: dayTheme.colors.sky,
            border: `4px solid ${dayTheme.colors.border}`,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "12px",
              color: dayTheme.colors.text,
            }}
          >
            LOADING...
          </div>
        </div>
      </div>
    ),
  }
);

export default function GamePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: `${pixelGrid.px12} ${pixelGrid.px4}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1
        className="pixel-text"
        style={{
          color: dayTheme.colors.coin,
          fontSize: "16px",
          marginBottom: pixelGrid.px8,
          textAlign: "center",
        }}
      >
        PLAY MY MARIO GAME
      </h1>
      <MarioGame />
    </main>
  );
}
