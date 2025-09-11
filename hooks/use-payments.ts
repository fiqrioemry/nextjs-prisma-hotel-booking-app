import qs from "qs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PaymentQuery } from "@/lib/actions/payments";

// -------------------- GET PAYMENTS --------------------
export function usePayments({ filters }: { filters: PaymentQuery }) {
  const params = qs.stringify(filters, { skipNulls: true });
  return useQuery({
    queryKey: ["payments", filters],
    queryFn: () => fetch(`/api/payments?${params}`).then((r) => r.json()),
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
      const res = await fetch(`/api/payments`, {
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
      const res = await fetch(`/api/payments/${id}`, {
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
      const res = await fetch(`/api/payments/${id}`, { method: "DELETE" });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}
