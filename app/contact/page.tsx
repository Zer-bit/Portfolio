import type { Metadata } from "next";
import ContactWrapper from "./ContactWrapper";

export const metadata: Metadata = {
  title: "Jezer Parales | Contact",
};

export default function ContactPage() {
  return <ContactWrapper />;
}
