"use client";

import {
  Carousel,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselContent,
} from "@/components/ui/carousel";
import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { RoomDetail, RoomImage } from "@/lib/types/rooms";

export const ImageCarousel = ({ room }: { room: RoomDetail }) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const displayImages: RoomImage[] = room.images;

  return (
    <div className="relative overflow-hidden rounded-t-3xl">
      <Carousel className="w-full">
        <CarouselContent>
          {displayImages.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={image.url}
                  alt={`${room.name} - Foto ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  priority
                  quality={75}
                />
                {/* Enhanced overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Show navigation only if more than 1 image */}
        {displayImages.length > 1 && (
          <>
            <CarouselPrevious className="absolute left-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/30 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-110 rounded-full" />
            <CarouselNext className="absolute right-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/30 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-110 rounded-full" />
          </>
        )}
      </Carousel>

      {/* Image Counter with enhanced styling */}
      {displayImages.length > 1 && (
        <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-white/20 backdrop-blur-md text-white text-xs border border-white/30 shadow-lg px-3 py-1 rounded-full">
            📸 {currentSlide + 1} dari {displayImages.length}
          </Badge>
        </div>
      )}

      {/* Enhanced Dot Indicators */}
      {displayImages.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {displayImages.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 shadow-md ${
                index === currentSlide
                  ? "bg-white shadow-lg scale-125 ring-2 ring-white/30"
                  : "bg-white/60 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
