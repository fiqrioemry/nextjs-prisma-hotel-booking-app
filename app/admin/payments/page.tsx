import React from "react";
import { PaymentsList } from "@/components/admin/payments/payments-list";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Payments - Admin Dashboard",
  description: "Manage payments in the admin dashboard.",
};

export default async function Page() {
  return (
    <div>
      <PaymentsList />
    </div>
  );
}
