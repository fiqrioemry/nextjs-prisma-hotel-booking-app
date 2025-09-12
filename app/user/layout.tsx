import React from "react";
import { UserSidebar } from "@/components/user/user-sidebar";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1 hidden md:block">
          <UserSidebar />
        </div>
        <div className="md:col-span-3">{children}</div>
      </div>
    </div>
  );
}
