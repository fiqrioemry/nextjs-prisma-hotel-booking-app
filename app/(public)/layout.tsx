import React from "react";
import Footer from "@/components/home/footer";
import Navbar from "@/components/home/navbar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
