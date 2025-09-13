import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <section className="p-6 max-w-7xl mx-auto w-full space-y-8">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 bg-muted animate-pulse rounded"></div>
        <div className="h-5 w-72 bg-muted animate-pulse rounded"></div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="bg-card p-0 flex flex-col">
            <CardContent className="p-0 flex flex-col flex-1">
              <div className="w-full h-48 bg-muted animate-pulse rounded-t-lg"></div>
              <div className="p-4 space-y-2">
                <div className="h-5 w-40 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-28 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
              </div>
              <div className="h-10 bg-muted animate-pulse w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
