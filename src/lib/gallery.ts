import { getGalleryCache, setGalleryCache } from "@/lib/gallery-cache";
import { shuffleArray } from "@/lib/shuffle";

export interface GalleryImage {
  src: string;
  alt: string;
  aspectRatio: number;
}

const ratios = [0.7, 0.75, 0.8, 0.85, 0.9, 1, 1.1, 1.25, 1.33, 1.5];

function assignRatios(images: { src: string; alt: string }[]): GalleryImage[] {
  return images.map((img) => ({
    ...img,
    aspectRatio: ratios[Math.floor(Math.random() * ratios.length)],
  }));
}

async function fetchAndProcessGallery(): Promise<GalleryImage[]> {
  const res = await fetch("/api/gallery");
  const data: { src: string; alt: string }[] = await res.json();
  if (data.length === 0) return [];
  const withAspect = assignRatios(data);
  const shuffled = shuffleArray(withAspect);
  await setGalleryCache(shuffled);
  return shuffled;
}

export async function loadGallery(): Promise<GalleryImage[]> {
  const cached = await getGalleryCache();
  if (cached) return cached;
  return fetchAndProcessGallery();
}

export function prefetchGallery() {
  loadGallery().catch(() => {});
}
