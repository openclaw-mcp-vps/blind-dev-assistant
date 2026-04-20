import * as LemonSqueezySDK from "@lemonsqueezy/lemonsqueezy.js";
import { createHmac, timingSafeEqual } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

interface PurchaseRecord {
  orderId: string;
  email: string;
  productId?: string;
  status: "paid" | "refunded";
  createdAt: string;
}

const dataFile = path.join(process.cwd(), "data", "purchases.json");

export const paywallCookieName = "bda_paid_access";
export const paywallCookieValue = "active";

export function getCheckoutUrlFromEnv(): string | null {
  const productId = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRODUCT_ID;
  if (!productId) {
    return null;
  }

  if (productId.startsWith("http://") || productId.startsWith("https://")) {
    return productId;
  }

  return `https://checkout.lemonsqueezy.com/buy/${productId}`;
}

export function verifyLemonSqueezySignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;

  if (!secret || !signature) {
    return false;
  }

  const digest = createHmac("sha256", secret).update(rawBody).digest("hex");

  try {
    return timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
  } catch {
    return false;
  }
}

async function readPurchases(): Promise<PurchaseRecord[]> {
  try {
    const raw = await fs.readFile(dataFile, "utf8");
    const parsed = JSON.parse(raw) as PurchaseRecord[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
}

async function writePurchases(records: PurchaseRecord[]) {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(records, null, 2), "utf8");
}

export async function upsertPurchase(record: PurchaseRecord) {
  const records = await readPurchases();
  const index = records.findIndex((item) => item.orderId === record.orderId);

  if (index === -1) {
    records.push(record);
  } else {
    records[index] = record;
  }

  await writePurchases(records);
}

export async function hasPaidOrder(orderId: string): Promise<boolean> {
  const records = await readPurchases();
  return records.some((record) => record.orderId === orderId && record.status === "paid");
}

export function sdkLoaded(): boolean {
  return Object.keys(LemonSqueezySDK).length > 0;
}

export function hasPaidCookie(value: string | undefined): boolean {
  return value === paywallCookieValue;
}
