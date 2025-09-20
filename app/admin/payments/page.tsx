import React from "react";
import { PaymentsList } from "@/components/admin/payments-list";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Payments - Admin Dashboard",
  description: "Manage payments in the admin dashboard.",
};

export default function Page() {
  return (
    <div className="space-y-6 w-full mx-auto px-4 md:px-8">
      <PaymentsList />
    </div>
  );
}
