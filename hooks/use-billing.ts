import qs from "qs";
import { useQuery } from "@tanstack/react-query";
import { PaymentQuery, TransactionQuery } from "@/lib/types";

export function useBalance() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["balance"],
    queryFn: () => fetch("/api/balance").then((r) => r.json()),
  });

  return { data, isLoading, refetch };
}

export function usePayments({ filters }: { filters: PaymentQuery }) {
  const params = qs.stringify(filters, { skipNulls: true });
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["payments", filters],
    queryFn: () => fetch(`/api/payments?${params}`).then((r) => r.json()),
  });

  return { data, isLoading, refetch };
}

export function useTransactions({ filters }: { filters: TransactionQuery }) {
  const params = qs.stringify(filters, { skipNulls: true });
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["transactions", filters],
    queryFn: () => fetch(`/api/transactions?${params}`).then((r) => r.json()),
  });

  return { data, isLoading, refetch };
}

import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useTopup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amount: number) => {
      const res = await fetch("/api/balance/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      if (!res.ok) throw new Error("Failed to top up");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}
