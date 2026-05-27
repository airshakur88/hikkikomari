"use client";

import { BlurFade } from "@/components/ui/blur-fade";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  children: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export function SectionTitle({
  children,
  subtitle,
  className,
}: SectionTitleProps) {
  return (
    <BlurFade
      inView
      duration={0.6}
      className={cn(
        "flex flex-col items-center gap-2 sm:gap-3 text-center px-4",
        className,
      )}
    >
      <h2 className="font-semibold text-2xl tracking-tight text-foreground sm:text-3xl md:text-4xl">
        {children}
      </h2>
      {subtitle && (
        <p className="max-w-xs sm:max-w-sm md:max-w-md text-foreground/80 text-sm sm:text-base">
          {subtitle}
        </p>
      )}
    </BlurFade>
  );
}
