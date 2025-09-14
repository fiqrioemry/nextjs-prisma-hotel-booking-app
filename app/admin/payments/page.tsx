import React from "react";
import { PaymentsList } from "@/components/admin/payments-list";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Payments - Admin Dashboard",
  description: "Manage payments in the admin dashboard.",
};

export default function Page() {
  return (
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <PaymentsList />
    </div>
  );
}
