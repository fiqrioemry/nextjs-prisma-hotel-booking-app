"use client";

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { MetaPagination } from "@/lib/actions/hotels";
import { User2, Receipt, Calendar, CreditCard } from "lucide-react";
import { PaginationTable } from "@/components/shared/pagination-table";

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

export const UserPaymentsLists = ({
  payments,
  pagination,
}: {
  payments: payments[];
  pagination: MetaPagination;
}) => {
  return (
    <Card className="p-0">
      <CardHeader className="pt-4">
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-8 w-8" />
          User Payments
        </CardTitle>
        <CardDescription>
          Your payment status and transaction history
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-4 border-t">
        {/* when no history */}
        {payments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <Receipt className="w-12 h-12 mb-3 opacity-40" />
            <p className="text-lg font-medium">No payment history found</p>
            <p className="text-sm">Your payments will appear here</p>
          </div>
        )}

        {/* when history exists */}
        {payments.length > 0 && (
          <>
            <PaymentsList payments={payments} />
            {/* pagination */}
            <div className="pt-6">
              <PaginationTable
                pagination={pagination}
                basePath="/user/payments"
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const PaymentsList = ({ payments }: { payments: payments[] }) => {
  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <div
          key={payment.id}
          className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm"
        >
          <div className="space-y-1">
            <p className="font-semibold">Invoice #{payment.invoiceNo}</p>
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
  );
};
