"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function UnlockAccessForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/access/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = (await response.json().catch(() => null)) as
        | { error?: string; success?: boolean }
        | null;

      if (!response.ok) {
        setMessage(
          data?.error ??
            "We could not verify your purchase yet. Stripe webhooks may still be processing."
        );
        return;
      }

      setMessage("Access unlocked. Redirecting to your assessment...");
      router.push("/assessment");
      router.refresh();
    } catch {
      setMessage("Network error while unlocking access. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      <Label htmlFor="unlock-email">Purchased already? Enter your checkout email</Label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          id="unlock-email"
          type="email"
          required
          placeholder="you@company.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Checking..." : "Unlock Access"}
        </Button>
      </div>
      {message ? <p className="text-sm text-cyan-200">{message}</p> : null}
    </form>
  );
}
