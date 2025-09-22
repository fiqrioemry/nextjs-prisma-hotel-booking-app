import { Booking } from "./bookings";
import { Hotels } from "./hotels";

export type Room = {
  id: string;
  hotelId: string;
  typeId: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  totalUnits: number;
  availableUnits: number;
  facilities: string[];
  bookings: Booking[];
  images: RoomImage[];
  hotel?: Hotels;
};

export interface RoomImage {
  id: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

export type RoomDetail = {
  id: string;
  typeId: string;
  hotelId: string;
  name: string;
  price: number;
  capacity: number;
  description: string;
  totalUnits: number;
  facilities: string[];
  images: RoomImage[];
  availableUnits: number;
};
