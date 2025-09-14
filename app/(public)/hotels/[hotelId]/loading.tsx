import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <section className="p-4 py-12 max-w-7xl mx-auto w-full min-h-screen mt-14">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Hotel Image + Desc Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="w-full h-80 rounded-lg" />
        <div className="space-y-3">
          <Skeleton className="h-5 w-72" />
          <Skeleton className="h-5 w-72" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-80" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>

      {/* Rooms List Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-48 bg-muted animate-pulse rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="flex flex-col">
              <CardContent className="p-0 flex flex-col flex-1">
                <Skeleton className="w-full h-48 rounded-t-lg" />
                <div className="p-4 space-y-2 flex-1">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-56" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
