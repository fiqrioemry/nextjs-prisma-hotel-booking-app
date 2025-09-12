import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Hotel Booking",
  description: "Learn more about our hotel booking services and mission.",
};

export default function Page() {
  return (
    <section className="h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold">ABOUT US PAGE</h1>
    </section>
  );
}
