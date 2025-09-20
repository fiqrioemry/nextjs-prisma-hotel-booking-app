import React, { Suspense } from "react";
import SignInForm from "@/components/auth/signin-form";
import { LoadingPage } from "@/components/shared/loading-page";

export default async function Page() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <SignInForm />
    </Suspense>
  );
}
