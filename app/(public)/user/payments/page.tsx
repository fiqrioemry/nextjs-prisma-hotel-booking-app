import React from "react";
import { Metadata } from "next";
import { getMyPayments } from "@/lib/actions/my";
import { UserPaymentsLists } from "@/components/user/user-payments-lists";

export const metadata: Metadata = {
  title: "My Payments - Hotel Booking",
  description: "View and manage your payment history.",
};

export default async function Page() {
  const { data: payments, pagination } = await getMyPayments();

  return (
    <div className="max-w-5xl mx-auto w-full space-y-8 h-full">
      <UserPaymentsLists pagination={pagination} payments={payments} />
    </div>
  );
}
