import React from "react";
import { LoaderCircle } from "lucide-react";

export function LoadingPage() {
  return (
    <div>
      <LoaderCircle className="mx-auto h-14 w-14 animate-spin" />
      <p className="text-center">Loading...</p>
    </div>
  );
}
