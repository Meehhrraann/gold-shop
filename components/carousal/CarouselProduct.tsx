"use client";

// --- Imports ---
import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

// --- Types ---
interface Item {
  id: string;
  url: string;
  name: string;
  price: string;
}

// Updated Props interface to include 'align' and 'loop'
interface CarouselProductProps {
  items: Item[];
  aspectRatio: "1:1" | "4:3" | "3:4";
  basisClassName?: string;
  autoplay?: boolean;
  autoplayDelay?: number;
  showDots?: boolean;
  showArrows?: boolean;
  showThumbnails?: boolean;
  showThumbnailArrows?: boolean;
  className?: string;
  thumbnailClassName?: string;
  maxWidth?: string;
  // New Embla Props
  align?: "start" | "center" | "end";
  loop?: boolean;
}

// --- Aspect Ratio Utility ---
const getAspectRatioClass = (
  aspectRatio: CarouselProductProps["aspectRatio"],
) => {
  switch (aspectRatio) {
    case "1:1":
      return "aspect-square";
    case "4:3":
      return "aspect-[4/3]";
    case "3:4":
      return "aspect-[3/4]";
    default:
      return "aspect-square"; // Default
  }
};

// --- Component + props ---
export function CarouselProduct({
  items,
  aspectRatio,
  basisClassName = "basis-full",
  autoplay = false,
  autoplayDelay = 3000,
  showDots = true,
  showArrows = true,
  showThumbnails = true,
  showThumbnailArrows = true,
  className,
  thumbnailClassName,
  maxWidth,
  // Default values for new props
  align = "start",
  loop = true,
}: CarouselProductProps) {
  // --- State ---
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [thumbApi, setThumbApi] = React.useState<CarouselApi>();

  // --- settings ---
  // Effect to update the current index for dots/thumbnails
  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap() + 1);

    const handleSelect = () => {
      const index = api.selectedScrollSnap() + 1;
      setCurrent(index);
    };

    api.on("select", handleSelect);
    api.on("reInit", handleSelect);

    return () => {
      api.off("select", handleSelect);
      api.off("reInit", handleSelect);
    };
  }, [api, thumbApi]);

  const autoplayPlugin = React.useRef(
    Autoplay({ delay: autoplayDelay, stopOnInteraction: true }),
  );

  const handleThumbnailClick = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  const style = maxWidth ? { maxWidth } : {};

  // --- Render ---
  return (
    <div className={cn("flex w-full flex-col gap-4", className)} style={style}>
      {/* --- Fallback if no items --- */}
      {items.length === 0 && (
        <div
          className={cn("relative w-full", getAspectRatioClass(aspectRatio))}
        >
          <Image
            src={"/no-image.jpg"}
            alt="nothing"
            aria-hidden="true"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
            // <--- UPDATED: Changed to bg-gray-500 placeholder
            className="rounded-lg bg-gray-500 transition-transform duration-500 ease-in-out hover:scale-105"
          />
        </div>
      )}

      {/* --- Main Carousel (Product Images) --- */}
      <Carousel
        setApi={setApi}
        plugins={autoplay ? [autoplayPlugin.current] : []}
        opts={{
          // Applied new props here
          loop: loop,
          align: align,
        }}
        className="relative"
      >
        <CarouselContent className="-ml-1">
          {items.length > 0 &&
            items.map((item, index) => (
              <CarouselItem key={index} className={cn("pl-1", basisClassName)}>
                <div className="p-1">
                  <div className="relative overflow-hidden rounded-lg shadow-lg">
                    <div
                      className={cn(
                        "relative w-full",
                        getAspectRatioClass(aspectRatio),
                      )}
                    >
                      <Image
                        src={item.url || "/no-image.jpg"}
                        alt={index.toString()}
                        aria-hidden="true"
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                        style={{ objectFit: "cover" }}
                        // <--- UPDATED: Changed to bg-gray-500 placeholder
                        className="bg-gray-500 transition-transform duration-500 ease-in-out hover:scale-105"
                        priority={index === 0}
                      />
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
        </CarouselContent>
        {items.length > 0 && showArrows && (
          <>
            <CarouselPrevious className="left-2 border-none bg-black/30 text-gray-500 shadow-md" />
            <CarouselNext className="right-2 border-none bg-black/30 text-gray-500 shadow-md" />
          </>
        )}
        {items.length > 0 && showDots && (
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 space-x-2 rounded-full bg-black/30 p-1">
            {items.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "h-2 w-2 rounded-full transition-colors duration-200",
                  index + 1 === current
                    ? "bg-[#e8ca89] hover:bg-[#e8ca89]/80"
                    : "bg-gray-300",
                )}
                onClick={() => handleThumbnailClick(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </Carousel>

      {/* --- Thumbnail Navigation (Secondary Carousel with Scroll Arrows) --- */}
      {items.length > 0 && showThumbnails && (
        <Carousel
          setApi={setThumbApi}
          className={cn("flex w-full justify-center", thumbnailClassName)}
          opts={{ align: "center", slidesToScroll: 3 }}
        >
          <CarouselContent className="-ml-2">
            {items.map((item, index) => (
              <CarouselItem
                key={`thumb-${index}`}
                className="w-24 basis-auto"
                onClick={() => handleThumbnailClick(index)}
              >
                <div
                  className={cn(
                    "relative aspect-square w-full cursor-pointer overflow-hidden rounded-md border-2 transition-all duration-300",
                    index + 1 === current
                      ? "scale-[1.02] border-[#e8ca89] shadow-md"
                      : "border-gray-200 opacity-70 hover:opacity-100",
                  )}
                >
                  <Image
                    src={item.url || "/no-image.jpg"}
                    alt={index.toString()}
                    fill
                    sizes="(max-width: 768px) 20vw, 10vw"
                    style={{ objectFit: "cover" }}
                    // <--- UPDATED: Added bg-gray-500 placeholder here too
                    className="bg-gray-500"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Arrows for SCROLLING the thumbnails */}
          {items.length > 0 && showThumbnailArrows && (
            <>
              <CarouselPrevious className="top-1/2 -left-4 h-8 w-8 -translate-y-1/2 border-none bg-black/40 text-gray-500 shadow-md disabled:opacity-0" />
              <CarouselNext className="top-1/2 -right-4 h-8 w-8 -translate-y-1/2 border-none bg-black/40 text-gray-500 shadow-md disabled:opacity-0" />
            </>
          )}
        </Carousel>
      )}
    </div>
  );
}
