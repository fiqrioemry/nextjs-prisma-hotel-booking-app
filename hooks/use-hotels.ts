import qs from "qs";
import { HotelsParams } from "@/lib/actions/hotels";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// -------------------- GET HOTELS --------------------
export function useHotels({ filters }: { filters: HotelsParams }) {
  const params = qs.stringify(filters, { skipNulls: true });

  const query = useQuery({
    queryKey: ["hotels", filters],
    queryFn: () => fetch(`/api/hotels?${params}`).then((r) => r.json()),
  });

  return { ...query };
}

// -------------------- GET HOTEL BY ID --------------------
export function useHotel(id: string) {
  const query = useQuery({
    queryKey: ["hotel", id],
    queryFn: () => fetch(`/api/hotels/${id}`).then((r) => r.json()),
    enabled: !!id,
  });

  return { ...query };
}

// -------------------- CREATE HOTEL --------------------
type CreateHotelInput = {
  name: string;
  address: string;
  description: string;
  thumbnail: string;
};

export function useCreateHotel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateHotelInput) => {
      const res = await fetch(`/api/hotels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
    },
  });
}

// -------------------- UPDATE HOTEL --------------------
type UpdateHotelInput = {
  name: string;
  address: string;
  description: string;
  thumbnail: string;
};

export function useUpdateHotel(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateHotelInput) => {
      const res = await fetch(`/api/hotels/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      queryClient.invalidateQueries({ queryKey: ["hotel", id] });
    },
  });
}

// -------------------- DELETE HOTEL --------------------
export function useDeleteHotel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/hotels/${id}`, {
        method: "DELETE",
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
    },
  });
}
