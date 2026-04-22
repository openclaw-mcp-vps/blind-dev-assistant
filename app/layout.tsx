import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";

import "@/app/globals.css";
import { cn } from "@/lib/utils";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans"
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500", "600"]
});

export const metadata: Metadata = {
  metadataBase: new URL("https://blinddevassistant.com"),
  title: "Blind Dev Assistant | Screen Reader Optimized Coding Environment Setup",
  description:
    "Generate personalized VS Code and terminal accessibility setups for blind and visually impaired developers in minutes, not weeks.",
  keywords: [
    "accessible developer tools",
    "screen reader coding",
    "blind developers",
    "VS Code accessibility",
    "inclusive engineering"
  ],
  openGraph: {
    title: "Blind Dev Assistant",
    description:
      "Automated VS Code and terminal setup packages optimized for screen reader workflows.",
    url: "https://blinddevassistant.com",
    siteName: "Blind Dev Assistant",
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Blind Dev Assistant",
    description:
      "Automated setup packages for accessible coding environments and audio-first debugging."
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "bg-[#0d1117] text-slate-100 antialiased",
          spaceGrotesk.variable,
          plexMono.variable,
          "font-[var(--font-sans)]"
        )}
      >
        {children}
      </body>
    </html>
  );
}
