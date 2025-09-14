"use client";

import {
  List,
  SearchX,
  MapPin,
  Grid3X3,
  Calendar,
  Hotel as HotelIcon,
  Star,
} from "lucide-react";
import Link from "next/link";
import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { locationOptions, sortOptions } from "@/lib/constant";
import { SelectDateForm, DateForm } from "./select-date-form";
import { SelectFilter } from "@/components/shared/select-filter";
import { PaginationCard } from "@/components/shared/pagination-card";
import { Hotels, HotelsParams, MetaPagination } from "@/lib/actions/hotels";

interface HotelsListPreviewProps {
  hotels: Hotels[];
  meta: MetaPagination;
  params?: HotelsParams;
}

export const HotelsListPreview: React.FC<HotelsListPreviewProps> = ({
  hotels,
  meta,
  params,
}) => {
  const router = useRouter();

  const q = params?.q;
  const location = params?.location;
  const startDate = params?.startDate || "";
  const endDate = params?.endDate || "";
  const sort = params?.sort || "newest";
  const page = meta.page;
  const limit = meta.limit;

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
    params.set("page", meta.page.toString());
    params.set("limit", meta.limit.toString());

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
    router.push(buildUrl({ q: search, page: 1 }));
  };

  const handleSort = (value: string) => {
    router.push(buildUrl({ sort: value, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    router.push(buildUrl({ page: newPage }));
  };

  const clearFilters = () => {
    router.push(
      `/hotels?page=1&limit=${limit}&sort=newest${
        startDate ? `&startDate=${startDate}` : ""
      }${endDate ? `&endDate=${endDate}` : ""}`
    );
  };

  const handleSelectDate = async (data: DateForm) => {
    setDialogOpen(false);
    router.push(
      buildUrl({
        q: q!,
        startDate: data.startDate,
        endDate: data.endDate,
        location: location!,
        page: page,
        sort: sort,
        limit: meta.limit,
      })
    );
  };

  // Empty State dengan background landscape
  const EmptyState = () => {
    if (meta.total === 0 && !q && !location && !startDate && !endDate) {
      return (
        <div className="relative overflow-hidden rounded-3xl">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/70 to-emerald-900/80"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center py-20 text-center space-y-6 text-white">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
              <HotelIcon className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Belum Ada Hotel Tersedia
              </h2>
              <p className="text-white/80 max-w-md">
                Saat ini belum ada hotel yang tersedia di sistem. Silakan coba
                lagi nanti.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Empty Results dengan tropical background
    return (
      <div className="relative overflow-hidden rounded-3xl">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900/80 via-red-900/70 to-pink-900/80"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center py-20 text-center space-y-6 text-white">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
            <SearchX className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Hotel Tidak Ditemukan</h2>
            <p className="text-white/80 max-w-md mb-6">
              Coba sesuaikan pencarian atau filter Anda untuk menemukan hotel
              yang cocok.
            </p>
            <Button
              onClick={clearFilters}
              className="bg-white/20 backdrop-blur-md hover:bg-white/30 border border-white/30"
            >
              Reset Filter
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <SelectDateForm open={dialogOpen} onOpenChange={handleSelectDate} />

      <div className="flex gap-8">
        {/* Enhanced Left Sidebar - Filters */}
        <div className="w-80 flex-shrink-0">
          <div className="relative overflow-hidden rounded-3xl shadow-xl sticky top-4">
            {/* Filter Background */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1464822759844-d150baec0200?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-blue-900/85 to-emerald-900/90"></div>
            </div>

            <div className="relative z-10 p-6 space-y-6 text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <span>🔍</span>
                </div>
                <h3 className="text-lg font-bold">Filter Hotel</h3>
              </div>

              {/* Date Filter */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Tanggal Menginap
                </h4>
                {startDate && endDate && (
                  <div className="p-3 bg-white/15 backdrop-blur-sm rounded-xl border border-white/20">
                    <div className="flex items-center gap-2 text-sm">
                      <span>📅</span>
                      <span>
                        {formatDate(startDate)} - {formatDate(endDate)}
                      </span>
                    </div>
                  </div>
                )}
                <Button
                  size="sm"
                  onClick={() => setDialogOpen(true)}
                  className="w-full bg-blue-500/80 hover:bg-blue-600/90 border-0 backdrop-blur-sm"
                >
                  Ubah Tanggal
                </Button>
              </div>

              {/* Location Filter */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Lokasi
                </h4>
                <div className="backdrop-blur-sm rounded-xl border border-white/20">
                  <SelectFilter
                    options={locationOptions}
                    placeholder="Pilih lokasi"
                    initialValue={location}
                    onChange={(value) =>
                      router.push(buildUrl({ location: value, page: 1 }))
                    }
                  />
                </div>
              </div>

              {/* Active Filters */}
              {(location || q) && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Filter Aktif</h4>
                  <div className="flex flex-wrap gap-2">
                    {location && (
                      <Badge className="bg-emerald-500/80 backdrop-blur-sm text-white border-0">
                        <MapPin className="w-3 h-3 mr-1" />
                        {location}
                      </Badge>
                    )}
                    {q && (
                      <Badge className="bg-blue-500/80 backdrop-blur-sm text-white border-0">
                        Pencarian: {q}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-xs w-full text-white hover:bg-white/20"
                  >
                    Hapus Semua Filter
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Right Content Area */}
        <div className="flex-1 space-y-6">
          {/* Search, Sort, and View Options */}
          <div className="relative overflow-hidden rounded-3xl shadow-xl">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-blue-50/90 to-cyan-50/95 dark:from-slate-900/95 dark:via-slate-800/90 dark:to-slate-900/95"></div>
            </div>

            <div className="relative z-10 p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                {/* Search */}
                <form onSubmit={handleSearch} className="flex gap-3">
                  <Input
                    name="q"
                    placeholder="Cari hotel impian Anda..."
                    defaultValue={q}
                    className="w-64 bg-white/50 backdrop-blur-sm border-white/50"
                  />
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                  >
                    🔍 Cari
                  </Button>
                </form>

                {/* Sort and View Options */}

                <div className="flex gap-3 items-center">
                  <SelectFilter
                    initialValue={sort}
                    onChange={handleSort}
                    options={sortOptions}
                  />

                  {/* View Mode Toggle */}
                  <div className="flex border rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm">
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
              <div className="mt-4 text-sm text-muted-foreground font-medium">
                {meta.total === 0
                  ? "Tidak ada hotel ditemukan"
                  : `Menampilkan ${hotels.length} dari ${meta.total} hotel`}
              </div>
            </div>
          </div>

          {/* Hotel Grid/List / Empty */}
          {hotels.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hotels.map((hotel) => (
                    <Card
                      key={hotel.id}
                      className="group p-0 hover:shadow-2xl transition-all duration-500 border-0 rounded-3xl overflow-hidden hover:scale-105 bg-white dark:bg-slate-900"
                    >
                      <CardContent className="p-0 flex flex-col">
                        <div className="relative overflow-hidden">
                          <img
                            src={hotel.thumbnail}
                            alt={hotel.name}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                          <Badge
                            className={cn(
                              "absolute top-3 right-3 backdrop-blur-md border-white/30",
                              hotel.availableRooms > 0
                                ? "bg-emerald-500/90 text-white"
                                : "bg-red-500/90 text-white"
                            )}
                          >
                            {hotel.availableRooms > 0
                              ? `${hotel.availableRooms} kamar tersedia`
                              : "Tidak tersedia"}
                          </Badge>
                        </div>

                        <div className="p-6 flex-1">
                          <h2 className="text-xl font-bold mb-2 group-hover:text-emerald-600 transition-colors">
                            {hotel.name}
                          </h2>
                          <p className="text-muted-foreground text-sm mb-3 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-emerald-500" />
                            {hotel.address}
                          </p>
                          {hotel.description && (
                            <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                              {hotel.description}
                            </p>
                          )}
                        </div>

                        <div className="px-6 pb-6">
                          <Button
                            className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300"
                            asChild
                            disabled={hotel.availableRooms === 0}
                          >
                            <Link
                              href={`/hotels/${hotel.id}${
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
                                ? "🏨 Lihat Kamar Tersedia"
                                : "Tidak Tersedia"}
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {hotels.map((hotel) => (
                    <Card
                      key={hotel.id}
                      className="group hover:shadow-2xl transition-all duration-500 border-0 rounded-3xl overflow-hidden hover:scale-[1.02] bg-white dark:bg-slate-900"
                    >
                      <CardContent className="p-6">
                        <div className="flex gap-6">
                          <div className="relative w-64 h-40 flex-shrink-0 overflow-hidden rounded-2xl">
                            <img
                              src={hotel.thumbnail}
                              alt={hotel.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <Badge
                              className={cn(
                                "absolute top-3 right-3 backdrop-blur-md",
                                hotel.availableRooms > 0
                                  ? "bg-emerald-500/90 text-white"
                                  : "bg-red-500/90 text-white"
                              )}
                            >
                              {hotel.availableRooms > 0
                                ? `${hotel.availableRooms} kamar`
                                : "Tidak tersedia"}
                            </Badge>
                          </div>

                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <h2 className="text-2xl font-bold mb-2 group-hover:text-emerald-600 transition-colors">
                                {hotel.name}
                              </h2>
                              <p className="text-muted-foreground mb-3 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-emerald-500" />
                                {hotel.address}
                              </p>

                              {/* Rating */}
                              <div className="flex items-center gap-1 mb-3">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                  />
                                ))}
                                <span className="text-sm text-muted-foreground ml-2">
                                  4.8 (128 ulasan)
                                </span>
                              </div>

                              {hotel.description && (
                                <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                                  {hotel.description}
                                </p>
                              )}
                            </div>

                            <div className="flex justify-end mt-4">
                              <Button
                                asChild
                                disabled={hotel.availableRooms === 0}
                                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                              >
                                <Link
                                  href={`/hotels/${hotel.id}${
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
                                    ? "🏨 Lihat Kamar Tersedia"
                                    : "Tidak Tersedia"}
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

              <PaginationCard meta={meta} onPageChange={handlePageChange} />
            </>
          )}
        </div>
      </div>
    </>
  );
};
