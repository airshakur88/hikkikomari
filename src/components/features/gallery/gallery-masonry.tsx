"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GalleryLightbox } from "@/components/features/gallery/gallery-lightbox";
import { BlurFade } from "@/components/ui/blur-fade";
import type { GalleryImage } from "@/lib/gallery";
import { cn } from "@/lib/utils";

interface GalleryMasonryProps {
  images: GalleryImage[];
  className?: string;
}

function distributeImagesToColumns(
  images: GalleryImage[],
  count: number,
): GalleryImage[][] {
  const cols: GalleryImage[][] = Array.from({ length: count }, () => []);
  const heights = Array.from({ length: count }, () => 0);

  for (const img of images) {
    const shortest = heights.indexOf(Math.min(...heights));
    cols[shortest].push(img);
    heights[shortest] += 1 / img.aspectRatio;
  }

  return cols;
}

function getColumnCountForWidth(width: number): number {
  if (width < 480) return 2;
  if (width < 768) return 2;
  if (width < 1024) return 3;
  return 3;
}

export function GalleryMasonry({ images, className }: GalleryMasonryProps) {
  const [colCount, setColCount] = useState(() =>
    typeof window !== "undefined"
      ? getColumnCountForWidth(window.innerWidth)
      : 3,
  );
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const columns = useMemo(
    () => distributeImagesToColumns(images, colCount),
    [images, colCount],
  );

  const handleImageClick = useCallback(
    (image: GalleryImage) => {
      const idx = images.findIndex((i) => i.src === image.src);
      if (idx >= 0) setSelectedIndex(idx);
    },
    [images],
  );

  const handleCloseLightbox = useCallback(() => {
    setSelectedIndex(-1);
  }, []);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setColCount(getColumnCountForWidth(window.innerWidth));
      }, 150);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div
        className={cn(
          "mx-auto w-full max-w-7xl flex gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 px-1 sm:px-0",
          className,
        )}
      >
        {columns.map((col, colIndex) => (
          <div
            key={col.map((img) => img.src).join("|")}
            className="flex flex-1 flex-col gap-1.5 sm:gap-2 md:gap-3 lg:gap-4"
          >
            {col.map((img, imgIndex) => (
              <GalleryItem
                key={img.src}
                image={img}
                index={colIndex * 10 + imgIndex}
                onClick={() => handleImageClick(img)}
              />
            ))}
          </div>
        ))}
      </div>

      <GalleryLightbox
        images={images}
        selectedIndex={selectedIndex}
        onClose={handleCloseLightbox}
      />
    </>
  );
}

function GalleryItem({
  image,
  index,
  onClick,
}: {
  image: GalleryImage;
  index: number;
  onClick?: () => void;
}) {
  return (
    <BlurFade inView duration={0.5} delay={index * 0.05} inViewMargin="-30px">
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "relative overflow-hidden rounded-none border border-border/30 bg-card/40 shadow-sm w-full text-left",
          onClick && "cursor-pointer",
        )}
      >
        <div
          className="relative w-full"
          style={{ aspectRatio: `${image.aspectRatio}` }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 480px) 50vw, (max-width: 768px) 50vw, 33vw"
            loading={index < 6 ? "eager" : "lazy"}
            className="object-cover"
          />
        </div>
      </button>
    </BlurFade>
  );
}
