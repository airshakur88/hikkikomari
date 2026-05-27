import { get, set } from "idb-keyval";
import type { GalleryImage } from "@/lib/gallery";

const CACHE_KEY = "gallery_cache";
const CACHE_TTL = 30 * 60 * 1000;

interface GalleryCache {
  images: GalleryImage[];
  timestamp: number;
}

export async function getGalleryCache(): Promise<GalleryImage[] | null> {
  try {
    const cache = await get<GalleryCache>(CACHE_KEY);
    if (!cache) return null;
    if (Date.now() - cache.timestamp > CACHE_TTL) return null;
    return cache.images;
  } catch {
    return null;
  }
}

export async function setGalleryCache(images: GalleryImage[]): Promise<void> {
  try {
    await set(CACHE_KEY, { images, timestamp: Date.now() });
  } catch {}
}
