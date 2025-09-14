"use client";

import React from "react";
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableCaption,
} from "@/components/ui/table";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Book, PlusCircle } from "lucide-react";
import { BookingParams } from "@/lib/actions/bookings";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/shared/pagination";
import { SearchInput } from "@/components/shared/search-input";
import { SelectFilter } from "@/components/shared/select-filter";
import {
  Eye,
  Edit,
  Trash2,
  RotateCcw,
  Filter,
  MoreHorizontal,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { formatRupiah } from "@/lib/utils";
import { useBookings } from "@/hooks/use-bookings";

export function BookingsList() {
  const [q, setQ] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);
  const [sort, setSort] = React.useState<BookingParams["sort"]>("newest");
  const [status, setStatus] = React.useState<BookingParams["status"]>("ALL");
  const {
    data: bookingsData,
    isFetching,
    refetch,
  } = useBookings({
    params: { q, sort, page, limit, status },
  });

  const bookings = bookingsData?.data ?? [];
  const meta = bookingsData?.meta ?? { page, limit, total: 0, totalPages: 1 };

  function handleResetFilter() {
    setQ("");
    setSort("newest");
    setStatus("ALL");
    setPage(1);
  }

  function handlePageChange(p: number) {
    setPage(p);
  }

  function handleSearchInput(query: string) {
    setQ(query);
    setPage(1);
  }

  function handleFilterChange(value: string) {
    setSort(value as BookingParams["sort"]);
    setPage(1);
  }

  const handleRefetch = () => {
    refetch();
    toast.success("Hotels refreshed successfully");
  };

  const isFiltered = q !== "" || sort !== "newest";
  const isEmpty = !isFiltered && meta.total === 0;

  return (
    <>
      <div className="flex items-center justify-between py-6 border-b">
        <div className="space-y-2">
          <h1 className="flex items-center gap-2">
            <Book className="h-8 w-8" />
            Lists of Bookings
          </h1>
          <p>Manage your hotel bookings and reservations</p>
        </div>

        <Button asChild size="sm">
          <Link href="/admin/bookings/new">
            <PlusCircle className="w-4 h-4 mr-2" />
            <span>Manually Add Booking</span>
          </Link>
        </Button>
      </div>
      <div className="border rounded-md">
        {isEmpty && !isFetching ? (
          <div className="flex flex-col items-center justify-center py-16">
            <span className="text-lg font-semibold text-muted-foreground">
              No Bookings Available
            </span>
          </div>
        ) : (
          <>
            {/* Feature Bar */}
            <div className="py-4 px-2 flex items-center justify-between">
              <SearchInput
                q={q}
                onChange={handleSearchInput}
                placeholder="search any hotel"
              />

              <div className="flex items-center gap-2">
                <SelectFilter
                  options={[
                    { label: "Newest", value: "newest" },
                    { label: "Oldest", value: "oldest" },
                  ]}
                  initialValue={sort}
                  onChange={handleFilterChange}
                  placeholder="Sort by"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleRefetch}
                  title="Refresh"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Table */}
            <Table>
              <TableCaption className="mt-1">
                {meta.total ? (
                  <Pagination
                    page={meta.page}
                    limit={meta.limit}
                    total={meta.total}
                    onPageChange={handlePageChange}
                  />
                ) : null}
              </TableCaption>
              <TableHeader className="border-t">
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Hotel</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="border-b">
                {isFetching ? (
                  Array.from({ length: limit }).map((_, idx) => (
                    <TableRow key={idx}>
                      <TableCell colSpan={7}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : bookings.length > 0 ? (
                  bookings.map((booking: any) => (
                    <TableRow key={booking.id} className="h-12">
                      {/* User */}
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {booking.user.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {booking.user.email}
                          </span>
                        </div>
                      </TableCell>

                      {/* Room */}
                      <TableCell className="flex items-center gap-3">
                        {booking.room.roomImage && (
                          <img
                            src={booking.room.roomImage}
                            alt={booking.room.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                        )}
                        <div className="flex flex-col max-w-32">
                          <span className="font-medium">
                            {booking.room.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatRupiah(booking.room.price)} / night
                          </span>
                        </div>
                      </TableCell>

                      {/* Hotel */}
                      <TableCell>{booking.room.name}</TableCell>

                      {/* Check In / Check Out */}
                      <TableCell>
                        {new Date(booking.checkIn).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(booking.checkOut).toLocaleDateString()}
                      </TableCell>

                      {/* Quantity */}
                      <TableCell>{booking.quantity}</TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/bookings/${booking.id}`}>
                                <Eye className="w-4 h-4 mr-2" /> View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/bookings/${booking.id}/edit`}>
                                <Edit className="w-4 h-4 mr-2" /> Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24">
                      <div className="flex flex-col items-center justify-center py-16">
                        <span className="text-lg font-semibold text-muted-foreground mb-2">
                          No Bookings Found
                        </span>
                        <Button onClick={handleResetFilter}>
                          <Filter className="mr-1" />
                          Reset Filter
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </>
        )}
      </div>
    </>
  );
}
