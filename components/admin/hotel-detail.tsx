"use client";

import React from "react";

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Trash } from "lucide-react";
import { useHotel } from "@/hooks/use-hotels";
import { AddRoomForm } from "./add-room-form";
import { Button } from "@/components/ui/button";
import { EditRoomForm } from "./edit-room-form";
import { Skeleton } from "@/components/ui/skeleton";
import { EditHotelForm } from "./edit-hotel-form";
import { DeleteRoomForm } from "./delete-room-form";

export const HotelDetail = ({ id }: { id: string }) => {
  const { data, isLoading, isError } = useHotel({ id: id });

  const handleDelete = () => {
    toast.info("Delete room feature is disabled on DEMO.");
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <p className="text-red-500 text-center">Failed to load hotel detail.</p>
    );
  }

  const hotel = data.data;
  console.log(hotel);

  return (
    <div className="space-y-8">
      {/* HOTEL INFO */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{hotel.name}</CardTitle>
              <CardDescription>{hotel.address}</CardDescription>
            </div>
            <EditHotelForm hotel={hotel} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {hotel.thumbnail && (
            <img
              src={hotel.thumbnail}
              alt={hotel.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          )}
          <p className="text-muted-foreground">{hotel.description}</p>
        </CardContent>
      </Card>

      {/* ROOMS */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Rooms</h2>
        <AddRoomForm id={hotel.id} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {hotel.rooms?.map((room: any) => (
          <Card key={room.id} className="flex flex-col">
            <CardHeader className="px-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle>{room.name}</CardTitle>
                <div className="space-x-2">
                  <EditRoomForm room={room} />
                  <DeleteRoomForm room={room} />
                </div>
              </div>
              <CardDescription>{room.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 px-2">
              {room.images?.[0] && (
                <img
                  src={room.images[0].url}
                  alt={room.name}
                  className="w-full h-40 object-cover rounded-md"
                />
              )}
              <p className="text-lg font-medium">
                Rp {room.price.toLocaleString("id-ID")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
