import React, { Suspense } from "react";
import SignUpForm from "@/components/auth/signup-form";
import { LoadingPage } from "@/components/shared/loading-page";

export default async function Page() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <SignUpForm />
    </Suspense>
  );
}
