import React from "react";
import { Construction } from "lucide-react";

export const RoomDetail = () => {
  return (
    <div className="max-w-4xl w-full mx-auto">
      <h1 className="text-2xl font-bold mb-4">Room Detail</h1>
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
