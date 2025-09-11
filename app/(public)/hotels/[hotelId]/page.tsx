import React from "react";
import { Metadata } from "next";
import { HotelDetailPreview } from "@/components/hotel-detail/hotel-detail-preview";

export const metadata: Metadata = {
  title: "Hotels - Hotel Booking",
  description: "Explore our range of hotels and find the perfect stay.",
};

export async function getHotelDetails(hotelId: string) {
  await new Promise<void>((resolve) => setTimeout(resolve, 1000));
  return {
    id: "h_001",
    name: "Hotel Mawar",
    description: "Hotel nyaman di pusat kota",
    thumbnail: "https://via.placeholder.com/300",
    address: "Jl. Sudirman No.1",
    rooms: [
      {
        id: "r_001",
        name: "Single Room type",
        type: "Single Bed",
        price: 500000,
        capacity: 2,
        totalUnits: 10,
        images: [
          "https://via.placeholder.com/400",
          "https://via.placeholder.com/400",
          "https://via.placeholder.com/400",
        ],
      },
      {
        id: "r_001",
        name: "Deluxe Room type",
        type: "Double Bed",
        price: 400000,
        capacity: 2,
        totalUnits: 10,
        images: [
          "https://via.placeholder.com/400",
          "https://via.placeholder.com/400",
          "https://via.placeholder.com/400",
        ],
      },
    ],
  };
}

export default async function Page({
  params,
}: {
  params: { hotelId: string };
}) {
  const hotel = await getHotelDetails(params.hotelId);
  return (
    <section className="h-screen flex items-center justify-center">
      <HotelDetailPreview hotel={hotel} />
    </section>
  );
}
