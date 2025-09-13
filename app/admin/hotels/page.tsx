import React from "react";
import { HotelsList } from "@/components/admin/hotels/hotels-list";

import { Metadata } from "next";
import { adminGetHotels } from "@/lib/actions/hotels";
export const metadata: Metadata = {
  title: "Hotels - Admin Dashboard",
  description: "Manage hotels in the admin dashboard.",
};
export default async function Page({
  searchParams,
}: {
  searchParams: { q?: string; page?: string; limit?: string; sort?: string };
}) {
  const hotels = await adminGetHotels({
    q: searchParams.q || "",
    page: parseInt(searchParams.page || "1", 10),
    limit: parseInt(searchParams.limit || "8", 10),
    sort: (searchParams.sort as "newest" | "oldest") || "newest",
  });

  return (
    <div>
      <HotelsList hotels={hotels.data} meta={hotels.meta} />
    </div>
  );
}
