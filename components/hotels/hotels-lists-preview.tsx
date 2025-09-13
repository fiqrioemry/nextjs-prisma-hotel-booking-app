"use client";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";

import {
  List,
  SearchX,
  MapPin,
  Grid3X3,
  Calendar,
  Hotel as HotelIcon,
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { locationOptions } from "@/lib/constant";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { SelectDateForm, DateForm } from "./select-date-form";
import { SelectFilter } from "@/components/shared/select-filter";
import { Hotels, HotelsParams, MetaPagination } from "@/lib/actions/hotels";

interface HotelsListPreviewProps {
  hotels: Hotels[];
  meta: MetaPagination;
  searchParams?: HotelsParams;
}

export const HotelsListPreview: React.FC<HotelsListPreviewProps> = ({
  hotels,
  meta,
  searchParams: initialParamms = {},
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") || initialParamms.q || "";
  const location =
    searchParams.get("location") || initialParamms.location || "";
  const startDate =
    searchParams.get("startDate") || initialParamms.startDate || "";
  const endDate = searchParams.get("endDate") || initialParamms.endDate || "";
  const sort = searchParams.get("sort") || initialParamms.sort || "newest";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "8", 10);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // -------- Helpers --------
  const buildUrl = (updates: Record<string, string | number>) => {
    const params = new URLSearchParams();

    if (q) params.set("q", q);
    if (location) params.set("location", location);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    params.set("sort", sort);
    params.set("page", "1");
    params.set("limit", meta.limit.toString() || "8");

    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value.toString());
      else params.delete(key);
    });

    return `/hotels?${params.toString()}`;
  };

  function normalizeDate(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  useEffect(() => {
    const today = normalizeDate(new Date());
    const defaultStart = today.toISOString().split("T")[0];
    const defaultEnd = new Date(today.getTime() + 86400000)
      .toISOString()
      .split("T")[0];

    let shouldOpenDialog = false;

    if (!startDate || !endDate) {
      shouldOpenDialog = true;
    } else {
      const start = normalizeDate(new Date(startDate));
      const end = normalizeDate(new Date(endDate));

      if (start < today || end <= start) {
        shouldOpenDialog = true;
      }
    }

    if (shouldOpenDialog) {
      setDialogOpen(true);

      // fallback redirect dengan default date
      router.replace(
        buildUrl({
          startDate: defaultStart,
          endDate: defaultEnd,
        })
      );
    }
  }, [startDate, endDate, router]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("q") as string;
    router.push(buildUrl({ q: search, page: 1, limit: 8 }));
  };

  const handleSort = (value: string) => {
    router.push(buildUrl({ sort: value, page: 1, limit: 8 }));
  };

  const handlePageChange = (newPage: number) => {
    router.push(buildUrl({ page: newPage, limit: 8 }));
  };

  const clearFilters = () => {
    // Reset semua filter kecuali tanggal
    router.push(
      `/hotels?page=1&limit=8&sort=newest${
        startDate ? `&startDate=${startDate}` : ""
      }${endDate ? `&endDate=${endDate}` : ""}`
    );
  };

  const handleSelectDate = async (data: DateForm) => {
    setDialogOpen(false);
    router.push(
      buildUrl({
        q: q,
        startDate: data.startDate,
        endDate: data.endDate,
        location: location,
        page: page,
        sort: sort,
        limit: meta.limit,
      })
    );
  };

  // -------- Empty States --------
  const EmptyState = () => {
    if (meta.total === 0 && !q && !location && !startDate && !endDate) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border rounded-md bg-muted/30">
          <HotelIcon className="w-16 h-16 text-muted-foreground" />
          <h2 className="text-xl font-semibold">No hotels available</h2>
          <p className="text-muted-foreground">
            There are currently no hotels in the system.
          </p>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border rounded-md bg-muted/30">
        <SearchX className="w-16 h-16 text-muted-foreground" />
        <h2 className="text-xl font-semibold">No hotels found</h2>
        <p className="text-muted-foreground">
          Try adjusting your search or filters to find what you're looking for.
        </p>
        <Button onClick={clearFilters}>Reset Filters</Button>
      </div>
    );
  };

  return (
    <>
      {/* Date Dialog */}
      <SelectDateForm open={dialogOpen} onOpenChange={handleSelectDate} />

      <div className="p-4 max-w-7xl mx-auto w-full min-h-screen">
        <div className="flex gap-8">
          {/* Left Sidebar - Filters */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-card border rounded-lg p-6 space-y-6 sticky top-4">
              <h3 className="text-lg font-semibold">Filters</h3>

              {/* Date Filter */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Check-in & Check-out</h4>
                {startDate && endDate && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {formatDate(startDate)} - {formatDate(endDate)}
                      </span>
                    </div>
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDialogOpen(true)}
                  className="w-full"
                >
                  Change Dates
                </Button>
              </div>

              {/* Location Filter */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Location</h4>
                <SelectFilter
                  options={locationOptions}
                  placeholder="Select location"
                  initialValue={location}
                  onChange={(value) =>
                    router.push(buildUrl({ location: value, page: 1 }))
                  }
                />
              </div>

              {/* Active Filters (excluding dates) */}
              {(location || q) && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Active Filters</h4>
                  <div className="flex flex-wrap gap-2">
                    {location && (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        <MapPin className="w-3 h-3" />
                        {location}
                      </Badge>
                    )}
                    {q && <Badge variant="secondary">Search: {q}</Badge>}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-xs w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Available Hotels</h1>
              <p className="text-muted-foreground text-lg">
                {startDate && endDate
                  ? `Hotels available from ${formatDate(
                      startDate
                    )} to ${formatDate(endDate)}`
                  : "Browse through our selection of hotels."}
              </p>
            </div>

            {/* Search, Sort, and View Options */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  name="q"
                  placeholder="Search hotels..."
                  defaultValue={q}
                  className="w-64"
                />
                <Button type="submit" variant="secondary">
                  Search
                </Button>
              </form>

              {/* Sort and View Options */}
              <div className="flex gap-2 items-center">
                <Select value={sort} onValueChange={handleSort}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="available_rooms">
                      Most Available
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode Toggle */}
                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Results count */}
            <div className="text-sm text-muted-foreground">
              {meta.total === 0
                ? "No hotels found"
                : `Showing ${hotels.length} of ${meta.total} hotels`}
            </div>

            {/* Hotel Grid/List / Empty */}
            {hotels.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {hotels.map((hotel) => (
                      <Card
                        key={hotel.hotelId}
                        className="bg-card p-0 flex flex-col"
                      >
                        <CardContent className="p-0 flex flex-col flex-1">
                          <div className="relative">
                            <img
                              src={hotel.thumbnail}
                              alt={hotel.hotelName}
                              className="w-full h-48 object-cover"
                            />
                            <Badge
                              variant={
                                hotel.availableRooms > 0
                                  ? "default"
                                  : "destructive"
                              }
                              className="absolute top-2 right-2"
                            >
                              {hotel.availableRooms > 0
                                ? `${hotel.availableRooms} rooms available`
                                : "No availability"}
                            </Badge>
                          </div>
                          <div className="p-4 flex-1">
                            <h2 className="text-xl font-bold mb-1">
                              {hotel.hotelName}
                            </h2>
                            <p className="text-muted-foreground text-sm mb-2 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {hotel.address}
                            </p>
                            {hotel.description && (
                              <p className="text-muted-foreground line-clamp-3 text-sm">
                                {hotel.description}
                              </p>
                            )}
                          </div>
                          <Button
                            className="w-full rounded-none"
                            asChild
                            disabled={hotel.availableRooms === 0}
                          >
                            <Link
                              href={`/hotels/${hotel.hotelId}${
                                startDate && endDate
                                  ? `?startDate=${startDate}&endDate=${endDate}${
                                      location
                                        ? `&location=${encodeURIComponent(
                                            location
                                          )}`
                                        : ""
                                    }`
                                  : location
                                  ? `?location=${encodeURIComponent(location)}`
                                  : ""
                              }`}
                            >
                              {hotel.availableRooms > 0
                                ? "See Available Rooms"
                                : "No Availability"}
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {hotels.map((hotel) => (
                      <Card key={hotel.hotelId} className="bg-card">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <div className="relative w-48 h-32 flex-shrink-0">
                              <img
                                src={hotel.thumbnail}
                                alt={hotel.hotelName}
                                className="w-full h-full object-cover rounded-md"
                              />
                              <Badge
                                variant={
                                  hotel.availableRooms > 0
                                    ? "default"
                                    : "destructive"
                                }
                                className="absolute top-2 right-2"
                              >
                                {hotel.availableRooms > 0
                                  ? `${hotel.availableRooms} rooms`
                                  : "No availability"}
                              </Badge>
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <h2 className="text-xl font-bold mb-1">
                                  {hotel.hotelName}
                                </h2>
                                <p className="text-muted-foreground text-sm mb-2 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {hotel.address}
                                </p>
                                {hotel.description && (
                                  <p className="text-muted-foreground text-sm line-clamp-2">
                                    {hotel.description}
                                  </p>
                                )}
                              </div>
                              <div className="flex justify-end">
                                <Button
                                  asChild
                                  disabled={hotel.availableRooms === 0}
                                  className="w-fit"
                                >
                                  <Link
                                    href={`/hotels/${hotel.hotelId}${
                                      startDate && endDate
                                        ? `?startDate=${startDate}&endDate=${endDate}${
                                            location
                                              ? `&location=${encodeURIComponent(
                                                  location
                                                )}`
                                              : ""
                                          }`
                                        : location
                                        ? `?location=${encodeURIComponent(
                                            location
                                          )}`
                                        : ""
                                    }`}
                                  >
                                    {hotel.availableRooms > 0
                                      ? "See Available Rooms"
                                      : "No Availability"}
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {meta.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-6">
                    <Button
                      variant="outline"
                      disabled={page <= 1}
                      onClick={() => handlePageChange(page - 1)}
                    >
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {meta.page} of {meta.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      disabled={page >= meta.totalPages}
                      onClick={() => handlePageChange(page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
