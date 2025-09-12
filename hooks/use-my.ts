import { useQuery } from "@tanstack/react-query";

// -------------------- GET MY BOOKINGS --------------------
export function useMyBookings() {
  return useQuery({
    queryKey: ["my-bookings"],
    queryFn: () => fetch("/api/my/bookings").then((r) => r.json()),
  });
}

// -------------------- GET MY PAYMENTS --------------------
export function useMyPayments() {
  return useQuery({
    queryKey: ["my-payments"],
    queryFn: () => fetch("/api/my/payments").then((r) => r.json()),
  });
}
