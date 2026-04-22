import { createHmac, timingSafeEqual } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";

export type PurchaseRecord = {
  email: string;
  status: "paid";
  source: "stripe";
  eventId: string;
  purchasedAt: string;
  amountTotal?: number;
  currency?: string;
};

type PurchaseStore = {
  records: PurchaseRecord[];
};

const storePath = path.join(process.cwd(), "data", "purchases.json");

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function setupLegacyLemonSqueezyClient(apiKey?: string): void {
  if (!apiKey) {
    return;
  }

  lemonSqueezySetup({
    apiKey,
    onError(error) {
      console.error("LemonSqueezy setup error:", error);
    }
  });
}

async function ensureStoreExists(): Promise<void> {
  try {
    await fs.access(storePath);
  } catch {
    await fs.mkdir(path.dirname(storePath), { recursive: true });
    const initialStore: PurchaseStore = { records: [] };
    await fs.writeFile(storePath, JSON.stringify(initialStore, null, 2), "utf-8");
  }
}

async function readStore(): Promise<PurchaseStore> {
  await ensureStoreExists();
  const raw = await fs.readFile(storePath, "utf-8");
  return JSON.parse(raw) as PurchaseStore;
}

async function writeStore(store: PurchaseStore): Promise<void> {
  await fs.writeFile(storePath, JSON.stringify(store, null, 2), "utf-8");
}

export async function markEmailPaid(record: PurchaseRecord): Promise<void> {
  const store = await readStore();
  const normalizedEmail = normalizeEmail(record.email);

  const existingIndex = store.records.findIndex(
    (item) => item.email === normalizedEmail
  );

  const normalizedRecord: PurchaseRecord = {
    ...record,
    email: normalizedEmail,
    status: "paid",
    source: "stripe"
  };

  if (existingIndex >= 0) {
    store.records[existingIndex] = normalizedRecord;
  } else {
    store.records.push(normalizedRecord);
  }

  await writeStore(store);
}

export async function hasPaidAccess(email: string): Promise<boolean> {
  const store = await readStore();
  const normalizedEmail = normalizeEmail(email);
  return store.records.some(
    (record) => record.email === normalizedEmail && record.status === "paid"
  );
}

export function verifyStripeWebhookSignature(params: {
  payload: string;
  signatureHeader: string | null;
  webhookSecret: string;
}): boolean {
  const { payload, signatureHeader, webhookSecret } = params;

  if (!signatureHeader || !webhookSecret) {
    return false;
  }

  const elements = signatureHeader.split(",").map((part) => part.trim());
  const timestamp = elements
    .find((part) => part.startsWith("t="))
    ?.replace("t=", "");
  const signatures = elements
    .filter((part) => part.startsWith("v1="))
    .map((part) => part.replace("v1=", ""));

  if (!timestamp || signatures.length === 0) {
    return false;
  }

  const signedPayload = `${timestamp}.${payload}`;
  const expected = createHmac("sha256", webhookSecret)
    .update(signedPayload)
    .digest("hex");

  return signatures.some((candidate) => {
    const expectedBuffer = Buffer.from(expected);
    const candidateBuffer = Buffer.from(candidate);

    if (expectedBuffer.length !== candidateBuffer.length) {
      return false;
    }

    return timingSafeEqual(expectedBuffer, candidateBuffer);
  });
}
