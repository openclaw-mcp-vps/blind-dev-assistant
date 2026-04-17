import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://blind-dev-assistant.com"),
  title: "Blind Dev Assistant | Screen Reader Optimized Coding Environment Setup",
  description:
    "Generate personalized VS Code, terminal, and debugging configurations designed for blind developers and accessibility teams.",
  openGraph: {
    title: "Blind Dev Assistant",
    description:
      "Set up an accessible coding environment in minutes, not weeks. Personalized VS Code settings, shortcuts, and audio feedback.",
    type: "website",
    url: "https://blind-dev-assistant.com",
    siteName: "Blind Dev Assistant"
  },
  twitter: {
    card: "summary_large_image",
    title: "Blind Dev Assistant",
    description:
      "Accessible coding setup with custom VS Code packages and guided installation for screen reader workflows."
  },
  keywords: [
    "blind developers",
    "accessible coding environment",
    "screen reader development",
    "VS Code accessibility",
    "inclusive developer tools"
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#0d1117] text-slate-100 antialiased">{children}</body>
    </html>
  );
}
