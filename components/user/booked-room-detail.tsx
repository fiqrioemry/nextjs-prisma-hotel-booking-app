"use client";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import React from "react";
import Image from "next/image";
import { Eye } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { RoomDetail } from "@/lib/types/rooms";

export function BookedRoomDetail({ room }: { room: RoomDetail }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Eye className="w-4 h-4 mr-1" />
          Lihat kamar
          {/* View Room */}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{room.name}</DialogTitle>
          <DialogDescription>
            {room.name} · {room.capacity} Tamu
            {/* Guests */}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="relative w-full h-48 rounded-lg overflow-hidden">
            <Image
              src={room.images[0].url}
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
