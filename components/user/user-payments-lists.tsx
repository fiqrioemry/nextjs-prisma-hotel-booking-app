"use client";

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User2, Receipt, Calendar, CreditCard } from "lucide-react";

type payments = {
  id: string;
  invoiceNo: string;
  amount: number;
  status: "PAID" | "PENDING" | "FAILED";
  paymentUrl: string;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
};

type pagination = {
  page: number;
  total: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export const UserPaymentsLists = ({
  payments,
  pagination,
}: {
  payments: payments[];
  pagination: pagination;
}) => {
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
      <CardContent className="space-y-6 p-4">
        {/* Kondisi: tidak ada data */}
        {payments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <Receipt className="w-12 h-12 mb-3 opacity-40" />
            <p className="text-lg font-medium">No payment history found</p>
            <p className="text-sm">Your payments will appear here</p>
          </div>
        )}

        {/* Kondisi: ada data */}
        {payments.length > 0 && (
          <>
            <div className="space-y-4">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm"
                >
                  <div className="space-y-1">
                    <p className="font-semibold">
                      Invoice #{payment.invoiceNo}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CreditCard className="w-4 h-4" />
                      {payment.paymentMethod}
                    </div>
                  </div>

                  <div className="flex flex-col items-start sm:items-end gap-2">
                    <p className="font-bold text-lg">
                      Rp {new Intl.NumberFormat("id-ID").format(payment.amount)}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={cn(
                          payment.paymentUrl
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-yellow-500 hover:bg-yellow-600"
                        )}
                      >
                        {payment.paymentUrl ? "Paid" : "Pending"}
                      </Badge>

                      {payment.paymentUrl && (
                        <Button asChild size="sm" variant="outline">
                          <a href={payment.paymentUrl} target="_blank">
                            View Invoice
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            <div className="pt-6">
              <Pagination>
                <PaginationContent>
                  {/* Prev */}
                  <PaginationItem>
                    <PaginationPrevious
                      href={`?page=${pagination.page - 1}`}
                      aria-disabled={!pagination.hasPrevPage}
                      className={cn(
                        !pagination.hasPrevPage &&
                          "pointer-events-none opacity-50"
                      )}
                    />
                  </PaginationItem>

                  {/* Page numbers */}
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href={`?page=${page}`}
                        isActive={page === pagination.page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  {/* Next */}
                  <PaginationItem>
                    <PaginationNext
                      href={`?page=${pagination.page + 1}`}
                      aria-disabled={!pagination.hasNextPage}
                      className={cn(
                        !pagination.hasNextPage &&
                          "pointer-events-none opacity-50"
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
