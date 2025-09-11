"use client";

import {
  Sidebar,
  SidebarRail,
  SidebarFooter,
  SidebarHeader,
  SidebarContent,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Link from "next/link";
import * as React from "react";
import { NavMain } from "./admin-nav-menu";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { UserDropdown } from "@/components/shared/user-drop-down";
import {
  ZapIcon,
  CreditCard,
  SquareTerminal,
  Book,
  Home,
  User2,
  ChartArea,
} from "lucide-react";

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const { data } = authClient.useSession();

  const user = data?.user;

  const navItems = [
    {
      title: "Dashboard",
      url: "/admin",
      icon: ChartArea,
      isActive: pathname === "/admin",
    },
    {
      title: "users",
      url: "/admin/users",
      icon: User2,
      isActive: pathname === "/admin/users",
    },
    {
      title: "Hotels",
      url: "/admin/hotels",
      icon: Home,
      isActive: pathname === "/admin/hotels",
    },
    {
      title: "Bookings",
      url: "/admin/bookings",
      icon: Book,
      isActive: pathname === "/admin/bookings",
    },
    {
      title: "Payments",
      url: "/admin/payments",
      icon: CreditCard,
      isActive: pathname === "/admin/payments",
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex gap-2 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-1 bg-primary/10 rounded">
              <ZapIcon className="w-4 h-4 text-primary" />
            </div>
            <div className="grid flex-1 text-left text-md py-4 font-mono leading-tight">
              <span className="truncate font-medium">
                Easy<span className="text-primary">Task</span>.io
              </span>
            </div>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuItem>
          <UserDropdown user={user!} />
        </SidebarMenuItem>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
