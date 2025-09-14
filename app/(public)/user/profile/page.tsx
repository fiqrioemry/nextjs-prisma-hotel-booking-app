import React from "react";
import { Metadata } from "next";
import { getMyProfile } from "@/lib/actions/my";
import { UserProfileForm } from "@/components/user/user-profile-form";

export const metadata: Metadata = {
  title: "My Profile - Hotel Booking",
  description: "View and manage your profile information.",
};

export default async function Page() {
  const res = await getMyProfile();

  return (
    <div className="max-w-5xl mx-auto w-full space-y-8 h-full">
      <UserProfileForm profile={res} />
    </div>
  );
}
