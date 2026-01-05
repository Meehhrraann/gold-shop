// fix : romove py from shadcn card
"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";

import { IProduct } from "@/models/product.model"; // Import your interface
import Link from "next/link";

interface BannerProps {
  products: IProduct[];
}

export const Banner = ({ products }: BannerProps) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const isMobile = useIsMobile();

  const alignment = isMobile ? "center" : "start";

  const onPrev = useCallback(() => carouselApi?.scrollPrev(), [carouselApi]);
  const onNext = useCallback(() => carouselApi?.scrollNext(), [carouselApi]);

  useEffect(() => {
    if (!carouselApi) return;
    const updateCurrent = () =>
      setCurrent(carouselApi.selectedScrollSnap() + 1);
    carouselApi.on("select", updateCurrent);
    updateCurrent();
    return () => {
      carouselApi.off("select", updateCurrent);
    };
  }, [carouselApi]);

  // If no products, don't render or show a skeleton
  if (!products || products.length === 0) return null;

  return (
    <div className="flex justify-center py-8">
      <div className="relative w-full max-w-5xl">
        <p className="mb-4 px-5 text-right font-bold">محصولات ویژه</p>

        <Carousel
          setApi={setCarouselApi}
          opts={{ loop: true, align: alignment }}
          className="z-10 w-full"
          plugins={[Autoplay({ delay: 3000, stopOnInteraction: true })]}
        >
          <CarouselContent className="-ml-1">
            {products.map((product) => (
              <CarouselItem
                key={product._id.toString()}
                className="basis-[85%] pl-1 sm:basis-1/2 md:basis-1/2 lg:basis-1/3"
              >
                <div className="p-1">
                  <Card className="overflow-hidden rounded-xl border-none bg-transparent text-white">
                    <CardContent className="flex aspect-[3/4] flex-col items-center justify-center p-0">
                      {/* Image Container */}
                      <div className="relative h-[75%] w-full overflow-hidden">
                        <Link
                          href={`/products/${product._id}-${product.displaySlug}`}
                          target="_blank" // This opens the new tab
                          rel="noopener noreferrer" // Security best practice for target="_blank"
                        >
                          <Image
                            src={product.media[0]?.url || "/no-image.jpg"}
                            alt={product.name}
                            fill // Use fill for better responsive control in relative containers
                            className="object-cover transition-transform duration-500 hover:scale-105"
                          />
                        </Link>
                      </div>

                      {/* Details Container */}
                      <div className="flex h-[25%] w-full flex-col items-center justify-center bg-[#2d2d2d] px-2">
                        <div className="mb-1 line-clamp-1 text-sm font-semibold">
                          {product.name}
                        </div>
                        <div className="text-sm font-bold text-[#e8ca89]">
                          {product.price.toLocaleString()} ریال
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Navigation Arrows */}
        {!isMobile && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={onPrev}
              className="absolute top-1/2 -left-12 z-30 -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/20"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onNext}
              className="absolute top-1/2 -right-12 z-30 -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/20"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </Button>
          </>
        )}

        {/* Pagination Dots */}
        <div className="mt-6 flex justify-center gap-2">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => carouselApi?.scrollTo(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                current === index + 1 ? "w-6 bg-[#e8ca89]" : "w-1.5 bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
