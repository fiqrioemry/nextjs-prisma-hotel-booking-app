"use client";

import React from "react";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function SignInSocial({
  provider,
  redirectUrl,
  children,
}: {
  provider: "github" | "google";
  redirectUrl: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      className="w-full rounded-md "
      onClick={async () => {
        await signIn.social({
          provider,
          callbackURL: redirectUrl,
        });
      }}
      type="button"
      variant={"outline"}
    >
      {children}
    </Button>
  );
}
