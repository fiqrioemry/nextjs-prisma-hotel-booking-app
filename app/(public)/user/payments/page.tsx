import { UserPaymentsLists } from "@/components/user/user-payments-lists";
import { getMyPayments } from "@/lib/actions/my";
import React from "react";

export default async function Page() {
  const { data: payments, pagination } = await getMyPayments();

  return (
    <div className="max-w-5xl mx-auto w-full space-y-8 h-full">
      <UserPaymentsLists pagination={pagination} payments={payments} />
    </div>
  );
}
