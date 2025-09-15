"use client";

import React from "react";
import { formatRupiah } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { RoomDetail } from "@/lib/types/rooms";
import { ImageCarousel } from "./image-carousel";
import { Card, CardContent } from "@/components/ui/card";
import { BookRoomForm, type BookForm } from "./book-room-form";
import { Users, Hotel, XCircle, CheckCircle } from "lucide-react";

export const RoomCard = ({
  room,
  startDate,
  endDate,
}: {
  room: RoomDetail;
  endDate: string;
  startDate: string;
}) => {
  const [bookForm, setBookForm] = React.useState<BookForm>({
    roomId: room.id,
    startDate: startDate,
    endDate: endDate,
    quantity: 1,
  });

  return (
    <Card className="border-0 p-0 shadow-lg h-full">
      <CardContent className="p-0 flex flex-col h-full">
        {/* Room Image Carousel */}
        <div className="relative rounded-t-lg overflow-hidden group">
          <ImageCarousel room={room} />

          {/* Availability Badge */}
          <div className="absolute top-4 right-4 z-10">
            {room.availableUnits > 0 ? (
              <Badge className="bg-green-600 hover:bg-green-700 text-white">
                <CheckCircle className="w-3 h-3 mr-1" />
                Tersedia
              </Badge>
            ) : (
              <Badge variant="destructive">
                <XCircle className="w-3 h-3 mr-1" />
                Habis dibooking
              </Badge>
            )}
          </div>

          {/* Price Badge */}
          <div className="absolute bottom-4 left-4 z-10">
            <div className="bg-card/50 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
              <div className="text-2xl font-bold ">
                {formatRupiah(room.price)}
              </div>
              <div className="text-xs text-white">per malam</div>
            </div>
          </div>
        </div>

        {/* Room Details */}
        <div className="py-2 px-4 space-y-4 flex flex-col flex-1">
          {/* Room Name & Description */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold line-clamp-1">{room.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {room.description}
            </p>
          </div>

          {/* Room Stats */}
          <div className="grid grid-cols-3 gap-4 py-3 border-t border-b">
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
              <div className="text-xs text-muted-foreground">Tersedia</div>
            </div>
          </div>

          {/* facilities */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold ">Fasilitas Kamar</h4>
            <div className="flex flex-wrap gap-2">
              {room.facilities && room.facilities.length > 0
                ? room.facilities.slice(0, 4).map((f: string, idx: number) => (
                    <Badge variant="outline" key={idx}>
                      <span>{f}</span>
                    </Badge>
                  ))
                : null}
            </div>
          </div>

          {/* Booking Section (selalu di bawah) */}
          <div className="mt-auto">
            {room.availableUnits > 0 ? (
              <div className="space-y-2">
                {room.availableUnits <= 3 && (
                  <div className="text-xs text-destructive/90 bg-destructive/10 px-2 py-1 rounded border border-destructive/10">
                    Hanya tersisa {room.availableUnits} kamar!
                  </div>
                )}
                <BookRoomForm room={room} bookForm={bookForm} />
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="text-sm text-muted-foreground mb-2">
                  Kamar sudah terisi penuh
                </div>
                <Badge variant="outline" className="text-xs">
                  Coba tanggal lain
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
