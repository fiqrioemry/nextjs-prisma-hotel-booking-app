"use client";

import React from "react";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";
import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useMyBookings } from "@/hooks/use-my";
import type { MyBooking } from "@/lib/types/bookings";
import { BookedRoomDetail } from "./booked-room-detail";
import { Calendar, Hotel, Receipt } from "lucide-react";
import UserBookingsLoading from "./user-bookings-loading";
import { PaginationTable } from "@/components/shared/pagination-table";

export const UserBookingsLists = () => {
  const { data, isFetching } = useMyBookings();

  if (isFetching) return <UserBookingsLoading />;

  const bookings = data?.data || [];
  const pagination = data?.pagination;

  return (
    <Card className="p-0">
      <CardHeader className="pt-4">
        <CardTitle className="flex items-center gap-2">
          <Hotel className="h-8 w-8" />
          Daftar Pemesanan
          {/* My Bookings */}
        </CardTitle>
        <CardDescription>
          Riwayat pemesanan kamu di Pesan Hotel
          {/* Your Pesan Hotels and reservation history */}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-4 border-t">
        {/* when no booking exists */}
        {bookings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <Receipt className="w-12 h-12 mb-3 opacity-40" />
            <p className="text-lg font-medium">
              Riwayat Tidak Ditemukan
              {/* No bookings found */}
            </p>
            <p className="text-sm">
              Pesanan kamu akan tampil disini
              {/* Your bookings will appear here */}
            </p>
          </div>
        )}

        {/* when booking exist */}
        {bookings.length > 0 && (
          <>
            <BookingLists bookings={bookings} />
            {/* pagination table */}
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

const BookingLists = ({ bookings }: { bookings: MyBooking[] }) => {
  return (
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
                src={b.thumbnail}
                alt={b.name}
                className="object-cover w-full h-full"
                fill
                sizes="(max-width: 640px) 100vw, 28rem"
                priority
              />
            </div>
            <div className="space-y-1">
              <p className="font-semibold">{b.name}</p>
              <p className="text-sm text-muted-foreground">
                {b.room.name} · {b.room.capacity} Guests
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {formatDate(b.checkIn.toString())} →{" "}
                {formatDate(b.checkOut.toString())}
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
  );
};
