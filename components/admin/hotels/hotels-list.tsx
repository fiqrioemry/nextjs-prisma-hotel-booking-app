import React from "react";
import { Construction } from "lucide-react";
import { Button } from "@/components/ui/button";

export const HotelsList = () => {
  return (
    <div className="max-w-7xl w-full mx-auto">
      <div className="flex items-center justify-between mb-6 space-y-2 border-b">
        <div>
          <h1 className="text-2xl font-bold mb-4">Hotels List</h1>
          <p>Manage hotels in the admin dashboard.</p>
        </div>
        <Button>Add New Hotel</Button>
      </div>
      <div className="h-96 flex items-center justify-center border">
        <div>
          <Construction className="h-12 w-12 mx-auto text-center" />
          <p className="text-muted-foreground text-lg mt-2">
            Under Construction
          </p>
        </div>
      </div>
    </div>
  );
};
