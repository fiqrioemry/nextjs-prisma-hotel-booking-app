import qs from "qs";
import { BookingQuery } from "@/lib/actions/bookings";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// -------------------- GET BOOKINGS --------------------
export function useBookings({ filters }: { filters: BookingQuery }) {
  const params = qs.stringify(filters, { skipNulls: true });
  return useQuery({
    queryKey: ["bookings", filters],
    queryFn: () => fetch(`/api/bookings?${params}`).then((r) => r.json()),
  });
}

// -------------------- GET BOOKING BY ID --------------------
export function useBooking(id: string) {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => fetch(`/api/bookings/${id}`).then((r) => r.json()),
    enabled: !!id,
  });
}

// -------------------- CREATE BOOKING --------------------
export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

// -------------------- UPDATE BOOKING STATUS --------------------
export function useUpdateBooking(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (status: string) => {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking", id] });
    },
  });
}

// -------------------- DELETE BOOKING --------------------
export function useDeleteBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

type BookingPayload = {
  roomId: string;
  checkIn: string; // format ISO (e.g. "2025-09-20")
  checkOut: string; // format ISO
};

type BookingWithPaymentResponse = {
  success: boolean;
  message: string;
  booking?: {
    id: string;
    roomId: string;
    userId: string;
    checkIn: string;
    checkOut: string;
    status: string;
  };
  payment?: {
    id: string;
    invoiceNo: string;
    redirectUrl: string;
    token: string;
  };
};

export function useBookingWithPayment() {
  return useMutation<BookingWithPaymentResponse, Error, BookingPayload>({
    mutationFn: async (payload: BookingPayload) => {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Booking failed");
      }

      return res.json();
    },
  });
}
