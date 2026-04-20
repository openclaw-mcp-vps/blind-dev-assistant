import { NextResponse } from "next/server";

import { upsertPurchase, verifyLemonSqueezySignature } from "@/lib/lemonsqueezy";

export const runtime = "nodejs";

function normalizeStatus(eventName: string): "paid" | "refunded" {
  if (eventName.includes("refund") || eventName.includes("cancel")) {
    return "refunded";
  }

  return "paid";
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-signature");

  if (!verifyLemonSqueezySignature(rawBody, signature)) {
    return new NextResponse("Invalid webhook signature.", { status: 401 });
  }

  let body: any;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return new NextResponse("Webhook payload is not valid JSON.", { status: 400 });
  }

  const eventName = String(body?.meta?.event_name ?? "unknown");
  const attributes = body?.data?.attributes ?? {};

  const orderId = String(attributes?.order_id ?? body?.data?.id ?? "");
  const email = String(attributes?.user_email ?? attributes?.customer_email ?? "unknown@example.com");
  const productId =
    attributes?.first_order_item?.product_id != null ? String(attributes?.first_order_item?.product_id) : undefined;

  if (!orderId) {
    return NextResponse.json({ received: true, ignored: true, reason: "missing order id" }, { status: 200 });
  }

  await upsertPurchase({
    orderId,
    email,
    productId,
    status: normalizeStatus(eventName),
    createdAt: new Date().toISOString()
  });

  return NextResponse.json({ received: true, eventName }, { status: 200 });
}
