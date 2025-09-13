import React from "react";

import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import { AppLogo } from "@/components/shared/app-logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { NavbarDropdown } from "@/components/home/navbar-dropdown";
import { UserNavItems } from "./user-nav-items";

export default async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <header className="py-4 bg-card border-b">
      <div className="flex items-center justify-between gap-4 mx-auto container max-w-7xl px-4 ">
        <AppLogo />
        <div>
          <UserNavItems />
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {session ? (
            <NavbarDropdown user={session?.user!} />
          ) : (
            <Button variant="outline" className="rounded-full " asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
