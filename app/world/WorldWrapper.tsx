"use client";

import dynamic from "next/dynamic";

const WorldPageContent = dynamic(
  () => import("./WorldPageContent"),
  { ssr: false }
);

export default function WorldWrapper() {
  return <WorldPageContent />;
}
