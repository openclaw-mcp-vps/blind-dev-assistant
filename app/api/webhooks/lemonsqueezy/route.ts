import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { verifyWebhookSignature } from "@/lib/lemonsqueezy";

type PurchaseRecord = {
  email: string;
  createdAt: string;
  source: string;
  orderId?: string;
  productName?: string;
};

const purchasesPath = join(process.cwd(), "data", "purchases.json");

function readPurchases(): PurchaseRecord[] {
  if (!existsSync(purchasesPath)) {
    return [];
  }

  try {
    const raw = readFileSync(purchasesPath, "utf8");
    return JSON.parse(raw) as PurchaseRecord[];
  } catch {
    return [];
  }
}

function writePurchases(purchases: PurchaseRecord[]) {
  writeFileSync(purchasesPath, JSON.stringify(purchases, null, 2), "utf8");
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody) as {
    meta?: { event_name?: string };
    data?: { attributes?: Record<string, unknown>; id?: string };
  };

  const eventName = payload.meta?.event_name || "unknown";
  const attributes = payload.data?.attributes || {};

  const email =
    (attributes.user_email as string | undefined) ||
    (attributes.customer_email as string | undefined) ||
    (attributes.email as string | undefined);

  if (!email) {
    return Response.json({ status: "ignored", reason: "email_missing" });
  }

  const purchases = readPurchases();
  const normalizedEmail = email.toLowerCase().trim();

  const alreadyExists = purchases.some((purchase) => purchase.email === normalizedEmail);
  if (!alreadyExists) {
    purchases.push({
      email: normalizedEmail,
      createdAt: new Date().toISOString(),
      source: eventName,
      orderId: payload.data?.id,
      productName: (attributes.product_name as string | undefined) ?? "Blind Dev Assistant Pro"
    });
    writePurchases(purchases);
  }

  return Response.json({ status: "ok" });
}
