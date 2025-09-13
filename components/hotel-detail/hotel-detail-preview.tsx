"use client";

import { useEffect } from "react";
import { Hotel } from "lucide-react";
import { RoomCard } from "./room-card";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { HotelDetails } from "@/lib/actions/hotels";
import { useRouter, useSearchParams } from "next/navigation";

export const HotelDetailPreview = ({ hotel }: { hotel: HotelDetails }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  // always check to ensure startDate and endDate are valid
  useEffect(() => {
    const today = new Date();
    const defaultStart = today.toISOString().split("T")[0];
    const defaultEnd = new Date(today.getTime() + 86400000)
      .toISOString()
      .split("T")[0];

    let shouldRedirect = false;

    // Check if dates are missing or invalid
    if (!startDate || !endDate) {
      shouldRedirect = true;
    } else {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start < today || end <= start) {
        shouldRedirect = true;
      }
    }

    // Perform redirect if needed
    if (shouldRedirect) {
      router.replace(
        `/hotels/${hotel.hotelId}?startDate=${defaultStart}&endDate=${defaultEnd}`
      );
    }
  }, [startDate, endDate, hotel.hotelId, router]);

  return (
    <div className="max-w-7xl w-full p-6 rounded-lg space-y-8">
      <div className="space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            {hotel.hotelName}
          </h1>
          <p className="text-lg text-muted-foreground flex items-center gap-2">
            <Hotel className="w-5 h-5" />
            {hotel.address}
          </p>
          {startDate && endDate && (
            <div className="flex items-center gap-2 text-sm">
              <Badge className="bg-blue-500">
                Check-in: {formatDate(startDate)}
              </Badge>
              <span>•</span>
              <Badge className="bg-blue-500">
                Check-out: {formatDate(endDate)}
              </Badge>
            </div>
          )}
        </div>

        {/* Hotel Description & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative">
            <img
              src={hotel.thumbnail}
              alt={hotel.hotelName}
              className="w-full h-80 object-cover rounded-xl shadow-lg"
            />
          </div>
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-3">About This Hotel</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {hotel.description}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-700">
                  {hotel.rooms.reduce(
                    (sum, room) => sum + room.availableUnits,
                    0
                  )}
                </div>
                <div className="text-sm text-green-600">Available Rooms</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-700">
                  {hotel.rooms.length}
                </div>
                <div className="text-sm text-blue-600">Room Types</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Rooms */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Available Rooms</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {hotel.rooms.map((room) => (
            <RoomCard
              hotelId={hotel.hotelId}
              room={room}
              key={room.roomId}
              endDate={endDate!}
              startDate={startDate!}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
