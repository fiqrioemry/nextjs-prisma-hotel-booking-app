import qs from "qs";
import { PaymentParams } from "@/lib/types/payments";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// -------------------- GET PAYMENTS --------------------
export function usePayments({ params }: { params: PaymentParams }) {
  const queryString = qs.stringify(params, { skipNulls: true });
  return useQuery({
    queryKey: ["payments", params],
    queryFn: () =>
      fetch(`/api/admin/payments?${queryString}`).then((r) => r.json()),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

// -------------------- GET PAYMENT BY ID --------------------
export function usePayment(id: string) {
  return useQuery({
    queryKey: ["payment", id],
    queryFn: () => fetch(`/api/payments/${id}`).then((r) => r.json()),
    enabled: !!id,
  });
}

// -------------------- CREATE PAYMENT --------------------
export function useCreatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`/api/admin/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}

// -------------------- UPDATE PAYMENT STATUS --------------------
export function useUpdatePayment(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (status: string) => {
      const res = await fetch(`/api/admin/payments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["payment", id] });
    },
  });
}

// -------------------- DELETE PAYMENT --------------------
export function useDeletePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/payments/${id}`, {
        method: "DELETE",
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}
