"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <Button
      className="flex justify-start w-full"
      variant="ghost"
      onClick={handleSignOut}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Log out
    </Button>
  );
}
