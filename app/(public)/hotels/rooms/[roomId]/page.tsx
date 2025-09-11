import React from "react";
import { Metadata } from "next";
import { RoomDetailPreview } from "@/components/room/room-detail-preview";

export const metadata: Metadata = {
  title: "Room Details - Hotel Booking",
  description: "Detailed information about the room.",
};

export async function getRoomDetails(roomId: string) {
  await new Promise<void>((resolve) => setTimeout(resolve, 1000));
  const room = {
    id: roomId,
    hotelId: "1",
    name: `Room ${roomId}`,
    facilities: ["Free WiFi", "Air Conditioning", "Breakfast Included"],
    price: 1500000,
    description: "A comfortable room with all amenities.",
    totalUnits: 10,
    images: [
      "https://via.placeholder.com/400",
      "https://via.placeholder.com/400",
      "https://via.placeholder.com/400",
      "https://via.placeholder.com/400",
    ],
    bookings: [
      { checkIn: "2023-10-01", checkOut: "2023-10-05" },
      { checkIn: "2023-10-10", checkOut: "2023-10-15" },
      { checkIn: "2023-10-20", checkOut: "2023-10-25" },
    ],
  };
  return room;
}

export default async function page({ params }: { params: { roomId: string } }) {
  const room = await getRoomDetails(params.roomId);
  return <RoomDetailPreview room={room} />;
}
