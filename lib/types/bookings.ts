import { RoomDetail } from "./rooms";

export type BookingParams = {
  q?: string;
  page: number;
  limit: number;
  sort: "newest" | "oldest";
  status?: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "ALL";
};

type User = {
  id: string;
  name: string;
  email: string;
};

export type Booking = {
  id: string;
  user: User;
  room: RoomDetail;
  quantity: number;
  checkIn: Date;
  checkOut: Date;
};

export type MyBooking = {
  id: string;
  name: string;
  thumbnail: string;
  quantity: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  checkIn: Date;
  checkOut: Date;
  createdAt: Date;
  room: RoomDetail;
};
