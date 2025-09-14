import React from "react";
import { Metadata } from "next";
import { getDashboardStatistics } from "@/lib/actions/admin";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Overview of admin dashboard statistics.",
};

export default async function Page() {
  const dashboardData = await getDashboardStatistics();

  return (
    <div className="space-y-6 w-full mx-auto px-4 md:px-8">
      <AdminDashboard dashboardData={dashboardData} />
    </div>
  );
}
