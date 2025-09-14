"use client";

import React from "react";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Hotel } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Card className="p-0">
      <CardHeader className="pt-4">
        <CardTitle className="flex items-center gap-2">
          <Hotel className="h-5 w-5" />
          My Bookings
        </CardTitle>
        <CardDescription>
          Your hotel bookings and reservation history
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-4 border-t">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="border rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between gap-4 shadow-sm"
            >
              <div className="flex gap-4">
                {/* Thumbnail skeleton */}
                <Skeleton className="w-28 h-20 rounded-lg" />

                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-48" />
                  <Skeleton className="h-5 w-20 rounded-full" />{" "}
                  {/* status badge */}
                </div>
              </div>

              <div className="flex items-center justify-end">
                <Skeleton className="h-8 w-20 rounded-md" />{" "}
                {/* detail button */}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
