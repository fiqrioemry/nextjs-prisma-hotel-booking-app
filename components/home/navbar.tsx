import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import React from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { LogIn } from "lucide-react";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <header className="py-4 bg-card">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-lg font-bold">FinanceTracker</h1>

        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage
                  src={session?.user.image!}
                  alt={session?.user.name!}
                />
                <AvatarFallback>{session?.user.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                <Link href="/summary">Dashboard</Link>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div>
            <Button asChild variant="outline" className="mr-2">
              <Link href="/signin" className="space-x-2">
                <LogIn />
                <span>Signin</span>
              </Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
