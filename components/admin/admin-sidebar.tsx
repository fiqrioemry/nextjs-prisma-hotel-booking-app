"use client";

import {
  Sidebar,
  SidebarRail,
  SidebarFooter,
  SidebarHeader,
  SidebarContent,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  Book,
  Home,
  User2,
  ChartArea,
  CreditCard,
  LayoutDashboard,
  Hotel,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { NavMain } from "./admin-nav-menu";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { SignOutButton } from "@/components/auth/signout-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
      title: "Hotels",
      url: "/admin/hotels",
      icon: Home,
      isActive: pathname.startsWith("/admin/hotels"),
    },
    {
      title: "Bookings",
      url: "/admin/bookings",
      icon: Book,
      isActive: pathname.startsWith("/admin/bookings"),
    },
    {
      title: "Payments",
      url: "/admin/payments",
      icon: CreditCard,
      isActive: pathname.startsWith("/admin/payments"),
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex gap-2 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-primary/10 rounded">
              <Hotel className="w-8 h-8 text-primary" />
            </div>
            <div className="grid flex-1 text-left text-md py-4 font-mono leading-tight">
              <span className="truncate font-medium">EasyBook</span>
            </div>
          </div>
        </div>

        <ThemeToggle />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 focus:outline-none">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user?.image || undefined}
                    alt={user?.name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {user?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {pathname.startsWith("/") && (
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user?.name}</span>
                    <span className="truncate text-xs">{user?.email}</span>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={user?.image || undefined}
                      alt={user?.name}
                    />
                    <AvatarFallback className="rounded-lg">
                      {user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user?.name}</span>
                    <span className="truncate text-xs">{user?.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <SignOutButton />
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
