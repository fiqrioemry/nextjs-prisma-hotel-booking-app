"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface PaginationCardProps {
  meta: {
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  onPageChange: (page: number) => void;
}

export const PaginationCard: React.FC<PaginationCardProps> = ({
  meta,
  onPageChange,
}) => {
  if (meta.totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 mt-6">
      <Button
        variant="outline"
        disabled={!meta.hasPrevPage}
        onClick={() => onPageChange(meta.page - 1)}
      >
        Previous
      </Button>

      <span className="text-sm">
        Page {meta.page} of {meta.totalPages}
      </span>

      <Button
        variant="outline"
        disabled={!meta.hasNextPage}
        onClick={() => onPageChange(meta.page + 1)}
      >
        Next
      </Button>
    </div>
  );
};
