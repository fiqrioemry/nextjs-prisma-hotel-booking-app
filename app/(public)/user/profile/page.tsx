import React from "react";
import { Metadata } from "next";
import { getMyProfile } from "@/lib/actions/my";
import { UserProfileForm } from "@/components/user/user-profile-form";

export const metadata: Metadata = {
  title: "Profile Ku - Pesan Hotel",
  description: "Lihat dan kelola informasi profil Anda.",
};

export const dynamic = "force-dynamic";
export const revalidate = 600;

export default async function Page() {
  const profile = await getMyProfile();

  return (
    <div className="max-w-5xl mx-auto w-full space-y-8 h-full">
      <UserProfileForm profile={profile} />
    </div>
  );
}
