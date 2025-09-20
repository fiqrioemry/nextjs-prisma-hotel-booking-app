// app/page.tsx
import { Metadata } from "next";
import { HomeClient } from "@/components/home/home-client";

export const metadata: Metadata = {
  title: "Pesan Hotel - Temukan Destinasi Impian",
  description: "Booking hotel dan akomodasi terbaik dengan mudah.",
};

export const dynamic = "force-static";
export const revalidate = false;

export default function HomePage() {
  return <HomeClient />;
}
