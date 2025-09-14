import React from "react";
import { Metadata } from "next";
import { HotelsList } from "@/components/admin/hotels-list";

export const metadata: Metadata = {
  title: "Hotels - Admin Dashboard",
  description: "Manage hotels in the admin dashboard.",
};
export default async function Page() {
  return (
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <HotelsList />
    </div>
  );
}
