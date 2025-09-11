import React from "react";
import { HotelsList } from "@/components/admin/hotels/hotels-list";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Hotels - Admin Dashboard",
  description: "Manage hotels in the admin dashboard.",
};

export default async function Page() {
  return (
    <div>
      <HotelsList />
    </div>
  );
}
