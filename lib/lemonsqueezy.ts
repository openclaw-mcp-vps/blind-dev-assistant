import { createHmac, timingSafeEqual } from "node:crypto";
import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";

export function initLemonClient() {
  lemonSqueezySetup({
    apiKey: process.env.LEMON_SQUEEZY_API_KEY || "",
    onError: (error) => {
      console.error("Lemon Squeezy SDK error", error);
    }
  });
}

export function verifyWebhookSignature(rawBody: string, signatureHeader: string | null): boolean {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  if (!secret || !signatureHeader) return false;

  const digest = createHmac("sha256", secret).update(rawBody).digest("hex");
  const provided = Buffer.from(signatureHeader, "utf8");
  const expected = Buffer.from(digest, "utf8");

  if (provided.length !== expected.length) return false;
  return timingSafeEqual(provided, expected);
}

export function getCheckoutUrl(): string {
  const storeId = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID;
  const productId = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRODUCT_ID;

  if (!storeId || !productId) {
    return "";
  }

  return `https://app.lemonsqueezy.com/checkout/buy/${storeId}?product=${productId}`;
}
