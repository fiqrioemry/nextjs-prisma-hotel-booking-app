"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import React from "react";

type PaginationProps = {
  pagination: {
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  basePath?: string; // contoh: "/user/bookings"
};

export function PaginationTable({
  pagination,
  basePath = "",
}: PaginationProps) {
  if (pagination.totalPages <= 1) return null; // hide jika cuma 1 halaman

  return (
    <Pagination>
      <PaginationContent>
        {/* Prev */}
        <PaginationItem>
          <PaginationPrevious
            href={`${basePath}?page=${pagination.page - 1}`}
            aria-disabled={!pagination.hasPrevPage}
            className={cn(
              !pagination.hasPrevPage && "pointer-events-none opacity-50"
            )}
          />
        </PaginationItem>

        {/* Page numbers */}
        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
          (page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href={`${basePath}?page=${page}`}
                isActive={page === pagination.page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            href={`${basePath}?page=${pagination.page + 1}`}
            aria-disabled={!pagination.hasNextPage}
            className={cn(
              !pagination.hasNextPage && "pointer-events-none opacity-50"
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
