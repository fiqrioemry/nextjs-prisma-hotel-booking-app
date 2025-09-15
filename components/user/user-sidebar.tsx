"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { User2, CreditCard, Hotel } from "lucide-react";
import { SignOutButton } from "@/components/auth/signout-button";

const navItems = [
  { href: "/user/profile", label: "Profile", icon: User2 },
  { href: "/user/bookings", label: "Pemesanan", icon: Hotel },
  { href: "/user/payments", label: "Pembayaran", icon: CreditCard },
];

export function UserSidebar() {
  const pathname = usePathname();

  return (
    <Card className="p-4 sticky top-24 h-fit w-64 shadow-lg">
      <nav className="space-y-2">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === href
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
        <Separator className="my-4" />
        <div className="text-xs text-muted-foreground">
          <SignOutButton />
        </div>
      </nav>
    </Card>
  );
}
