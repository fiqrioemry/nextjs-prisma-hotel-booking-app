"use client";

import {
  Carousel,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselContent,
} from "@/components/ui/carousel";
import React from "react";
import { Badge } from "@/components/ui/badge";

export const ImageCarousel = ({
  images,
  name,
}: {
  images: string[];
  name: string;
}) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const displayImages = images;

  return (
    <div className="relative overflow-hidden">
      <Carousel className="w-full">
        <CarouselContent>
          {displayImages.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative h-56 overflow-hidden">
                <img
                  src={image}
                  alt={`${name} - Image ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Show navigation only if more than 1 image */}
        {displayImages.length > 1 && (
          <>
            <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white border-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white border-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </>
        )}
      </Carousel>

      {/* Image Counter */}
      {displayImages.length > 1 && (
        <div className="absolute top-4 left-4 z-10">
          <Badge variant="secondary" className="bg-black/70 text-white text-xs">
            {currentSlide + 1} / {displayImages.length}
          </Badge>
        </div>
      )}

      {/* Dot Indicators */}
      {displayImages.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {displayImages.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentSlide
                  ? "bg-white shadow-lg scale-125"
                  : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
