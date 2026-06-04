"use client";

import dynamic from "next/dynamic";

export { default as StartScreenComponent } from "./StartScreenComponent";

const StartScreen = dynamic(
  () => import("./StartScreenComponent").then((mod) => mod.default),
  { ssr: false }
);

export default StartScreen;
