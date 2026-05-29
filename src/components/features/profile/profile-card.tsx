"use client";

import { Image as ImageIcon, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ContactForm } from "@/components/features/contact/contact-form";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface ProfileCardProps {
  name: string;
  username?: string;
  bio: string;
  badges?: string[];
  avatarSrc?: string;
  className?: string;
  loading?: boolean;
}

export function ProfileCard({
  name,
  username,
  bio,
  badges: _badges = [],
  avatarSrc,
  className,
  loading = false,
}: ProfileCardProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || loading) return null;

  return (
    <BlurFade
      inView
      duration={0.8}
      className={cn(
        "relative mx-auto w-full max-w-[90vw] sm:max-w-sm md:max-w-lg",
        className,
      )}
    >
      <div className="rounded-none border border-border/25 bg-card/15 p-4 sm:p-6 md:p-8 lg:p-10 shadow-sm">
        <div className="flex flex-col items-center gap-4 sm:gap-5">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-border/25 sm:h-28 sm:w-28 md:h-32 md:w-32">
            {avatarSrc ? (
              <Image
                src={avatarSrc}
                alt={name}
                fill
                sizes="(max-width: 640px) 96px, 128px"
                className="object-cover"
                loading="eager"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted text-3xl sm:text-4xl text-muted-foreground">
                ♡
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-1">
            <h1 className="font-bold text-xl tracking-tight text-foreground sm:text-2xl md:text-3xl">
              {name}
            </h1>
            {username && (
              <p className="text-foreground/80 text-xs sm:text-sm">
                @{username}
              </p>
            )}
          </div>

          <p className="max-w-xs sm:max-w-sm text-center text-foreground/80 text-sm leading-relaxed md:text-base">
            {bio}
          </p>

          <Separator className="w-12 opacity-40" />

          <div className="flex w-full flex-col gap-2 sm:flex-row sm:gap-3">
            <Sheet>
              <SheetTrigger asChild>
        <Button
          variant="default"
          className="btn-hero flex flex-1 items-center font-border justify-center gap-2 cursor-pointer hover:bg-border transition-colors duration-300 text-sm px-2.5"
        >
          <Mail className="size-4" />
          Contato
        </Button>
              </SheetTrigger>
              <SheetContent side="right" className="sm:max-w-md w-[85vw]">
                <SheetHeader className="px-6 pt-4 pb-0">
                  <SheetTitle>Contato ♡</SheetTitle>
                  <SheetDescription>
                    Envie uma mensagem e entrarei em contato!
                  </SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto">
                  <ContactForm />
                </div>
              </SheetContent>
            </Sheet>
        <Button
          className="btn-hero flex flex-1 items-center font-border justify-center gap-2 cursor-pointer hover:bg-border transition-colors duration-300 text-sm px-2.5"
          asChild
        >
              <Link href="/gallery">
                <ImageIcon className="size-4" />
                Meus Desenhos
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </BlurFade>
  );
}
