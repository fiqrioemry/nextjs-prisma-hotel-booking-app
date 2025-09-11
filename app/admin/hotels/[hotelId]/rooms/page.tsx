import React from "react";
import { RoomsList } from "@/components/admin/hotels/rooms/rooms-list";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Rooms - Admin Dashboard",
  description: "Manage rooms in the admin dashboard.",
};

export default async function Page() {
  return (
    <div>
      <RoomsList />
    </div>
  );
}
