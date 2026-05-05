import type { Metadata } from "next";
import ContactSection from "../features/contact/index";

export const metadata: Metadata = {
  title: "Jezer Parales | Contact",
};

export default function ContactPage() {
  return <ContactSection />;
}
