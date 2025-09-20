import { useQuery } from "@tanstack/react-query";

export function useMyBookings() {
  return useQuery({
    queryKey: ["my-bookings"],
    queryFn: () => fetch("/api/user/bookings").then((r) => r.json()),
    gcTime: 1000 * 60 * 10,
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
}

export function useMyPayments() {
  return useQuery({
    queryKey: ["my-payments"],
    queryFn: () => fetch("/api/user/payments").then((r) => r.json()),
    gcTime: 1000 * 60 * 10,
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
}
