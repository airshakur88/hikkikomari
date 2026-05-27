"use client";

import { useEffect } from "react";
import NavbarClient from "@/components/features/layout/navbar";
import { HeroProfile } from "@/components/features/profile/hero-profile";
import { Separator } from "@/components/ui/separator";
import { useDiscordUser } from "@/hooks/discord";
import { loadGallery } from "@/lib/gallery";

export default function Home() {
  const { user } = useDiscordUser();

  useEffect(() => {
    loadGallery().catch(() => {});
  }, []);

  return (
    <div className="relative min-h-dvh overflow-x-hidden">
      <NavbarClient />

      <section className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-4 sm:px-6">
        <div className="flex w-full max-w-5xl flex-col items-center justify-center py-8 sm:py-16 md:py-0">
          <div className="hidden md:flex md:h-3/4 md:w-full items-center justify-center">
            <HeroProfile user={user} />
          </div>

          <div className="flex md:hidden flex-col items-center gap-4 sm:gap-6">
            <HeroProfile user={user} />
            <Separator className="w-16 opacity-50" />
          </div>
        </div>
      </section>
    </div>
  );
}
