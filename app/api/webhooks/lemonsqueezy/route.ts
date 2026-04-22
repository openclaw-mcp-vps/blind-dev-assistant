import { NextResponse } from "next/server";

import { markEmailPaid, verifyStripeWebhookSignature } from "@/lib/lemonsqueezy";

type StripeWebhookEvent = {
  id: string;
  type: string;
  created?: number;
  data?: {
    object?: {
      customer_email?: string;
      customer_details?: {
        email?: string;
      };
      amount_total?: number;
      currency?: string;
    };
  };
};

export const runtime = "nodejs";

export async function POST(request: Request): Promise<NextResponse> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET is not configured." },
      { status: 500 }
    );
  }

  const rawPayload = await request.text();
  const signatureHeader = request.headers.get("stripe-signature");

  const validSignature = verifyStripeWebhookSignature({
    payload: rawPayload,
    signatureHeader,
    webhookSecret
  });

  if (!validSignature) {
    return NextResponse.json({ error: "Invalid Stripe signature." }, { status: 400 });
  }

  const event = JSON.parse(rawPayload) as StripeWebhookEvent;

  if (event.type === "checkout.session.completed") {
    const checkout = event.data?.object;
    const email = checkout?.customer_details?.email ?? checkout?.customer_email;

    if (email) {
      await markEmailPaid({
        email,
        status: "paid",
        source: "stripe",
        eventId: event.id,
        purchasedAt: new Date((event.created ?? Date.now() / 1000) * 1000).toISOString(),
        amountTotal: checkout?.amount_total,
        currency: checkout?.currency
      });
    }
  }

  return NextResponse.json({ received: true });
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    ok: true,
    endpoint: "/api/webhooks/lemonsqueezy",
    purpose: "Stripe checkout webhook receiver"
  });
}
