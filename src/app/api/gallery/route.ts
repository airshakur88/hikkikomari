import { readdir } from "node:fs/promises";
import { join } from "node:path";

export async function GET() {
  const galleryDir = join(process.cwd(), "public", "gallery");

  try {
    const files = (await readdir(galleryDir)).filter((f) =>
      /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(f),
    );

    const images = files.map((f) => ({
      src: `/gallery/${f}`,
      alt: f.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
    }));

    return Response.json(images);
  } catch {
    return Response.json([]);
  }
}
