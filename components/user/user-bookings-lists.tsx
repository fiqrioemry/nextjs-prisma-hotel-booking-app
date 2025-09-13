"use client";

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { cn, formatDate } from "@/lib/utils";
import Image from "next/image";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { BookedRoomDetail } from "./booked-room-detail";
import { Calendar, Hotel, Receipt } from "lucide-react";
import { PaginationTable } from "@/components/shared/pagination-table";

type booking = {
  id: string;
  checkIn: string;
  checkOut: string;
  quantity: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  createdAt: string;
  room: {
    id: string;
    name: string;
    price: number;
    capacity: number;
    description: string;
    hotel: {
      id: string;
      name: string;
      location: string;
      thumbnail: string;
    };
    images: string[];
  };
};

type pagination = {
  page: number;
  total: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export const UserBookingsLists = ({
  bookings,
  pagination,
}: {
  bookings: booking[];
  pagination: pagination;
}) => {
  return (
    <Card className="p-0">
      <CardHeader className="pt-4">
        <CardTitle className="flex items-center gap-2">
          <Hotel className="h-5 w-5" />
          My Bookings
        </CardTitle>
        <CardDescription>
          Your hotel bookings and reservation history
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-4">
        {/* Kondisi: tidak ada data */}
        {bookings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <Receipt className="w-12 h-12 mb-3 opacity-40" />
            <p className="text-lg font-medium">No bookings found</p>
            <p className="text-sm">Your bookings will appear here</p>
          </div>
        )}

        {/* Kondisi: ada data */}
        {bookings.length > 0 && (
          <>
            <div className="space-y-4">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="border rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between gap-4 shadow-sm"
                >
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <div className="relative w-28 h-20 rounded-lg overflow-hidden border">
                      <Image
                        src={b.room.images[0]}
                        alt={b.room.name}
                        fill
                        sizes="112px" // atau "120px"
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold">{b.room.hotel.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {b.room.name} · {b.room.capacity} Guests
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {formatDate(b.checkIn)} → {formatDate(b.checkOut)}
                      </div>
                      <Badge
                        className={cn(
                          b.status === "CONFIRMED" && "bg-green-500",
                          b.status === "PENDING" && "bg-yellow-500",
                          b.status === "CANCELLED" && "bg-red-500",
                          b.status === "COMPLETED" && "bg-blue-500"
                        )}
                      >
                        {b.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <BookedRoomDetail room={b.room} />
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            <div className="pt-6">
              <PaginationTable
                pagination={pagination}
                basePath="/user/bookings"
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
