// hooks/use-work-experience-query.tsx
"use client";

import {
  addWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
  getWorkExperienceList,
  type WorkExperience,
} from "@/lib/api/work-experience";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Get work experience list query
export function useWorkExperienceListQuery() {
  return useQuery({
    queryKey: ["workExperience"],
    queryFn: getWorkExperienceList,
  });
}

// Add work experience mutation
export function useAddWorkExperienceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WorkExperience) => addWorkExperience(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workExperience"] });
      toast.success("Work experience added successfully!");
    },
    onError: (error: Error) => {
      console.error("Error adding work experience:", error);
    },
  });
}

// Update work experience mutation
export function useUpdateWorkExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: WorkExperience) => updateWorkExperience(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workExperience"] });
      toast.success("Work experience updated successfully!");
    },
    onError: (error: Error) => {
      console.error("Error updating work experience:", error);
    },
  });
}

// Delete work experience mutation
export function useDeleteWorkExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteWorkExperience(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workExperience"] });
      toast.success("Work experience deleted successfully!");
    },
    onError: (error: Error) => {
      console.error("Error deleting work experience:", error);
    },
  });
}

// Optimistic updates hooks
export function useAddWorkExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: WorkExperience) => addWorkExperience(data),
    onError: (error: Error) => {
      console.error("Error adding work experience:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workExperience"] });
      toast.success("Work experience added successfully!");
    },
  });
}
