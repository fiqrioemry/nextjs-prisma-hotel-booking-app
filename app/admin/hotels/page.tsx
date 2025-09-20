import React from "react";
import { Metadata } from "next";
import { HotelsList } from "@/components/admin/hotels-list";

export const metadata: Metadata = {
  title: "Hotels - Admin Dashboard",
  description: "Manage hotels in the admin dashboard.",
};
export default async function Page() {
  return (
    <div className="space-y-6 w-full mx-auto px-4 md:px-8">
      <HotelsList />
    </div>
  );
}
