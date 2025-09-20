"use client";

import React from "react";

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { User2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserPaymentsLoading() {
  return (
    <Card className="p-0">
      <CardHeader className="pt-4">
        <CardTitle className="flex items-center gap-2">
          <User2 className="h-5 w-5" />
          User Payments
        </CardTitle>
        <CardDescription>
          Your payment status and transaction history
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-4 border-t">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm"
            >
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-28" />
              </div>

              <div className="flex flex-col items-start sm:items-end gap-2">
                <Skeleton className="h-5 w-24" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-8 w-24 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
