import React from "react";
import { HotelDetail } from "@/components/admin/hotels/hotel-detail/hotel-detail";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Hotel Detail - Admin Dashboard",
  description: "View and manage hotel details in the admin dashboard.",
};

export default async function Page() {
  return (
    <div>
      <HotelDetail />
    </div>
  );
}
