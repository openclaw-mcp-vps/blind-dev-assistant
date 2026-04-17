"use client";

import { useState } from "react";
import Script from "next/script";
import { Lock, CreditCard, KeyRound } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    LemonSqueezy?: {
      Url?: {
        Open: (url: string) => void;
      };
    };
  }
}

const checkoutUrl =
  process.env.NEXT_PUBLIC_LEMON_SQUEEZY_CHECKOUT_URL ||
  `https://app.lemonsqueezy.com/checkout/buy/${process.env.NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID ?? ""}`;

export function PaywallGate() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(
    "Purchase Blind Dev Assistant Pro, then unlock access using the same checkout email."
  );

  const handleCheckout = () => {
    if (!checkoutUrl) {
      setMessage("Checkout is not configured. Set NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID first.");
      return;
    }

    try {
      if (window.LemonSqueezy?.Url?.Open) {
        window.LemonSqueezy.Url.Open(checkoutUrl);
      } else {
        window.open(checkoutUrl, "_blank", "noopener,noreferrer");
      }
      setMessage("Checkout opened. Return here after payment to unlock access.");
    } catch {
      window.open(checkoutUrl, "_blank", "noopener,noreferrer");
      setMessage("Checkout opened in a new tab.");
    }
  };

  const handleUnlock = async () => {
    if (!email) {
      setMessage("Enter the email used at checkout.");
      return;
    }

    setLoading(true);
    setMessage("Checking purchase records...");

    try {
      const response = await fetch("/api/unlock-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unlock failed");
      }

      setMessage("Access unlocked. Reloading dashboard now.");
      window.location.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to unlock access right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script src="https://app.lemonsqueezy.com/js/lemon.js" strategy="afterInteractive" />

      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-cyan-300" />
            Pro Access Required
          </CardTitle>
          <CardDescription>
            The config generator is available on the $19/month plan and is protected behind a paid-access cookie.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-slate-700 bg-slate-950 p-4 text-sm text-slate-300">
            Includes guided assessment, downloadable VS Code config package, extension presets, terminal profile, and
            spoken install feedback.
          </div>

          <Button type="button" size="lg" className="w-full" onClick={handleCheckout}>
            <CreditCard className="mr-2 h-4 w-4" />
            Checkout with Lemon Squeezy
          </Button>

          <div className="space-y-2">
            <label htmlFor="unlock-email" className="text-sm font-medium text-slate-200">
              Unlock email
            </label>
            <Input
              id="unlock-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
            />
          </div>

          <Button type="button" variant="secondary" className="w-full" onClick={handleUnlock} disabled={loading}>
            <KeyRound className="mr-2 h-4 w-4" />
            {loading ? "Verifying Purchase..." : "Unlock My Dashboard"}
          </Button>

          <p className="rounded-md border border-slate-700 bg-slate-900 p-3 text-sm text-slate-300" aria-live="polite">
            {message}
          </p>
        </CardContent>
      </Card>
    </>
  );
}
