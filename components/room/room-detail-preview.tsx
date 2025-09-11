import React from "react";

export const RoomDetailPreview = ({ room }: { room: any }) => {
  return (
    <div className="max-w-6xl w-full p-6 rounded-lg shadow-md">
      <div className="mb-4 space-y-4 text-start">
        <h1 className="text-2xl font-bold">Room Detail</h1>
        <p className="text-muted-foreground text-md">
          Room Detail Descriptions
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <img
          src={room.images[0]}
          alt={room.name}
          className="w-full h-64 object-cover rounded-lg"
        />
        <div className="flex flex-col justify-between">
          <h2 className="text-xl font-semibold">{room.name}</h2>
          <p className="text-muted-foreground">{room.description}</p>
        </div>
      </div>
    </div>
  );
};
