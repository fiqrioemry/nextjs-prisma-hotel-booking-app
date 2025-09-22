import React from "react";
import { Metadata } from "next";
import { UserBookingsLists } from "@/components/user/user-bookings-lists";

export const metadata: Metadata = {
  title: "Pesananku - Pesan Hotel",
  description: "Lihat dan kelola Pesan Hotels Anda.",
};

export default function Page() {
  return (
    <div className="max-w-5xl mx-auto w-full space-y-8 h-full">
      <UserBookingsLists />
    </div>
  );
}
