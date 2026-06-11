import type { Metadata } from "next";
import ContactWrapper from "./ContactWrapper";

export const metadata: Metadata = {
  title: "Contact Me",
  description: "Get in touch with Full Stack Developer Jezer Parales for career opportunities, freelance inquiries, or collaborations. Send a message directly or connect via Github, LinkedIn, or Instagram.",
};

export default function ContactPage() {
  return <ContactWrapper />;
}
