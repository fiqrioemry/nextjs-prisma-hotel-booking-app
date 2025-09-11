import qs from "qs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RoomsParams } from "@/lib/actions/rooms";

// -------------------- GET ROOMS --------------------
export function useRooms({ filters }: { filters: RoomsParams }) {
  const params = qs.stringify(filters, { skipNulls: true });
  return useQuery({
    queryKey: ["rooms", filters],
    queryFn: () => fetch(`/api/rooms?${params}`).then((r) => r.json()),
  });
}

// -------------------- GET ROOM BY ID --------------------
export function useRoom(id: string) {
  return useQuery({
    queryKey: ["room", id],
    queryFn: () => fetch(`/api/rooms/${id}`).then((r) => r.json()),
    enabled: !!id,
  });
}

// -------------------- CREATE ROOM --------------------
export function useCreateRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: FormData) => {
      const res = await fetch(`/api/rooms`, {
        method: "POST",
        body: data,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}

// -------------------- UPDATE ROOM --------------------
export function useUpdateRoom(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: FormData) => {
      const res = await fetch(`/api/rooms/${id}`, {
        method: "PUT",
        body: data,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room", id] });
    },
  });
}

// -------------------- DELETE ROOM --------------------
export function useDeleteRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/rooms/${id}`, { method: "DELETE" });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}
