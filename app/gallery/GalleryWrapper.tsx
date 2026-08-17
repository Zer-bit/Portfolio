"use client";

import dynamic from "next/dynamic";

const GalleryContent = dynamic(
  () => import("./GalleryContent").then((mod) => ({ default: mod.GalleryContent })),
  { ssr: false }
);

export default function GalleryWrapper() {
  return <GalleryContent />;
}
