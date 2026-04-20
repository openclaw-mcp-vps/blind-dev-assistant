import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk, Geist } from "next/font/google";

import "@/app/globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const heading = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "700"]
});

const body = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "700"]
});

export const metadata: Metadata = {
  metadataBase: new URL("https://blind-dev-assistant.com"),
  title: "Blind Dev Assistant | Screen Reader Optimized Coding Setup",
  description:
    "Generate a production-ready VS Code and terminal setup tailored for blind developers, including accessible keybindings, extension packs, and guided installation.",
  keywords: [
    "blind developer tools",
    "accessible VS Code",
    "screen reader coding",
    "inclusive engineering tooling",
    "developer accessibility"
  ],
  openGraph: {
    title: "Blind Dev Assistant",
    description:
      "Screen reader optimized coding environment setup with downloadable configuration bundles.",
    type: "website",
    url: "https://blind-dev-assistant.com"
  },
  twitter: {
    card: "summary_large_image",
    title: "Blind Dev Assistant",
    description:
      "Build a reliable, screen reader-first coding environment in minutes instead of weeks."
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("dark", "font-sans", geist.variable)}>
      <body className={`${heading.variable} ${body.variable} bg-[#0d1117] font-[var(--font-body)] text-slate-100`}>
        {children}
      </body>
    </html>
  );
}
