"use client";

import { useEffect, useState } from "react";
import { GalleryMasonry } from "@/components/features/gallery/gallery-masonry";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { loadGallery, type GalleryImage } from "@/lib/gallery";

export function GallerySection() {
  const [images, setImages] = useState<GalleryImage[] | null>(null);

  useEffect(() => {
    loadGallery()
      .then((data) => setImages(data.length === 0 ? [] : data))
      .catch(() => setImages([]));
  }, []);

  if (images === null) return null;

  if (images.length === 0) {
    return (
      <Empty className="min-h-50 border">
        <EmptyHeader>
          <EmptyTitle>No images found</EmptyTitle>
          <Separator className="w-8 opacity-30" />
          <EmptyDescription>
            No images found in the gallery yet~ Check back later!
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent />
      </Empty>
    );
  }

  return <GalleryMasonry images={images} />;
}
