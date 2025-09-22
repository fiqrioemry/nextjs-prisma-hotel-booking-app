// app/contact/page.tsx
import { Metadata } from "next";
import { ContactClient } from "@/components/contact/contact-list";

export const metadata: Metadata = {
  title: "Contact Us - Pesan Hotel",
  description: "Hubungi kami untuk konsultasi perjalanan impian Anda.",
};

// this page is static and will not be revalidated
export const dynamic = "force-static";
export const revalidate = false;

export default function ContactPage() {
  return <ContactClient />;
}
