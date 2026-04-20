"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CheckoutSuccessPage() {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const claimAccess = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!orderId.trim()) {
      setStatus("Enter your Lemon Squeezy order ID to unlock access.");
      return;
    }

    setLoading(true);
    setStatus("Validating purchase and unlocking this browser...");

    window.location.href = `/api/checkout/claim?order_id=${encodeURIComponent(orderId.trim())}`;
  };

  return (
    <main className="section-shell py-10 md:py-16">
      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <CardTitle>Complete Access Unlock</CardTitle>
          <CardDescription>
            After checkout, confirm your order ID once to set secure access for this browser.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={claimAccess}>
            <label className="grid gap-2 text-sm text-slate-200" htmlFor="orderId">
              Lemon Squeezy order ID
              <input
                id="orderId"
                type="text"
                value={orderId}
                onChange={(event) => setOrderId(event.target.value)}
                className="h-10 rounded-md border border-[#30363d] bg-[#0b1220] px-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </label>

            <Button disabled={loading} type="submit">
              {loading ? "Unlocking..." : "Unlock Dashboard Access"}
            </Button>

            {status ? <p className="text-sm text-slate-300">{status}</p> : null}
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
