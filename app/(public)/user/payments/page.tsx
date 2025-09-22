import React from "react";
import { Metadata } from "next";
import { UserPaymentsLists } from "@/components/user/user-payments-lists";

export const metadata: Metadata = {
  title: "My Payments - Hotel Booking",
  description: "View and manage your payment history.",
};

export default async function Page() {
  return (
    <div className="max-w-5xl mx-auto w-full space-y-8 h-full">
      <UserPaymentsLists />
    </div>
  );
}
