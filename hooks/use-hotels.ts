import qs from "qs";
import { HotelsParams } from "@/lib/actions/hotels";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EditHotelForm } from "@/components/admin/edit-hotel-form";
import { toast } from "sonner";
import { AddHotelForm } from "@/app/admin/hotels/new/page";

// -------------------- GET HOTELS --------------------
export function useHotels({ filters }: { filters: HotelsParams }) {
  const params = qs.stringify(filters, { skipNulls: true });

  const query = useQuery({
    queryKey: ["hotels", filters],
    queryFn: () => fetch(`/api/admin/hotels?${params}`).then((r) => r.json()),
  });

  return { ...query };
}

export function useHotel({ id }: { id: string }) {
  const query = useQuery({
    queryKey: ["hotel", id],
    queryFn: () => fetch(`/api/admin/hotels/${id}`).then((r) => r.json()),
  });

  return { ...query };
}

export function useCreateHotel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddHotelForm) => {
      const res = await fetch(`/api/admin/hotels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      toast.success(res.message || "Hotel created successfully");
    },
    onError: (res) => {
      console.log(res);
      toast.error(res.message || "Failed to create hotel");
    },
  });
}

export function useUpdateHotel(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: EditHotelForm) => {
      const res = await fetch(`/api/admin/hotels/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["hotel", id] });
      toast.success(res.message || "Hotel updated successfully");
    },
    onError: (res) => {
      console.log(res);
      toast.error(res.message || "Failed to update hotel");
    },
  });
}

export function useDeleteHotel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/hotels/${id}`, {
        method: "DELETE",
      });
      return res.json();
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      toast.success(res.message || "Hotel deleted successfully");
    },
    onError: (res) => {
      console.log(res);
      toast.error(res.message || "Failed to delete hotel");
    },
  });
}
