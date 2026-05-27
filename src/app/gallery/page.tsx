"use client";

import { GallerySection } from "@/components/features/gallery/gallery-section";
import NavbarClient from "@/components/features/layout/navbar";
import { SectionTitle } from "@/components/features/layout/section-title";

export default function GalleryPage() {
  return (
    <div className="relative min-h-dvh overflow-x-hidden">
      <NavbarClient />

      <section className="relative z-10 flex min-h-dvh flex-col items-center px-4 py-12 sm:px-6 sm:py-16 md:py-24">
        <SectionTitle>
          Gallery ♡
        </SectionTitle>

        <div className="w-full mt-2 sm:mt-4 md:mt-6">
          <GallerySection />
        </div>
      </section>
    </div>
  );
}
