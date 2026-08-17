import type { Metadata } from "next";
import GalleryWrapper from "./GalleryWrapper";

export const metadata: Metadata = {
  title: "Jezer Parales | Photo Gallery",
  description: "Explore corporate showcases, project launches, and event highlights in Jezer Parales' portfolio photo gallery.",
};

export default function GalleryPage() {
  return <GalleryWrapper />;
}
