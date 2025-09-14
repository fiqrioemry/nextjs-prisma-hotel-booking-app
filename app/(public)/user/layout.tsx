import React from "react";
import { UserSidebar } from "@/components/user/user-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto w-full pt-24 py-6 ">
      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="hidden md:block">
          <UserSidebar />
        </div>

        {/* Content */}
        <div className="flex-1 min-h-[80vh] ">{children}</div>
      </div>
    </div>
  );
}
