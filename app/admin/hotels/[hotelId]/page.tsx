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
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <HotelDetail id={hotelId} />
    </div>
  );
}
