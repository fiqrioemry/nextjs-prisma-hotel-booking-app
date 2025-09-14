import React from "react";
import { Metadata } from "next";
import { UserSettingsControl } from "@/components/user/user-settings-control";

export const metadata: Metadata = {
  title: "Settings - Hotel Booking",
  description: "View and manage your settings information.",
};

export default async function Page() {
  return (
    <div className="max-w-5xl mx-auto w-full space-y-8 h-full">
      <UserSettingsControl />
    </div>
  );
}
