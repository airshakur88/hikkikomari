import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { VideoBackground } from "@/components/features/layout/video-background";
import "./globals.css";

const interSans = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "~ Hikkikomari ~",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "~ Hikkikomari ~",
    type: "website",
    images: [
      {
        url: "https://hikkikomari.lol/21951af0-b994-47a1-beb6-bf9f2194c3a8.jpg",
        width: 1200,
        height: 630,
        alt: "~ Hikkikomari ~",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "~ Hikkikomari ~",
    images: [
      "https://hikkikomari.lol/21951af0-b994-47a1-beb6-bf9f2194c3a8.jpg",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={interSans.variable}>
      <head />
      <body suppressHydrationWarning className={`min-h-full flex flex-col antialiased`}>
        <VideoBackground />
        {children}
      </body>
    </html>
  );
}
