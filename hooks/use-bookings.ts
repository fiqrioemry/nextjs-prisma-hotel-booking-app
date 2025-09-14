import qs from "qs";
import { BookingParams } from "@/lib/actions/bookings";
import { BookForm } from "@/components/hotel-detail/book-room-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// -------------------- GET BOOKINGS --------------------
export function useBookings({ params }: { params: BookingParams }) {
  const queryString = qs.stringify(params, { skipNulls: true });
  return useQuery({
    queryKey: ["bookings", queryString],
    queryFn: () =>
      fetch(`/api/admin/bookings?${queryString}`).then((r) => r.json()),
  });
}

// -------------------- GET BOOKING BY ID --------------------
export function useBooking(id: string) {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => fetch(`/api/admin/bookings/${id}`).then((r) => r.json()),
    enabled: !!id,
  });
}

// -------------------- UPDATE BOOKING STATUS --------------------
export function useUpdateBooking(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (status: string) => {
      const res = await fetch(`/api/admin/bookings/${id}`, {
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
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "DELETE",
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

// -------------------- CREATE BOOKING --------------------
export function useBookingWithPayment() {
  return useMutation({
    mutationFn: async (payload: BookForm) => {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_BETTER_AUTH_SECRET}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData);
        throw new Error(errorData.error || "Booking failed");
      }

      return res.json();
    },
  });
}
