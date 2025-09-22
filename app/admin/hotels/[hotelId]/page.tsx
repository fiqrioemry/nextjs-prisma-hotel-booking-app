import React from "react";
import { Metadata } from "next";
import { HotelDetail } from "@/components/admin/hotel-detail";

export const metadata: Metadata = {
  title: "Hotel Detail - Admin Dashboard",
  description: "View and manage hotel details in the admin dashboard.",
};

export default async function Page(props: {
  params: Promise<{ hotelId: string }>;
}) {
  const { hotelId } = await props.params;

  return (
    <div className="space-y-6 w-full mx-auto px-4 md:px-8">
      <HotelDetail id={hotelId} />
    </div>
  );
}
