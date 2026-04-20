import { NextResponse } from "next/server";

import { hasPaidOrder, paywallCookieName, paywallCookieValue } from "@/lib/lemonsqueezy";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const orderId = url.searchParams.get("order_id");

  if (!orderId) {
    return new NextResponse("Missing order_id query parameter.", { status: 400 });
  }

  const isPaidOrder = await hasPaidOrder(orderId);

  if (!isPaidOrder) {
    return new NextResponse(
      "Order not found yet. If checkout was just completed, wait for the webhook and retry in a few seconds.",
      { status: 403 }
    );
  }

  const response = NextResponse.redirect(new URL("/dashboard?access=unlocked", request.url));
  response.cookies.set({
    name: paywallCookieName,
    value: paywallCookieValue,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === "production"
  });

  return response;
}
