"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Image from "next/image";
import React from "react";
import { formatRupiah } from "@/lib/utils";

type Room = {
  id: string;
  name: string;
  price: number;
  capacity: number;
  description: string;
  images: string[];
  hotel: {
    id: string;
    name: string;
    location: string;
    thumbnail: string;
  };
};

export function BookedRoomDetail({ room }: { room: Room }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Eye className="w-4 h-4 mr-1" /> View Room
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{room.hotel.name}</DialogTitle>
          <DialogDescription>
            {room.name} · {room.capacity} Guests
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="relative w-full h-48 rounded-lg overflow-hidden">
            <Image
              src={room.images[0] || room.hotel.thumbnail}
              alt={room.name}
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
          </div>
          <p className="text-sm text-muted-foreground">{room.description}</p>
          <p className="font-bold text-lg">
            {formatRupiah(room.price)} / night
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
