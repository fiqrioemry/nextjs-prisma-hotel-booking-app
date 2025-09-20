import React, { Suspense } from "react";
import { verifyResetToken } from "@/lib/actions/auth";
import { LoadingPage } from "@/components/shared/loading-page";
import ResetPasswordForm from "@/components/auth/reset-password-form";

type ResetParams = {
  token: string;
};

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password - Hotel Booking",
  description: "Reset your password for your Hotel Booking account.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<ResetParams>;
}) {
  const { token } = await searchParams;
  const isValid = await verifyResetToken(token!);

  return (
    <Suspense fallback={<LoadingPage />}>
      <ResetPasswordForm token={token!} isValid={isValid} />
    </Suspense>
  );
}
