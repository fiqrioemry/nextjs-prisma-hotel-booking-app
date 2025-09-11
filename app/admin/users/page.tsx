import React from "react";
import { UsersList } from "@/components/admin/users/users-lists";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Users - Admin Dashboard",
  description: "Manage users in the admin dashboard.",
};

export default async function Page() {
  return (
    <div>
      <UsersList />
    </div>
  );
}
