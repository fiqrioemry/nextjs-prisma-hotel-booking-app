import React from "react";
import { BookingsList } from "@/components/admin/bookings-list";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Bookings - Admin Dashboard",
  description: "Manage bookings in the admin dashboard.",
};

export default function Page() {
  return (
    <div className="space-y-6 w-full mx-auto px-4 md:px-8">
      <BookingsList />
    </div>
  );
}
