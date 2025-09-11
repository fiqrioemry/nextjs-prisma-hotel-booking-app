import React from "react";

export default function Page() {
  return (
    <div className="space-y-6 max-w-7xl w-full mx-auto px-4 md:px-0">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your admin settings and configurations.
        </p>
      </div>
      <div className="h-96 w-full border border-dashed"></div>
    </div>
  );
}
