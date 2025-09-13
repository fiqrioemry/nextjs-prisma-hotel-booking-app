"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  SearchX,
  Hotel as HotelIcon,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Grid3X3,
  List,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

type Hotel = {
  id: string;
  name: string;
  address: string;
  description: string;
  thumbnail: string;
  status: "active" | "inactive";
  rooms?: Array<any>;
  createdAt: string;
  updatedAt: string;
};

export const HotelsList = ({
  hotels,
  meta,
}: {
  hotels: any[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    hotel: any | null;
  }>({ open: false, hotel: null });

  console.log("Hotels:", hotels);

  const q = searchParams.get("q") || "";
  const sort = searchParams.get("sort") || "newest";
  const status = searchParams.get("status") || "all";
  const page = parseInt(searchParams.get("page") || "1", 10);

  // Handle search
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("q") as string;
    router.push(
      `/admin/hotels?q=${encodeURIComponent(
        search
      )}&sort=${sort}&status=${status}&page=1&limit=${meta.limit}`
    );
  };

  // Handle sort
  const handleSort = (value: string) => {
    router.push(
      `/admin/hotels?q=${encodeURIComponent(
        q
      )}&sort=${value}&status=${status}&page=1&limit=${meta.limit}`
    );
  };

  // Handle status filter
  const handleStatusFilter = (value: string) => {
    router.push(
      `/admin/hotels?q=${encodeURIComponent(
        q
      )}&sort=${sort}&status=${value}&page=1&limit=${meta.limit}`
    );
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    router.push(
      `/admin/hotels?q=${encodeURIComponent(
        q
      )}&sort=${sort}&status=${status}&page=${newPage}&limit=${meta.limit}`
    );
  };

  // Handle delete
  const handleDelete = async (hotel: Hotel) => {
    try {
      const response = await fetch(`/api/admin/hotels/${hotel.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
        setDeleteDialog({ open: false, hotel: null });
      } else {
        // Handle error
        console.error("Failed to delete hotel");
      }
    } catch (error) {
      console.error("Error deleting hotel:", error);
    }
  };

  // Empty State Component
  const EmptyState = () => {
    if (meta.total === 0 && q === "" && status === "all") {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border rounded-md bg-muted/30">
          <HotelIcon className="w-16 h-16 text-muted-foreground" />
          <h2 className="text-xl font-semibold">No hotels available</h2>
          <p className="text-muted-foreground">
            Get started by adding your first hotel to the system.
          </p>
          <Button asChild>
            <Link href="/admin/hotels/new">
              <Plus className="w-4 h-4 mr-2" />
              Add First Hotel
            </Link>
          </Button>
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
        <Button
          onClick={() =>
            router.push("/admin/hotels?page=1&limit=10&sort=newest&status=all")
          }
        >
          Reset Filters
        </Button>
      </div>
    );
  };

  // Table View Component
  const TableView = () => (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Hotel</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Rooms</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hotels.map((hotel) => (
            <TableRow key={hotel.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <img
                    src={hotel.thumbnail}
                    alt={hotel.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div>
                    <div className="font-medium">{hotel.name}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {hotel.description}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">{hotel.address}</div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={hotel.status === "active" ? "default" : "secondary"}
                >
                  {hotel.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {hotels[1]?.rooms?.length || 0} rooms
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {new Date(hotel.createdAt).toLocaleDateString()}
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/hotels/${hotel.id}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/hotels/${hotel.id}/edit`}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Hotel
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => setDeleteDialog({ open: true, hotel })}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Hotel
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );

  // Grid View Component
  const GridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {hotels.map((hotel) => (
        <Card key={hotel.id} className="overflow-hidden">
          <div className="relative">
            <img
              src={hotel.thumbnail}
              alt={hotel.name}
              className="w-full h-48 object-cover"
            />
            <Badge
              className="absolute top-2 right-2"
              variant={hotel.status === "active" ? "default" : "secondary"}
            >
              {hotel.status}
            </Badge>
          </div>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{hotel.name}</h3>
                <p className="text-sm text-muted-foreground">{hotel.address}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/hotels/${hotel.id}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/hotels/${hotel.id}/edit`}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Hotel
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => setDeleteDialog({ open: true, hotel })}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Hotel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {hotel.description}
            </p>
            <div className="text-sm text-muted-foreground">
              {hotel.rooms?.length || 0} rooms • Created{" "}
              {new Date(hotel.createdAt).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Hotels Management</h1>
          <p className="text-muted-foreground">
            Manage your hotels and their information
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/hotels/new">
            <Plus className="w-4 h-4 mr-2" />
            Add New Hotel
          </Link>
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1">
            <Input
              name="q"
              placeholder="Search hotels..."
              defaultValue={q}
              className="max-w-sm"
            />
            <Button type="submit" variant="secondary">
              Search
            </Button>
          </form>

          <div className="flex gap-2 items-center">
            <Select value={sort} onValueChange={handleSort}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Results Summary */}
      {hotels.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Showing {(page - 1) * meta.limit + 1} to{" "}
          {Math.min(page * meta.limit, meta.total)} of {meta.total} hotels
        </div>
      )}

      {/* Hotels List */}
      {hotels.length === 0 ? (
        <EmptyState />
      ) : viewMode === "table" ? (
        <TableView />
      ) : (
        <GridView />
      )}

      {/* Pagination */}
      {hotels.length > 0 && (
        <div className="flex justify-center items-center gap-4">
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, hotel: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Hotel</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteDialog.hotel?.name}"? This
              action cannot be undone and will also remove all associated rooms
              and bookings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteDialog.hotel && handleDelete(deleteDialog.hotel)
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Hotel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
