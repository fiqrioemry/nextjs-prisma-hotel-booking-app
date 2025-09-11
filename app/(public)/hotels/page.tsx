import React from "react";
import { Metadata } from "next";
import { HotelsListPreview } from "@/components/hotels/hotels-lists-preview";

export const metadata: Metadata = {
  title: "Hotels - Hotel Booking",
  description: "Explore our range of hotels and find the perfect stay.",
};

// simulate fetching data
async function getHotels() {
  await new Promise<void>((resolve) => setTimeout(resolve, 1000));
  return [
    {
      id: "h_001",
      name: "Hotel Mawar",
      description: "Hotel nyaman di pusat kota",
      thumbnail: "https://via.placeholder.com/300",
      address: "Jl. Sudirman No.1, Jakarta",
      createdAt: "2025-09-01T10:00:00.000Z",
      updatedAt: "2025-09-10T10:00:00.000Z",
      rooms: [
        { id: "r_001", name: "Deluxe", price: 500000, totalUnits: 10 },
        { id: "r_002", name: "Suite", price: 1200000, totalUnits: 5 },
      ],
    },
    {
      id: "h_002",
      name: "Hotel Melati",
      description: "Hotel bintang lima dengan pemandangan laut",
      thumbnail: "https://via.placeholder.com/300",
      address: "Jl. Sudirman No.1, Jakarta",
      createdAt: "2025-09-01T10:00:00.000Z",
      updatedAt: "2025-09-10T10:00:00.000Z",
      rooms: [
        { id: "r_001", name: "Deluxe", price: 500000, totalUnits: 10 },
        { id: "r_002", name: "Suite", price: 1200000, totalUnits: 5 },
      ],
    },
  ];
}

export default async function Page() {
  const hotels = await getHotels();
  return (
    <section className="h-screen py-12">
      <HotelsListPreview hotels={hotels} />
    </section>
  );
}
