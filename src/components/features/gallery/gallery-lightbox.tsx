"use client";

import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { Dialog as DialogPrimitive } from "radix-ui";
import { useCallback, useEffect, useState } from "react";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogClose,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import type { GalleryImage } from "@/lib/gallery";
import { cn } from "@/lib/utils";

interface GalleryLightboxProps {
  images: GalleryImage[];
  selectedIndex: number;
  onClose: () => void;
}

function CarouselNavPrevious({ className }: { className?: string }) {
  const { scrollPrev } = useCarousel();

  return (
    <button
      type="button"
      onClick={scrollPrev}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 z-20",
        "left-1 sm:left-2",
        "size-9 sm:size-10 rounded-none",
        "border-border/25 cursor-pointer bg-foreground/15 hover:bg-border/25 transition-colors duration-300",
        "text-white/80 hover:text-white",
        "inline-flex items-center justify-center",
        className,
      )}
    >
      <ChevronLeftIcon className="size-4 sm:size-5" />
      <span className="sr-only">Previous slide</span>
    </button>
  );
}

function CarouselNavNext({ className }: { className?: string }) {
  const { scrollNext } = useCarousel();

  return (
    <button
      type="button"
      onClick={scrollNext}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 z-20",
        "right-1 sm:right-2",
        "size-9 sm:size-10 rounded-none",
        "border-border/25 cursor-pointer bg-foreground/15 hover:bg-border/25 transition-colors duration-300",
        "text-white/80 hover:text-white",
        "inline-flex items-center justify-center",
        className,
      )}
    >
      <ChevronRightIcon className="size-4 sm:size-5" />
      <span className="sr-only">Next slide</span>
    </button>
  );
}

export function GalleryLightbox({
  images,
  selectedIndex,
  onClose,
}: GalleryLightboxProps) {
  const open = selectedIndex >= 0;
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(selectedIndex);

  const handleContentClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("button") ||
        target.closest("[data-slot='dialog-close']") ||
        target.closest("img")
      ) {
        return;
      }
      onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    setCurrent(selectedIndex);
  }, [selectedIndex]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogPortal>
        <DialogOverlay className="bg-black/80! backdrop-blur-sm" />
        <DialogPrimitive.Content
          onEscapeKeyDown={onClose}
          onClick={handleContentClick}
          aria-describedby={undefined}
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center",
            "bg-transparent border-0 shadow-none ring-0 p-0",
            "outline-none",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
            "data-[state=closed]:pointer-events-none",
          )}
        >
          <DialogTitle className="sr-only">Gallery lightbox</DialogTitle>

          <DialogClose asChild>
            <button
              type="button"
              onClick={onClose}
              data-slot="dialog-close"
              className={cn(
                "absolute top-3 right-3 sm:top-4 sm:right-4 z-10",
                "size-9 sm:size-10 rounded-none",
                "border-border/25 cursor-pointer bg-foreground/15 hover:bg-border/25 transition-colors duration-300",
                "text-white/80 hover:text-white",
                "inline-flex items-center justify-center",
              )}
            >
              <XIcon className="size-4 sm:size-5" />
              <span className="sr-only">Close</span>
            </button>
          </DialogClose>

          <Carousel
            key={selectedIndex}
            setApi={setApi}
            opts={{
              loop: true,
              startIndex: selectedIndex,
              watchDrag: false,
              duration: 20,
            }}
            className="w-[95vw] max-w-[95vw] sm:w-[90vw] sm:max-w-[90vw] md:w-[85vw] md:max-w-[85vw] overflow-visible"
          >
            <CarouselContent className="transition-none">
              {images.map((img, index) => (
                <CarouselItem key={img.src}>
                  <div
                    className={cn(
                      "flex items-center justify-center transition-opacity duration-200",
                      index === current ? "opacity-100" : "opacity-0",
                    )}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={0}
                      height={0}
                      sizes="(max-width: 640px) 90vw, (max-width: 768px) 85vw, 75vw"
                      loading={
                        Math.abs(index - selectedIndex) <= 2 ? "eager" : "lazy"
                      }
                      className={cn(
                        "max-h-[70vh] sm:max-h-[75vh] md:max-h-[80vh] max-w-[90vw] sm:max-w-[85vw] md:max-w-[75vw] h-auto w-auto",
                        "object-contain rounded-[var(--radius-card)] sm:rounded-[var(--radius-2xl)]",
                      )}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselNavPrevious />
            <CarouselNavNext />
          </Carousel>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
