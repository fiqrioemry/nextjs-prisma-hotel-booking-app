"use client";

import React from "react";
import { formatRupiah } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { BookRoomForm } from "./book-room-form";
import type { BookForm } from "./book-room-form";
import type { Room } from "@/lib/actions/hotels";
import { ImageCarousel } from "./image-carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Hotel, XCircle, CheckCircle } from "lucide-react";

export const RoomCard = ({
  hotelId,
  room,
  startDate,
  endDate,
}: {
  hotelId: string;
  room: Room;
  endDate: string;
  startDate: string;
}) => {
  const [bookForm, setBookForm] = React.useState<BookForm>({
    roomId: room.roomId,
    startDate: startDate,
    endDate: endDate,
    quantity: 1,
  });

  return (
    <Card className="border-0 p-0 shadow-lg">
      <CardContent className="p-0">
        {/* Room Image Carousel */}
        <div className="relative rounded-t-lg overflow-hidden group">
          <ImageCarousel images={room.images} roomName={room.roomName} />

          {/* Availability Badge */}
          <div className="absolute top-4 right-4 z-10">
            {room.availableUnits > 0 ? (
              <Badge className="bg-green-600 hover:bg-green-700 text-white">
                <CheckCircle className="w-3 h-3 mr-1" />
                Available
              </Badge>
            ) : (
              <Badge variant="destructive">
                <XCircle className="w-3 h-3 mr-1" />
                Fully Booked
              </Badge>
            )}
          </div>

          {/* Price Badge */}
          <div className="absolute bottom-4 left-4 z-10">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
              <div className="text-2xl font-bold ">
                {formatRupiah(room.price)}
              </div>
              <div className="text-xs text-muted-foreground">per night</div>
            </div>
          </div>
        </div>

        {/* Room Details */}
        <div className="py-2 px-4 space-y-4">
          {/* Room Name & Description */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold line-clamp-1">{room.roomName}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {room.description}
            </p>
          </div>

          {/* Room Stats */}
          <div className="grid grid-cols-3 gap-4 py-3 border-t border-b border-gray-100">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-sm font-semibold">{room.capacity}</div>
              <div className="text-xs text-muted-foreground">Guests</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Hotel className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-sm font-semibold ">{room.totalUnits}</div>
              <div className="text-xs text-muted-foreground">Total Units</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                {room.availableUnits > 0 ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
              </div>
              <div
                className={`text-sm font-semibold ${
                  room.availableUnits > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {room.availableUnits}
              </div>
              <div className="text-xs text-muted-foreground">Available</div>
            </div>
          </div>

          {/* facilities */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold ">Room Facilities</h4>
            <div className="flex flex-wrap gap-2">
              {room.facilities && room.facilities.length > 0
                ? room.facilities.slice(0, 4).map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-gray-50 text-gray-700 px-2 py-1 rounded-md text-xs"
                    >
                      <span>{amenity}</span>
                    </div>
                  ))
                : null}
            </div>
          </div>

          {/* Booking Section */}
          <div className="pt-4">
            {room.availableUnits > 0 ? (
              <div className="space-y-2 h-12">
                {room.availableUnits <= 3 && room.availableUnits > 0 && (
                  <div className=" text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-200">
                    Only {room.availableUnits} rooms left!
                  </div>
                )}
                <BookRoomForm
                  hotelId={hotelId}
                  room={room}
                  bookForm={bookForm}
                  endDate={endDate!}
                  startDate={startDate!}
                />
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="text-sm text-muted-foreground mb-2">
                  This room type is fully booked
                </div>
                <Badge variant="outline" className="text-xs">
                  Try different dates
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
