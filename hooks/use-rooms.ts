import qs from "qs";
import { toast } from "sonner";
import { RoomsParams } from "@/lib/actions/rooms";
import { AddRoomForm } from "@/components/admin/add-room-form";
import { EditRoomForm } from "@/components/admin/edit-room-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useTypes() {
  return useQuery({
    queryKey: ["types"],
    queryFn: () => fetch(`/api/rooms/types`).then((r) => r.json()),
  });
}

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

// CREATE NEW ROOM
export function useCreateRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AddRoomForm) => {
      const res = await fetch(`/api/admin/rooms`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: (res) => {
      console.log(res);
      // Revalidate rooms by hotel id as key
      queryClient.invalidateQueries({ queryKey: ["hotel", res.room.hotelId] });
      toast.success(res.message || "Room created successfully");
    },

    onError: (res) => {
      console.log(res);
    },
  });
}

export function useUpdateRoom(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: EditRoomForm) => {
      const res = await fetch(`/api/admin/rooms/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["hotel", res.room.hotelId] });
      toast.success(res.message || "Room updated successfully");
      return true;
    },
    onError: (res) => {
      console.log(res);
      return false;
    },
  });
}

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
