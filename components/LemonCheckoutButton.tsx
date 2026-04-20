"use client";

import { useEffect } from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    createLemonSqueezy?: () => void;
  }
}

interface LemonCheckoutButtonProps {
  checkoutUrl: string;
  label?: string;
}

export function LemonCheckoutButton({ checkoutUrl, label = "Start Pro Access" }: LemonCheckoutButtonProps) {
  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-lemon-squeezy="true"]');
    if (existing) {
      window.createLemonSqueezy?.();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://app.lemonsqueezy.com/js/lemon.js";
    script.defer = true;
    script.dataset.lemonSqueezy = "true";
    script.onload = () => window.createLemonSqueezy?.();
    document.head.appendChild(script);
  }, []);

  return (
    <Button asChild size="lg">
      <a className="lemonsqueezy-button" href={checkoutUrl}>
        {label}
        <ArrowRight className="h-4 w-4" />
      </a>
    </Button>
  );
}
