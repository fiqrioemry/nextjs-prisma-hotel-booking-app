import { Room, RoomDetail } from "@/lib/types/rooms";

export interface HotelsParams {
  q?: string;
  location?: string;
  endDate?: string;
  startDate?: string;
  page: number;
  limit: number;
  sort: "newest" | "oldest" | "available_rooms";
}

export interface HotelDetailParams {
  hotelId: string;
  startDate?: string;
  endDate?: string;
}

export type MyBooking = {
  id: string;
  name: string;
  thumbnail: string;
  quantity: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  checkIn: Date;
  checkOut: Date;
  createdAt: Date;
  room: Room;
};

export type MetaPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type CreateHotelData = {
  name: string;
  address: string;
  description: string;
  thumbnail: File;
  location: string;
};

// for user view
export interface HotelDetail {
  id: string;
  name: string;
  address: string;
  thumbnail: string;
  description: string;
  createdAt: Date;
  rooms: RoomDetail[];
}

export interface Hotels {
  id: string;
  name: string;
  address: string;
  thumbnail: string;
  description: string;
  availableRooms?: number;
  createdAt: Date;
}

// for admin view
export interface AdminHotelDetails {
  id: string;
  name: string;
  address: string;
  thumbnail: string;
  description: string;
  totalRooms?: number;
  totalUnits?: number;
  totalBookings?: number;
  confirmedBookings?: number;
  pendingBookings?: number;
  completedBookings?: number;
  canceledBookings?: number;
  totalRevenue?: number;
  createdAt: Date;
  rooms: Room[];
}
