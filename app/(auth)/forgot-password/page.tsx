import React, { Suspense } from "react";
import { LoadingPage } from "@/components/shared/loading-page";
import ForgotPasswordForm from "@/components/auth/forgot-password-form";

export default function Page() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
