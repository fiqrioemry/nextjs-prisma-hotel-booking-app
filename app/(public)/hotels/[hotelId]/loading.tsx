import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <section className="max-w-6xl mx-auto w-full p-6 space-y-8">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <div className="h-8 w-64 bg-muted animate-pulse rounded"></div>
        <div className="h-5 w-96 bg-muted animate-pulse rounded"></div>
      </div>

      {/* Hotel Image + Desc Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="w-full h-80 bg-muted animate-pulse rounded-lg"></div>
        <div className="space-y-3">
          <div className="h-5 w-72 bg-muted animate-pulse rounded"></div>
          <div className="h-4 w-64 bg-muted animate-pulse rounded"></div>
          <div className="h-4 w-80 bg-muted animate-pulse rounded"></div>
          <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
        </div>
      </div>

      {/* Rooms List Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-48 bg-muted animate-pulse rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="flex flex-col">
              <CardContent className="p-0 flex flex-col flex-1">
                <div className="w-full h-48 bg-muted animate-pulse rounded-t-lg"></div>
                <div className="p-4 space-y-2 flex-1">
                  <div className="h-5 w-32 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-56 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-40 bg-muted animate-pulse rounded"></div>
                </div>
                <div className="h-10 bg-muted animate-pulse w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
