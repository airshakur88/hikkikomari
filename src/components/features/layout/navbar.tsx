"use client";

import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface NavButtonProps {
  href: string;
  label: string;
  children: React.ReactNode;
}

function NavButton({ href, label, children }: NavButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-none",
        "border border-border/50 bg-card/60 backdrop-blur-md",
        "transition-shadow duration-300 hover:shadow-lg",
      )}
      aria-label={label}
    >
      {children}
    </Link>
  );
}

export default function NavbarClient() {
  const pathname = usePathname();
  const isGallery = pathname === "/gallery";
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div
      className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50 flex items-center gap-1.5 sm:gap-2"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingRight: "env(safe-area-inset-right)",
      }}
    >
      {isGallery && (
        <motion.div
          initial={mounted ? { opacity: 0, scale: 0.8 } : false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <NavButton href="/" label="Home">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground transition-colors duration-300" />
          </NavButton>
        </motion.div>
      )}
    </div>
  );
}
