import React from "react";
import { BookingsList } from "@/components/admin/bookings-list";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Bookings - Admin Dashboard",
  description: "Manage bookings in the admin dashboard.",
};

export default function Page() {
  return (
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <BookingsList />
    </div>
  );
}
