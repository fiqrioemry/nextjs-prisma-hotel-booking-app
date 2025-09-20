export const dynamic = "force-dynamic";

import React from "react";
import { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Overview of admin dashboard statistics.",
};

export default function Page() {
  return (
    <div className="space-y-6 w-full mx-auto px-4 md:px-8">
      <AdminDashboard />
    </div>
  );
}
