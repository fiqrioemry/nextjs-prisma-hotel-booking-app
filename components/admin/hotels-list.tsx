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
import { useHotels } from "@/hooks/use-hotels";
import { Button } from "@/components/ui/button";
import { Hotel, PlusCircle } from "lucide-react";
import { HotelsParams } from "@/lib/actions/hotels";
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
import { DeleteHotelForm } from "./delete-hotel-form";

export function HotelsList() {
  const [q, setQ] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);
  const [sort, setSort] = React.useState<HotelsParams["sort"]>("newest");

  const {
    data: hotelsData,
    isFetching,
    refetch,
  } = useHotels({
    filters: { q, sort, page, limit, location: "", startDate: "", endDate: "" },
  });

  const hotels = hotelsData?.data ?? [];
  const meta = hotelsData?.meta ?? { page, limit, total: 0, totalPages: 1 };

  function handleResetFilter() {
    setQ("");
    setSort("newest");
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
    setSort(value as HotelsParams["sort"]);
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
            <Hotel className="h-8 w-8" />
            Lists of Hotels
          </h1>
          <p>Manage your hotel listings and reservations</p>
        </div>

        <Button asChild size="sm">
          <Link href="/admin/hotels/new">
            <PlusCircle className="w-4 h-4 mr-2" />
            <span>Add Hotel</span>
          </Link>
        </Button>
      </div>
      <div className="border rounded-md">
        {isEmpty && !isFetching ? (
          <div className="flex flex-col items-center justify-center py-16">
            <span className="text-lg font-semibold text-muted-foreground">
              No Hotels Available
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
                    { label: "Available Rooms", value: "available_rooms" },
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
                  <TableHead>Hotel</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Rooms</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="border-b">
                {isFetching ? (
                  Array.from({ length: limit }).map((_, idx) => (
                    <TableRow key={idx}>
                      <TableCell colSpan={5}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : hotels.length > 0 ? (
                  hotels.map((hotel: any) => (
                    <TableRow key={hotel.id} className="h-12">
                      <TableCell className="flex items-center gap-3">
                        <img
                          src={hotel.thumbnail}
                          alt={hotel.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div className="flex flex-col max-w-32">
                          <span className="font-medium">{hotel.name}</span>
                          <span className="text-xs text-muted-foreground line-clamp-1">
                            {hotel.description}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">{hotel.address}</TableCell>
                      <TableCell>{hotel.rooms?.length || 0} rooms</TableCell>
                      <TableCell>
                        {new Date(hotel.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/hotels/${hotel.id}`}>
                                <Edit className="w-4 h-4 " /> Manage
                              </Link>
                            </DropdownMenuItem>
                            <DeleteHotelForm hotel={hotel} />
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24">
                      <div className="flex flex-col items-center justify-center py-16">
                        <span className="text-lg font-semibold text-muted-foreground mb-2">
                          No Hotel Found
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
