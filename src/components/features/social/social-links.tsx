"use client";

import { motion } from "motion/react";
import {
  DiscordIcon,
  InstagramIcon,
  RedditIcon,
  SpotifyIcon,
  SteamIcon,
  TwitterIcon,
} from "@/components/icons";
import { BlurFade } from "@/components/ui/blur-fade";
import { cn } from "@/lib/utils";

interface SocialLink {
  label: string;
  href: string;
  icon: React.ReactNode;
  color: string;
  hoverColor: string;
}

const links: SocialLink[] = [
  {
    label: "Discord",
    href: "https://discord.com",
    icon: <DiscordIcon size={18} role="img" aria-label="Discord" />,
    color: "#5865F2",
    hoverColor: "rgba(88, 101, 242, 0.15)",
  },
  {
    label: "Twitter",
    href: "https://twitter.com",
    icon: <TwitterIcon size={18} role="img" aria-label="Twitter" />,
    color: "#1DA1F2",
    hoverColor: "rgba(29, 161, 242, 0.15)",
  },
  {
    label: "Reddit",
    href: "https://reddit.com",
    icon: <RedditIcon size={18} role="img" aria-label="Reddit" />,
    color: "#FF4500",
    hoverColor: "rgba(255, 69, 0, 0.15)",
  },
  {
    label: "Spotify",
    href: "https://spotify.com",
    icon: <SpotifyIcon size={18} role="img" aria-label="Spotify" />,
    color: "#1DB954",
    hoverColor: "rgba(30, 185, 84, 0.15)",
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: <InstagramIcon size={18} role="img" aria-label="Instagram" />,
    color: "#E4405F",
    hoverColor: "rgba(228, 64, 95, 0.15)",
  },
  {
    label: "Steam",
    href: "https://store.steampowered.com",
    icon: <SteamIcon size={18} role="img" aria-label="Steam" />,
    color: "#1B2838",
    hoverColor: "rgba(27, 40, 56, 0.15)",
  },
];

interface SocialLinksProps {
  className?: string;
}

export function SocialLinks({ className }: SocialLinksProps) {
  return (
    <BlurFade
      inView
      delay={0.2}
      duration={0.6}
      className={cn("flex flex-wrap justify-center gap-2 sm:gap-3", className)}
    >
      {links.map((link, i) => (
        <motion.a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + i * 0.07, duration: 0.4 }}
          whileHover={{ scale: 1.12, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="group relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-none border border-border bg-muted transition-colors duration-200 hover:bg-[var(--link-hover-bg)]"
          style={
            {
              "--link-color": link.color,
              "--link-hover-bg": link.hoverColor,
            } as React.CSSProperties
          }
          aria-label={link.label}
        >
          <div className="text-muted-foreground transition-colors duration-200 group-hover:text-[var(--link-color)]">
            {link.icon}
          </div>
          <div className="pointer-events-none absolute -top-8 hidden sm:block rounded-none bg-foreground px-2 py-1 text-background text-xs opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            {link.label}
          </div>
        </motion.a>
      ))}
    </BlurFade>
  );
}
