// utils/carousel.ts

export type CarouselSizeType = "11" | "34" | "43"; // Assuming 1:1, 3:4, 4:3 size ratios
export type CarouselDisplayType = "hfh" | "ff" | "f";
export type CarouselAlignType = "start" | "center" | "end";

interface CarouselBreakpointConfig {
  type: CarouselDisplayType;
  align: CarouselAlignType;
}

export type CarouselProductProps = {
  items: Array<any>; // Replace with your actual Item type
  size?: CarouselSizeType;
  base?: CarouselBreakpointConfig;
  sm?: CarouselBreakpointConfig;
  md?: CarouselBreakpointConfig;
  lg?: CarouselBreakpointConfig;
  showDots?: boolean;
  showArrows?: boolean;
  showThumbnails?: boolean;
};

// Maps custom type/size logic to Tailwind basis classes (basis-x/y)
export const getBasisClass = (type: CarouselDisplayType): string => {
  switch (type) {
    case "hfh":
      // half-full-half: 2/3 viewable, so 1/3 item width
      // This is generally handled by the grid layout itself,
      // but for Embla, we calculate the width needed to show 3 slides (1/3)
      // Since 'hfh' suggests a center item is full, and sides are partial,
      // a `basis-1/3` with proper alignment usually works best for the visual effect.
      // However, to simplify for a standard 'basis-x/y' model:
      // If we want 3 items visible, each item should take basis-1/3.
      return "basis-full sm:basis-1/2 md:basis-1/3"; // A sensible default interpretation for responsive partial view
    case "ff":
      // full-full: 2 items visible (1/2 width)
      return "basis-full sm:basis-1/2";
    case "f":
      // full: 1 item visible (full width)
      return "basis-full";
    default:
      return "basis-full";
  }
};

// Maps custom align prop to Embla's align option
export const getAlignOption = (align: CarouselAlignType): string => {
  return align;
};
