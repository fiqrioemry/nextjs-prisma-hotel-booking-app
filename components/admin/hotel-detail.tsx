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
import { useHotel } from "@/hooks/use-hotels";
import { AddRoomForm } from "./add-room-form";
import { EditRoomForm } from "./edit-room-form";
import { Skeleton } from "@/components/ui/skeleton";
import { EditHotelForm } from "./edit-hotel-form";
import { DeleteRoomForm } from "./delete-room-form";
import Image from "next/image";
import { Room } from "@/lib/types/rooms";
import { array } from "zod";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";

export const HotelDetail = ({ id }: { id: string }) => {
  const { data, isLoading, isError } = useHotel({ id: id });

  const handleDelete = () => {
    toast.info("Delete room feature is disabled on DEMO.");
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[475px] w-full" />
        <div className="flex items-center justify-between py-6">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3  ">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-[350px] w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <p className="text-red-500 text-center">Failed to load hotel detail.</p>
    );
  }

  const hotel = data.data;

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
            <div className="flex items-center gap-2">
              <EditHotelForm hotel={hotel} />
              <Button onClick={handleDelete} variant="destructive" size="icon">
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {hotel.thumbnail && (
            <div className="relative w-full h-64">
              <Image
                src={hotel.thumbnail}
                alt={hotel.name}
                fill
                className="object-cover rounded-lg "
              />
            </div>
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
        {hotel.rooms?.map((room: Room) => (
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
                <div className="relative w-full h-64">
                  <Image
                    src={room.images[0].url}
                    alt={room.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
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
