import React from "react";
import { RoomDetail } from "@/components/admin/hotels/rooms/room-detail/room-detail";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Room Detail - Admin Dashboard",
  description: "View and manage room details in the admin dashboard.",
};

export default async function Page() {
  return (
    <div>
      <RoomDetail />
    </div>
  );
}
