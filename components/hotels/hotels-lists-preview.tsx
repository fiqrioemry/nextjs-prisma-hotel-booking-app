import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Card, CardContent } from "../ui/card";

export const HotelsListPreview = ({ hotels }: { hotels: any }) => {
  return (
    <div className="p-4 max-w-7xl mx-auto w-full space-y-8">
      <div className="text-start space-y-2">
        <h1 className="text-3xl font-bold mb-4">Available Hotels</h1>
        <p className="text-muted-foreground text-lg">
          Browse through our selection of hotels.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {hotels.map((hotel: any) => (
          <Card key={hotel.id} className="bg-card p-0">
            <CardContent className="p-4">
              <img
                src={hotel.thumbnail}
                alt={hotel.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{hotel.name}</h2>
                <p className="text-gray-600 mb-2">{hotel.address}</p>
                <p className="text-gray-800">{hotel.description}</p>
              </div>
              <Button className="w-full rounded-none" asChild>
                <Link href={`/hotels/${hotel.id}`}>See Available Rooms</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
