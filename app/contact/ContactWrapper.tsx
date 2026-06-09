"use client";

import dynamic from "next/dynamic";

const ContactSection = dynamic(
  () => import("../features/contact/index"),
  { ssr: false }
);

export default function ContactWrapper() {
  return <ContactSection />;
}
