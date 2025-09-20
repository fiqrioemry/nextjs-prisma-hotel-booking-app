import { useQuery } from "@tanstack/react-query";

export function useDashboard() {
  const query = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => fetch(`/api/admin/dashboard`).then((r) => r.json()),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  return { ...query };
}
