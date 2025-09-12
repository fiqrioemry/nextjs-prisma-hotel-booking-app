import React from "react";
import { BookingsList } from "@/components/admin/bookings/bookings-list";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Bookings - Admin Dashboard",
  description: "Manage bookings in the admin dashboard.",
};

export default async function Page() {
  return (
    <div>
      <BookingsList />
    </div>
  );
}
